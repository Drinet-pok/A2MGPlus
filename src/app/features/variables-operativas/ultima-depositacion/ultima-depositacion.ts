import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { UltimaDepositacionService } from './services/ultima-depositacion';
import { RegistroDepositacion } from './models/registro-depositacion.model';

@Component({
  selector: 'app-ultima-depositacion',
  imports: [],
  templateUrl: './ultima-depositacion.html',
  styleUrl: './ultima-depositacion.scss',
})
export class UltimaDepositacion implements OnInit {
  private ultimaDepositacionService = inject(UltimaDepositacionService);

  registros = signal<RegistroDepositacion[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.ultimaDepositacionService.obtenerRegistros().subscribe(datos => {
      this.registros.set(datos);
      this.cargando.set(false);
    });
  }

  mesas: Array<number> = [
    9, 9, 10, 13, 14, 15, 20, 21, 21, 21,
    1, 1, 1, 2, 2, 3, 3, 6, 6, 7,
    9, 9, 10, 13, 14, 15, 20, 21, 21, 21,
    9, 9, 10, 13, 14, 15, 20, 21, 21, 21,
    22, 22, 23, 24
  ];

  getClaseColor(valor: number): string {
    if (valor <= 1) {
      return 'hoy';
    }
    if (valor > 1 && valor < 8) {
      return 'reciente';
    }
    if (valor >= 8) {
      return 'pasado';
    }
    return '';
  }

  mitad = computed(() => Math.ceil(this.mesas.length / 2));

  primeraMitad = computed(() => this.mesas.slice(0, this.mitad()));
  segundaMitad = computed(() => this.mesas.slice(this.mitad()));
}
