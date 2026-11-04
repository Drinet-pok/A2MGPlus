import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { UltimaDepositacionService } from './services/ultima-depositacion';
import { RegistroDepositacion, RegistroConDias } from './models/registro-depositacion.model';
import { PosicionEsparcidor } from './models/posicion-esparcidor.model';
import { Grietas } from './models/grietas.models'

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

const MESAS_POR_BLOQUE = 10;
const BLOQUES_POR_LUGAR = 330 / MESAS_POR_BLOQUE;
const TOTAL_BLOQUES = BLOQUES_POR_LUGAR * 2 + 1; // 45: el último es el bloque especial
const MESA_GIRO = 331;

type Columna =
  | 'fecha' | 'mesa' | 'modulo' | 'lugar' | 'ciclo' | 'comportamiento'
  | 'granulometria200' | 'estrategiaRiego' | 'tiempoDrenajeDias'
  | 'ugm.valor10' | 'ugm.valor20' | 'ugm.valor21'
  | 'ugm.valor24' | 'ugm.valor30' | 'ugm.valor40'
  | 'composicion.ovn' | 'composicion.sulf';

@Component({
  selector: 'app-ultima-depositacion',
  imports: [InfoDiaria, CondicionMesas, Georreferencia, NgTemplateOutlet],
  templateUrl: './ultima-depositacion.html',
  styleUrl: './ultima-depositacion.scss',
})
export class UltimaDepositacion implements OnInit {

  private readonly diasPorPeriodo = { semana: 7, mes: 30, shifting: 360 };

  private ultimaDepositacionService = inject(UltimaDepositacionService);
  /*
 
  paginaActual = signal(1);
  registrosPorPagina = signal(4);

  registrosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.registrosPorPagina();
    return this.mesasOrdenadas().slice(inicio, inicio + this.registrosPorPagina());
  });

  totalPaginas = computed(() =>
    Math.ceil(this.mesasOrdenadas().length / this.registrosPorPagina())
  );

  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas()) this.paginaActual.update(p => p + 1);
  }

  paginaAnterior() {
    if (this.paginaActual() > 1) this.paginaActual.update(p => p - 1);
  }
 */
  expandido = signal(true);

  alternarExpandido() {
    /*const inicioActual = (this.paginaActual() - 1) * this.registrosPorPagina();
    const nuevoTamano = this.expandido() ? 11 : 4;
    this.registrosPorPagina.set(nuevoTamano);
    this.paginaActual.set(Math.floor(inicioActual / nuevoTamano) + 1);*/
    this.expandido.update(valor => !valor);
  }

  filtro = signal<FiltroDatos>({
    periodo: 'semana',
    desde: '',
    hasta: '',
    tipoDato: 'Ultima Depositación',
    tipoResumen: 'Valor prioritario'
  });



  registros = signal<RegistroDepositacion[]>([]);
  cargando = signal(true);

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

  registroConDias = computed(() =>
    this.registros()
      .filter(registro => registro.mesa <= MESA_GIRO)
      .map(registro => ({
        ...registro,
        dias: Math.abs(this.calcularDias(registro.fecha))
      }))
  );
  registrosFiltrados = computed(() => {
    const { periodo, desde, hasta } = this.filtro();
    const todos = this.registroConDias();

    todos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

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
    const bloques: BloqueRegistro[] = Array.from({ length: TOTAL_BLOQUES }, () => ({
      dias: Infinity,
      ugm: -Infinity,
      ugmClave: 0,
      granulometria: -Infinity,
    }));

    for (const r of this.registrosFiltrados()) {
      const columna = Math.max(0, Math.ceil(r.mesa / MESAS_POR_BLOQUE) - 1);

      let fila: number;

      if (r.lugar === 'Cordillera') fila = 0;
      else if (r.lugar === 'Barranco') fila = 1;
      else continue;

      const i = fila * BLOQUES_POR_LUGAR + columna;

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
  
  mesasDetalle = computed(() => Math.ceil(this.mesas.length));
  */
  // BORRAR

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

  //--------------------------------//

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

  lugarBloque = computed<string | null>(() => {
    const s = this.bloqueActivo();
    if (s === null) return null;
    return s > BLOQUES_POR_LUGAR ? 'barranco' : 'cordillera';
  });


  //--------------------------------//

  rangoDetalleBloque = computed(() => {
    let seccion = this.bloqueActivo();
    if (seccion === null) return { inicio: 0, fin: 0 };
    if (seccion === TOTAL_BLOQUES) return { inicio: 331, fin: 331 };

    if (seccion > BLOQUES_POR_LUGAR) seccion -= BLOQUES_POR_LUGAR;

    return { inicio: seccion * MESAS_POR_BLOQUE - (MESAS_POR_BLOQUE - 1), fin: seccion * MESAS_POR_BLOQUE };
  });


  mesasIndividuales = computed(() => {
    const { inicio, fin } = this.rangoDetalleBloque();
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  });

  mesasBloque = computed(() => {
    const { inicio, fin } = this.rangoDetalleBloque();
    const lugar = this.lugarBloque();
    if (!lugar) return [];

    return this.registrosFiltrados().filter(r =>
      r.mesa >= inicio &&
      r.mesa <= fin &&
      r.lugar.toLowerCase() === lugar
    );
  });

  grietasBloque = computed(() => {
    const { inicio, fin } = this.rangoDetalleBloque();
    const lugar = this.lugarBloque();
    if (!lugar) return [];

    return this.grietasSemana().filter(r =>
      r.mesa >= inicio &&
      r.mesa <= fin &&
      r.lugar.toLowerCase() === lugar
    );
  });

  mesasConGrieta = computed(() =>
    new Set(this.grietasBloque().map(g => g.mesa))
  );

  casillasBloque = computed(() => {
    const registros = this.mesasBloque();
    const porGranulometria = this.filtro().tipoDato === 'Granulometría';
    const grietas = this.grietasBloque();

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

      return { numeroMesa, registro: elegido, ugmMax, ugmTipo, grietas };
    });
  });

  ordenColumna = signal<Columna | null>(null);
  ordenDireccion = signal<'asc' | 'desc'>('asc');

  ordenarPor(columna: Columna) {
    if (this.ordenColumna() === columna) {
      this.ordenDireccion.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.ordenColumna.set(columna);
      this.ordenDireccion.set('asc');
    }
    /*this.paginaActual.set(1);*/
  }

  indicador(columna: Columna) {
    if (this.ordenColumna() !== columna) return '';
    return this.ordenDireccion() === 'asc' ? '▲' : '▼';
  }

  valorDe(registro: any, ruta: string) {
    return ruta.split('.').reduce((obj, clave) => obj?.[clave], registro);
  }

  mesasOrdenadas = computed(() => {
    const columna = this.ordenColumna();
    const lista = this.mesasBloque();

    if (!columna) return lista;

    const dir = this.ordenDireccion() === 'asc' ? 1 : -1;

    return [...lista].sort((a, b) => {
      const va = this.valorDe(a, columna);
      const vb = this.valorDe(b, columna);

      if (va == null) return 1;
      if (vb == null) return -1;

      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;

      return String(va).localeCompare(String(vb), 'es', { numeric: true }) * dir;

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

      },
      error: () => this.cargandoPosicionEsparcidor.set(false)
    });

    this.ultimaDepositacionService.obtenerGrietas().subscribe({
      next: (datos) => this.grietas.set(datos),
    });
  }


}
