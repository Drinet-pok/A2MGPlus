import { Component, computed, input, output, signal, model, effect } from '@angular/core';
import { claseColor } from '../utils/clase-color'

export type TipoFiltro = 'mes' | 'semana' | 'shifting';

export interface FiltroDatos {
  periodo: TipoFiltro | null;
  desde: string;
  hasta: string;
  tipoDato: string;
  tipoResumen: string;
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

  mesas = input.required<{ dias: number; ugm: number; ugmClave: number, granulometria: number }[]>();
  ultimo = computed(() => this.mesas().at(-1) ?? { dias: Infinity, ugm: -Infinity, ugmClave: 0, granulometria: -Infinity });
  mesasSinUltimo = computed(() => this.mesas().slice(0, -1));

  posicion = input<number | null>(null);

  seleccionada = input<number | null>(null);   // sección activa (1-44)
  seccionClick = output<number>();

  grietas = input<number[]>();

  // Filtro
  filtro = model.required<FiltroDatos>();
  tiposDato = ['Ultima Depositación', 'UGM', 'Granulometría'];
  mostrarFiltros = signal(false);
  borrador = signal<FiltroDatos>({ periodo: 'semana', desde: '', hasta: '', tipoDato: '', tipoResumen: ''});

  abrir() {
    this.borrador.set({ ...this.filtro() }); // arranca con lo aplicado
    this.mostrarFiltros.set(true);
  }

  cambiar(cambio: Partial<FiltroDatos>) {
    this.borrador.update(b => ({ ...b, ...cambio }));
  }

  filtrar() {
    this.filtro.set(this.borrador());
    this.mostrarFiltros.set(false);
  }

  cancelar() {
    this.mostrarFiltros.set(false);
  }

  getClaseColor(valor: { dias: number; ugm: number; ugmClave: number; granulometria: number }): string {
    return claseColor(valor, this.filtro().tipoDato);
  }

  mitad = computed(() => Math.ceil(this.mesasSinUltimo().length / 2));
  primeraMitad = computed(() => this.mesasSinUltimo().slice(0, this.mitad()));
  segundaMitad = computed(() => this.mesasSinUltimo().slice(this.mitad()));



}
