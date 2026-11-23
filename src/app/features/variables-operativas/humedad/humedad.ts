import { Component, computed, inject, input, model, signal, OnInit } from '@angular/core';
import { RegistroHumedad } from './models/registro-humedad.model'
import { HumedadService } from './services/humedad';
import { CondicionMesas, BloqueVisual } from '../../../shared/components/condicion-mesas/condicion-mesas';

const d = new Date();
const hoy = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const MESAS_POR_BLOQUE = 10;
const BLOQUES_POR_LUGAR = 330 / MESAS_POR_BLOQUE; // 33
const TOTAL_BLOQUES = BLOQUES_POR_LUGAR * 2 + 1;  // 67

@Component({
  selector: 'app-humedad',
  imports: [CondicionMesas],
  templateUrl: './humedad.html',
  styleUrl: './humedad.scss',
})
export class Humedad implements OnInit {

  private humedadService = inject(HumedadService);

  registros = signal<RegistroHumedad[]>([]);
  cargando = signal(true);

  filtro = signal<string>('2026-11-18');

  registrosFecha = computed(() =>
    this.registros().filter(r => r.fecha === this.filtro())
  );

  humedadPorBloque = computed(() => {
    const sumas = new Array(TOTAL_BLOQUES).fill(0);
    const cantidades = new Array(TOTAL_BLOQUES).fill(0);

    for (const r of this.registrosFecha()) {
      const columna = Math.max(0, Math.ceil(r.mesa / MESAS_POR_BLOQUE) - 1);

      let fila: number;
      if (r.lugar === 'Cordillera') fila = 0;
      else if (r.lugar === 'Barranco') fila = 1;
      else continue;

      const i = fila * BLOQUES_POR_LUGAR + columna;
      sumas[i] += r.humedad;
      cantidades[i]++;
    }

    return sumas.map((s, i) => cantidades[i] > 0 ? s / cantidades[i] : null);
  });

  bloquesVisuales = computed<BloqueVisual[]>(() =>
    this.humedadPorBloque().map(h => ({ clase: this.claseHumedad(h) }))
  );

  claseHumedad(h: number | null): string {
    if (h === null) return 'UGM0';
    if (h > 15) return 'humedad-alta';
    if (h >= 10) return 'humedad-media';
    return 'humedad-baja';
  }

  bloqueActual = input<number | null>(null);
  grietasPorBloque = input<number[]>([]);
  bloqueSeleccionado = model<number | null>(null);
  bloqueActivo = computed(() => this.bloqueSeleccionado() ?? this.bloqueActual());

  borrador = signal<string>(this.filtro());

  copiarFiltro() {
    this.borrador.set(this.filtro());
  }

  cambiar(cambio: string) {
    this.borrador.set(cambio);
  }

  aplicarFiltro() { this.filtro.set(this.borrador()); }

  seleccionarBloque(numero: number) {
    this.bloqueSeleccionado.set(numero);
  }

  ngOnInit() {
    this.humedadService.obtenerRegistros().subscribe({
      next: (datos) => {
        this.registros.set(datos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}
