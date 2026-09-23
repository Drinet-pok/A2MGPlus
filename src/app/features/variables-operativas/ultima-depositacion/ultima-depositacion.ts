import { Component, computed } from '@angular/core';

@Component({
  selector: 'app-ultima-depositacion',
  imports: [],
  templateUrl: './ultima-depositacion.html',
  styleUrl: './ultima-depositacion.scss',
})
export class UltimaDepositacion {
    mesas: Array<number> = [
  1, 1, 2, 1, 1, 3, 1, 2, 1, 1,
  1, 2, 1, 3, 1, 1, 2, 1, 1, 1,
  2, 1, 1, 1, 3, 2, 1, 1, 2, 1,
  1, 1, 2, 1, 3, 1, 1, 2, 1, 1,
  1, 2, 1, 1
];

private mapaColores: Record<number, string> = {
    1: 'color-verde',
    2: 'color-amarillo',
    3: 'color-rojo'
  };

  getClaseColor(valor: number): string {
    return this.mapaColores[valor];
  }

 mitad = computed(() => Math.ceil(this.mesas.length / 2));

  primeraMitad = computed(() => this.mesas.slice(0, this.mitad()));
  segundaMitad = computed(() => this.mesas.slice(this.mitad()));
}
