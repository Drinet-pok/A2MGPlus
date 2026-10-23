import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { UltimaDepositacionService } from './services/ultima-depositacion';
import { RegistroDepositacion, RegistroConDias } from './models/registro-depositacion.model';
import { PosicionEsparcidor } from './models/posicion-esparcidor.model';

import { InfoDiaria } from '../../../shared/components/info-diaria/info-diaria';
import { CondicionMesas, FiltroDatos } from '../../../shared/components/condicion-mesas/condicion-mesas';
import { Georreferencia } from '../../../shared/components/georreferencia/georreferencia';
import { claseColor } from '../../../shared/components/utils/clase-color'

interface BloqueRegistro {
  dias: number;
  ugm: number;
  ugmClave: number; // 24, 30, etc.
  granulometria: number;
}

@Component({
  selector: 'app-ultima-depositacion',
  imports: [InfoDiaria, CondicionMesas, Georreferencia, NgTemplateOutlet],
  templateUrl: './ultima-depositacion.html',
  styleUrl: './ultima-depositacion.scss',
})
export class UltimaDepositacion implements OnInit {

  paginaActual = signal(1);
  registrosPorPagina = signal(4);

  registrosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.registrosPorPagina();
    return this.mesasSeccion().slice(inicio, inicio + this.registrosPorPagina());
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.mesasSeccion().length / this.registrosPorPagina());
  });

  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas()) this.paginaActual.update(p => p + 1);
  }

  paginaAnterior() {
    if (this.paginaActual() > 1) this.paginaActual.update(p => p - 1);
  }

  expandido = signal(true);

  alternarExpandido() {
    const inicioActual = (this.paginaActual() - 1) * this.registrosPorPagina();
    const nuevoTamano = this.expandido() ? 11 : 4;

    this.registrosPorPagina.set(nuevoTamano);
    this.paginaActual.set(Math.floor(inicioActual / nuevoTamano) + 1);
    this.expandido.update(valor => !valor);
  }

  filtro = signal<FiltroDatos>({
    periodo: 'semana',
    desde: '',
    hasta: '',
    tipoDato: 'Ultima Depositación',
  });

  private readonly diasPorPeriodo = { semana: 7, mes: 30, shifting: 360 };

  private ultimaDepositacionService = inject(UltimaDepositacionService);

  registros = signal<RegistroDepositacion[]>([]);
  cargando = signal(true);

  calcularDias(fechaObjetivo: Date | string): number {
    const MS_POR_DIA = 1000 * 60 * 60 * 24;

    const hoy = new Date();
    const objetivo = new Date(fechaObjetivo);


    hoy.setHours(0, 0, 0, 0);
    objetivo.setHours(0, 0, 0, 0);


    const diferenciaMs = objetivo.getTime() - hoy.getTime();

    // Convertir a días y redondear
    return Math.round(diferenciaMs / MS_POR_DIA);
  }

  registroConDias = computed(() =>
    this.registros().map(registro => ({
      ...registro,
      dias: Math.abs(this.calcularDias(registro.fecha))
    }))
  );

  registrosFiltrados = computed(() => {
    const { periodo, desde, hasta } = this.filtro();
    const todos = this.registroConDias();

    // Período rápido: semana / mes / shifting
    if (periodo) {
      const maxDias = this.diasPorPeriodo[periodo];
      return todos.filter(r => r.dias <= maxDias);
    }

    // Rango de fechas: desde/hasta vacío = sin límite
    return todos.filter(r => {
      const fecha = String(r.fecha).slice(0, 10); // 'yyyy-MM-dd'
      return (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    });
  });

  registroPorBloques = computed(() => {
    const bloques: BloqueRegistro[] = Array.from({ length: 45 }, () => ({
      dias: Infinity,
      ugm: -Infinity,
      ugmClave: 0,
      granulometria: -Infinity,
    }));

    for (const r of this.registrosFiltrados()) {
      const columna = Math.max(0, Math.ceil(r.mesa / 15) - 1);

      let fila: number;

      if (r.lugar === 'Cordillera') fila = 0;
      else if (r.lugar === 'Barranco') fila = 1;
      else continue;

      const i = fila * 22 + columna;

      if (r.dias < bloques[i].dias) bloques[i].dias = r.dias;
      if (r.granulometria200 > bloques[i].granulometria) bloques[i].granulometria = r.granulometria200;

      const maxUgm = Object.entries(r.ugm).reduce(
        (max, [clave, valor]) => (valor > max.valor ? { clave, valor } : max),
        { clave: '', valor: -Infinity }
      );

      if (maxUgm.valor > bloques[i].ugm) {
        bloques[i].ugm = maxUgm.valor;
        bloques[i].ugmClave = Number(maxUgm.clave.replace('valor', ''));
      }
    }

    return bloques;
  });

  // BORRAR
  /*
    registroFiltrado = computed(() => {
      return this.registrosFiltrados().filter(f => f.ugm)
    });
  
  
    mesasIndividualesDepositacion: number[] = [
      1, 1, 2, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6
    ];
  



  obtenerColorClase(reg: RegistroConDias): string {
    const maxUgm = Object.entries(reg.ugm).reduce(
      (max, [clave, valor]) => (valor > max.valor ? { clave, valor } : max),
      { clave: '', valor: -Infinity }
    );

    return claseColor(
      {
        dias: reg.dias,
        ugm: maxUgm.valor,
        ugmClave: Number(maxUgm.clave.replace('valor', '')),
        granulometria: reg.granulometria200,
      },
      this.filtro().tipoDato
    );
  }

  
  mesasDetalle = computed(() => Math.ceil(this.mesas.length));
  */
  // BORRAR

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
      22 - 1,
      Math.max(0, Math.ceil(pos.mesa / 15) - 1)
    );

    const offset = pos.lugar.toLowerCase() === 'barranco' ? 22 : 0;

    return indice + 1 + offset;
  });


  //--------------------------------//

  seccionSeleccionada = signal<number | null>(null);

  seccionActiva = computed<number | null>(
    () => this.seccionSeleccionada() ?? this.bloqueActual()
  );

  seleccionarSeccion(numero: number) {
    this.seccionSeleccionada.set(numero);
  }

  volverAUltimaPosicion() {
    this.seccionSeleccionada.set(null);
  }

  lugarSeccion = computed<string | null>(() => {
    const s = this.seccionActiva();
    if (s === null) return null;
    return s > 22 ? 'barranco' : 'cordillera';
  });


  //--------------------------------//



  selectorSeccion = computed(() => {
    let seccion = this.seccionActiva();
    if (seccion === null) return { inicio: 0, fin: 0 };
    if (seccion === 45) return { inicio: 331, fin: 331 };

    if (seccion > 22) seccion -= 22;

    return { inicio: seccion * 15 - 14, fin: seccion * 15 };
  });


  mesasIndividuales = computed(() => {
    const { inicio, fin } = this.selectorSeccion();
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  });

  mesasSeccion = computed(() => {
    const { inicio, fin } = this.selectorSeccion();
    const lugar = this.lugarSeccion();
    if (!lugar) return [];

    return this.registrosFiltrados().filter(r =>
      r.mesa >= inicio &&
      r.mesa <= fin &&
      r.lugar.toLowerCase() === lugar
    );
  });

  celdasSeccion = computed(() => {
    const registros = this.mesasSeccion();
    const porGranulometria = this.filtro().tipoDato === 'Granulometría';

    return this.mesasIndividuales().map(numeroMesa => {
      const delaMesa = registros.filter(r => r.mesa === numeroMesa);

      const elegido = [...delaMesa].sort((a, b) =>
        porGranulometria
          ? b.granulometria200 - a.granulometria200  // mayor granulometría primero
          : a.dias - b.dias                          // más reciente primero
      )[0] ?? null;

      let ugmMax: number | null = null;
      let ugmTipo: string | null = null;

      if (elegido) {
        const [clave, valor] = Object.entries(elegido.ugm)
          .reduce((max, actual) => (actual[1] > max[1] ? actual : max));

        ugmMax = valor;                          // ej: 3.5
        ugmTipo = clave.replace('valor', '');    // ej: '24'
      }

      return { numeroMesa, registro: elegido, ugmMax, ugmTipo };
    });
  });

  ngOnInit() {
    this.ultimaDepositacionService.obtenerRegistros().subscribe({
      next: (datos) => {
        this.registros.set(datos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });

    this.ultimaDepositacionService.obtenerPosiciones().subscribe({
      next: (datos) => {
        this.posicionEsparcidor.set(datos);
        this.cargandoPosicionEsparcidor.set(false);
        console.log(this.celdasSeccion());

      },
      error: () => this.cargandoPosicionEsparcidor.set(false)
    });
  }


}
