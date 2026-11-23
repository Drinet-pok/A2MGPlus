import { Component, computed, inject, signal } from '@angular/core';
import { InfoDiaria } from '../../shared/components/info-diaria/info-diaria';
import { PosicionEsparcidor } from './ultima-depositacion/models/posicion-esparcidor.model';
import { UltimaDepositacionService } from './ultima-depositacion/services/ultima-depositacion';
import { UltimaDepositacion } from './ultima-depositacion/ultima-depositacion';
import {Humedad} from '../variables-operativas/humedad/humedad'
import { Georreferencia } from '../../shared/components/georreferencia/georreferencia';
import { Grietas } from './ultima-depositacion/models/grietas.models';

const MESAS_POR_BLOQUE = 10;
const BLOQUES_POR_LUGAR = 330 / MESAS_POR_BLOQUE;
const TOTAL_BLOQUES = BLOQUES_POR_LUGAR * 2 + 1; // 45: el último es el bloque especial
const MESA_GIRO = 331;

type vistaOpertiva = 'depositacion' | 'nivelFreatico' | 'humedad';


@Component({
  selector: 'app-variables-operativas',
  imports: [InfoDiaria, UltimaDepositacion, Georreferencia, Humedad],
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

  /*
  seleccionarBloque(numero: number) {
    this.bloqueSeleccionado.set(numero);
  }

  volverAUltimaPosicion() {
    this.bloqueSeleccionado.set(null);
  }
  */
  calcularDias(fechaObjetivo: Date | string): number {
    const MS_POR_DIA = 1000 * 60 * 60 * 24;

    const hoy = new Date();
    const objetivo = typeof fechaObjetivo === 'string'
      ? new Date(
        Number(fechaObjetivo.slice(0, 4)),
        Number(fechaObjetivo.slice(5, 7)) - 1,
        Number(fechaObjetivo.slice(8, 10))
      )
      : new Date(fechaObjetivo);

    hoy.setHours(0, 0, 0, 0);
    objetivo.setHours(0, 0, 0, 0);

    const diferenciaMs = objetivo.getTime() - hoy.getTime();

    return Math.round(diferenciaMs / MS_POR_DIA);
  }

  grietas = signal<Grietas[]>([]);

  grietasSemana = computed(() =>
    this.grietas().filter(g => Math.abs(this.calcularDias(g.fecha)) <= 7)
  );

  grietasPorBloque = computed(() => {
    const bloques: number[] = new Array(TOTAL_BLOQUES).fill(0);

    for (const g of this.grietasSemana()) {
      // Bloque especial (último índice)
      if (g.mesa === MESA_GIRO) {
        bloques[TOTAL_BLOQUES - 1] = 1;
        continue;
      }

      const columna = Math.max(0, Math.ceil(g.mesa / MESAS_POR_BLOQUE) - 1);

      let fila: number;
      if (g.lugar === 'Cordillera') fila = 0;
      else if (g.lugar === 'Barranco') fila = 1;
      else continue;

      bloques[fila * BLOQUES_POR_LUGAR + columna] = 1;
    }

    return bloques;
  });


  ngOnInit() {
    this.ultimaDepositacionService.obtenerPosiciones().subscribe({
      next: (datos) => {
        this.posicionEsparcidor.set(datos);
        this.cargandoPosicionEsparcidor.set(false);

      },
      error: () => this.cargandoPosicionEsparcidor.set(false)
    });

    this.ultimaDepositacionService.obtenerGrietas().subscribe({
      next: (datos) => this.grietas.set(datos),
    });
  }

}
