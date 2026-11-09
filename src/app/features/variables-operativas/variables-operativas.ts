import { Component, computed, inject, signal } from '@angular/core';
import { InfoDiaria } from '../../shared/components/info-diaria/info-diaria';
import { CondicionMesas } from '../../shared/components/condicion-mesas/condicion-mesas';
import { PosicionEsparcidor } from './ultima-depositacion/models/posicion-esparcidor.model';
import { UltimaDepositacionService } from './ultima-depositacion/services/ultima-depositacion';
import { UltimaDepositacion } from './ultima-depositacion/ultima-depositacion';
import { Georreferencia } from '../../shared/components/georreferencia/georreferencia';

const MESAS_POR_BLOQUE = 10;
const BLOQUES_POR_LUGAR = 330 / MESAS_POR_BLOQUE;
const TOTAL_BLOQUES = BLOQUES_POR_LUGAR * 2 + 1; // 45: el último es el bloque especial
const MESA_GIRO = 331;

type vistaOpertiva = 'depositacion' | 'nivelFreatico' | 'humedad';


@Component({
  selector: 'app-variables-operativas',
  imports: [InfoDiaria, UltimaDepositacion, Georreferencia],
  templateUrl: './variables-operativas.html',
  styleUrl: './variables-operativas.scss',
})
export class VariablesOperativas {

  vistaActual = signal<vistaOpertiva>('depositacion');

  cambiarVista(vista: vistaOpertiva) {
    this.vistaActual.set(vista);
  }

  private ultimaDepositacionService = inject(UltimaDepositacionService);

  posicionEsparcidor = signal<PosicionEsparcidor[]>([]);
  cargandoPosicionEsparcidor = signal(true);
  
    ultimaPosicionEsparcidor = computed(() => {
      const lista = this.posicionEsparcidor();
      if (lista.length === 0) return null;
  
      return lista.reduce((ultima, actual) =>
        new Date(actual.fecha).getTime() > new Date(ultima.fecha).getTime() ? actual : ultima
      );
    });

  bloqueActual = computed<number | null>(() => {
      const pos = this.ultimaPosicionEsparcidor();
      if (!pos) return null;
  
      const indice = Math.min(
        BLOQUES_POR_LUGAR - 1,
        Math.max(0, Math.ceil(pos.mesa / MESAS_POR_BLOQUE) - 1)
      );
  
      const offset = pos.lugar.toLowerCase() === 'barranco' ? BLOQUES_POR_LUGAR : 0;
  
      return indice + 1 + offset;
    });

  bloqueSeleccionado = signal<number | null>(null);
  bloqueActivo = computed<number | null>(
    () => this.bloqueSeleccionado() ?? this.bloqueActual()
  );

  seleccionarBloque(numero: number) {
    this.bloqueSeleccionado.set(numero);
  }

  volverAUltimaPosicion() {
    this.bloqueSeleccionado.set(null);
  }

  ngOnInit() {
    this.ultimaDepositacionService.obtenerPosiciones().subscribe({
      next: (datos) => {
        this.posicionEsparcidor.set(datos);
        this.cargandoPosicionEsparcidor.set(false);

      },
      error: () => this.cargandoPosicionEsparcidor.set(false)
    });
  }
  
}
