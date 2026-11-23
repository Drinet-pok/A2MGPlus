import { Component, computed, input, output, signal, model, effect } from '@angular/core';

export type TipoFiltro = 'mes' | 'semana' | 'shifting';

export interface FiltroDatos {
  periodo: TipoFiltro | null;
  desde: string;
  hasta: string;
  tipoDato: string;
  tipoResumen: string;
}

export interface BloqueVisual {
  clase: string;
}

@Component({
  selector: 'app-condicion-mesas',
  imports: [],
  templateUrl: './condicion-mesas.html',
  styleUrl: './condicion-mesas.scss',
})
export class CondicionMesas {

  readonly marcas: number[] = [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
    110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330
  ];

  mesas = input.required<BloqueVisual[]>();
  ultimo = computed(() => this.mesas().at(-1) ?? { clase: '' });
  mesasSinUltimo = computed(() => this.mesas().slice(0, -1));

  posicion = input<number | null>(null);

  seleccionada = input<number | null>(null);   // sección activa (1-44)
  seccionClick = output<number>();

  grietas = input<number[]>();

  // Filtro

  mostrarFiltros = signal(false);

  aplicar = output<void>();
  cancelarPanel = output<void>();
  abrirPanel = output<void>();

  abrir() {
    this.abrirPanel.emit();
    this.mostrarFiltros.set(true);
  }

  filtrar() {
    this.aplicar.emit();
    this.mostrarFiltros.set(false);
  }

  cancelar() {
    this.cancelarPanel.emit();
    this.mostrarFiltros.set(false);
  }

  mitad = computed(() => Math.ceil(this.mesasSinUltimo().length / 2));
  primeraMitad = computed(() => this.mesasSinUltimo().slice(0, this.mitad()));
  segundaMitad = computed(() => this.mesasSinUltimo().slice(this.mitad()));



}
