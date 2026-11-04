import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimaDepositacion } from './ultima-depositacion';

import { vi } from 'vitest';
import { RegistroDepositacion } from './models/registro-depositacion.model'
import { REGISTROS_DEPOSITACION_MOCK } from './models/registros-depositacion.mock'

import { of } from 'rxjs';
import { UltimaDepositacionService } from './../../../features/variables-operativas/ultima-depositacion/services/ultima-depositacion';
import { GRIETAS_MOCK } from './models/grietas.mock';
import { POSICION_ESPARCIDOR_MOCK } from './models/posicion-esparcidor.mock';

vi.mock('leaflet-rotate', () => ({}));

describe('UltimaDepositacion', () => {
  let component: UltimaDepositacion;
  let fixture: ComponentFixture<UltimaDepositacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimaDepositacion],

      // AGREGA AQUÍ EL PASO 2
      providers: [
        {
          provide: UltimaDepositacionService,
          useValue: {
            obtenerRegistros: () => of(REGISTROS_DEPOSITACION_MOCK),
            obtenerPosiciones: () => of(POSICION_ESPARCIDOR_MOCK),
            obtenerGrietas: () => of(GRIETAS_MOCK),
          }
        }
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(UltimaDepositacion);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar una cadena vacía si la columna no está ordenada', () => {
    expect(component.indicador('fecha')).toBe('');
  });

  it('debería ordenar ascendentemente al seleccionar una columna', () => {
    component.ordenarPor('fecha');

    expect(component.indicador('fecha')).toBe('▲');
  });

  it('deberia cambiar a descendente al seleccionar la misma columna', () => {
    component.ordenarPor('fecha');
    component.ordenarPor('fecha');

    expect(component.indicador('fecha')).toBe('▼');
  });

  it('debería reiniciar el orden al seleccionar otra columna', () => {
    component.ordenarPor('fecha');
    component.ordenarPor('fecha');

    component.ordenarPor('mesa');

    expect(component.indicador('mesa')).toBe('▲');
    expect(component.indicador('fecha')).toBe('');
  });


  it('debería ordenar los registros por fecha ascendente', () => {
    const hoy = new Date().toISOString().slice(0, 10);
    const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    component.seleccionarBloque(23);

    component.registros.set([
      {
        fecha: hoy,
        modulo: 6,
        ugm: {
          valor10: 0,
          valor20: 4,
          valor21: 14,
          valor24: 15,
          valor30: 37,
          valor40: 0,
        },
        composicion: { ovn: 50, sulf: 50 },
        granulometria200: 20,
        estrategiaRiego: 'Prueba',
        tiempoDrenajeDias: 2,
        mesa: 230,
        lugar: 'Cordillera',
        comportamiento: 'EA',
        ciclo: 1,
      },
      {
        fecha: ayer,
        modulo: 6,
        ugm: {
          valor10: 0,
          valor20: 4,
          valor21: 14,
          valor24: 15,
          valor30: 37,
          valor40: 0,
        },
        composicion: { ovn: 50, sulf: 50 },
        granulometria200: 20,
        estrategiaRiego: 'Prueba',
        tiempoDrenajeDias: 2,
        mesa: 228,
        lugar: 'Cordillera',
        comportamiento: 'EA',
        ciclo: 1,
      },
    ]);

    component.ordenarPor('fecha');

    const fechas = component
      .mesasOrdenadas()
      .map(registro => registro.fecha);

    expect(fechas).toEqual([ayer, hoy]);
  });

  it('debería ordenar los registros por fecha descendente', () => {
    const hoy = new Date().toISOString().slice(0, 10);
    const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    component.seleccionarBloque(23);

    component.registros.set([
      {
        fecha: hoy,
        modulo: 6,
        ugm: {
          valor10: 0,
          valor20: 4,
          valor21: 14,
          valor24: 15,
          valor30: 37,
          valor40: 0,
        },
        composicion: { ovn: 50, sulf: 50 },
        granulometria200: 20,
        estrategiaRiego: 'Prueba',
        tiempoDrenajeDias: 2,
        mesa: 230,
        lugar: 'Cordillera',
        comportamiento: 'EA',
        ciclo: 1,
      },
      {
        fecha: ayer,
        modulo: 6,
        ugm: {
          valor10: 0,
          valor20: 4,
          valor21: 14,
          valor24: 15,
          valor30: 37,
          valor40: 0,
        },
        composicion: { ovn: 50, sulf: 50 },
        granulometria200: 20,
        estrategiaRiego: 'Prueba',
        tiempoDrenajeDias: 2,
        mesa: 228,
        lugar: 'Cordillera',
        comportamiento: 'EA',
        ciclo: 1,
      },
    ]);

    component.ordenarPor('fecha');
    component.ordenarPor('fecha');

    const fechas = component
      .mesasOrdenadas()
      .map(registro => registro.fecha);

    expect(fechas).toEqual([hoy, ayer]);
  });

  it('debería devolver 0 días para la fecha de hoy', () => {
    const resultado = component.calcularDias('2026-11-04T09:00:00Z');

    expect(resultado).toEqual(0);
  });

  it('debería devolver 1 días para la fecha de hoy', () => {
    const resultado = component.calcularDias('2026-11-03T09:00:00Z');

    expect(Math.abs(resultado)).toEqual(1);
  });

  it('debería filtrar los registros de la última semana', () => {
    const hoy = new Date();
    const haceTresDias = new Date(hoy);
    const haceDiezDias = new Date(hoy);
    haceTresDias.setDate(haceTresDias.getDate() - 3)
    haceDiezDias.setDate(haceDiezDias.getDate() - 10)

    const fechaRegistro = haceTresDias.toISOString().slice(0, 10);
    const fechaRegistro10 = haceDiezDias.toISOString().slice(0, 10);

    component.registros.set([{ ...REGISTROS_DEPOSITACION_MOCK[0], fecha: fechaRegistro }, { ...REGISTROS_DEPOSITACION_MOCK[1], fecha: fechaRegistro10 }]);

    component.filtro.update((f) => ({
      ...f,
      periodo: 'semana'
    }))

    const resultado = component.registrosFiltrados();

    const fechasResultado = resultado.map(registro => registro.fecha);

    expect(fechasResultado).toContain(fechaRegistro);
    expect(fechasResultado).not.toContain(fechaRegistro10);
  });

  it('debería filtrar los registros de los utlimos 30 díasq', () => {
    const hoy = new Date();
    const haceTresDias = new Date(hoy);
    const haceDiezDias = new Date(hoy);
    haceTresDias.setDate(haceTresDias.getDate() - 3)
    haceDiezDias.setDate(haceDiezDias.getDate() - 10)

    const fechaRegistro = haceTresDias.toISOString().slice(0, 10);
    const fechaRegistro10 = haceDiezDias.toISOString().slice(0, 10);

    component.registros.set([{ ...REGISTROS_DEPOSITACION_MOCK[0], fecha: fechaRegistro }, { ...REGISTROS_DEPOSITACION_MOCK[1], fecha: fechaRegistro10 }]);

    component.filtro.update((f) => ({
      ...f,
      periodo: 'mes'
    }))

    const resultado = component.registrosFiltrados();

    const fechasResultado = resultado.map(registro => registro.fecha);

    expect(fechasResultado).toContain(fechaRegistro);
    expect(fechasResultado).toContain(fechaRegistro10);
  });

  it('debería filtrar los registros entre 3 y 10', () => {
    const hoy = new Date();
    const TresDias = new Date(hoy);
    const DiezDias = new Date(hoy);
    const veinteDias = new Date(hoy);
    TresDias.setDate(TresDias.getDate() - 3)
    DiezDias.setDate(DiezDias.getDate() - 10)
    veinteDias.setDate(veinteDias.getDate() - 20)

    const fechaRegistro = TresDias.toISOString().slice(0, 10);
    const fechaRegistro10 = DiezDias.toISOString().slice(0, 10);
    const fechaRegistro20 = veinteDias.toISOString().slice(0, 10);

    component.registros.set([
      { ...REGISTROS_DEPOSITACION_MOCK[0], fecha: fechaRegistro },
      { ...REGISTROS_DEPOSITACION_MOCK[1], fecha: fechaRegistro10 },
      { ...REGISTROS_DEPOSITACION_MOCK[2], fecha: fechaRegistro20 }
    ]);
    component.filtro.update((f) => ({
      ...f,
      desde: fechaRegistro10,
      hasta: fechaRegistro,
      periodo: null,
    }))

    const resultado = component.registrosFiltrados();

    const fechasResultado = resultado.map(registro => registro.fecha);

    expect(fechasResultado).toContain(fechaRegistro);
    expect(fechasResultado).toContain(fechaRegistro10);
    expect(fechasResultado).not.toContain(fechaRegistro20);
  });

  it('seleccionarBloque deberia ser igual a bloqueSeleccionado', () => {
    component.seleccionarBloque(22);

    expect(component.bloqueSeleccionado()).toBe(22);
  });

  it('deberia devolver UGM maximo', () => {
    component.seleccionarBloque(24);

    const registro = {
      ...REGISTROS_DEPOSITACION_MOCK[0],
      mesa: 240,
      lugar: 'cordillera',
      fecha: new Date().toISOString().slice(0, 10),
      ugm: {
        valor10: 5,
        valor20: 12,
        valor21: 8,
        valor24: 25,
        valor30: 15,
        valor40: 3
      }
    };

    component.registros.set([registro]);

    component.filtro.update(f => ({
      ...f,
      periodo: null
    }));

    const resultado = component.casillasBloque();
    const casilla = resultado.find(c => c.numeroMesa === 240);

    expect(casilla?.ugmMax).toBe(25);
    expect(casilla?.ugmTipo).toBe('24');
  });

  it('deberia devolver UGM maximo que encuentra primero en caso de repetirse', () => {
    component.seleccionarBloque(24);

    const registro = {
      ...REGISTROS_DEPOSITACION_MOCK[0],
      mesa: 240,
      lugar: 'cordillera',
      fecha: new Date().toISOString().slice(0, 10),
      ugm: {
        valor10: 25,
        valor20: 12,
        valor21: 8,
        valor24: 25,
        valor30: 15,
        valor40: 3
      }
    };

    component.registros.set([registro]);

    component.filtro.update(f => ({
      ...f,
      periodo: null
    }));

    const resultado = component.casillasBloque();
    const casilla = resultado.find(c => c.numeroMesa === 240);

    expect(casilla?.ugmMax).toBe(25);
    expect(casilla?.ugmTipo).toBe('10');
  });

  it('deberia devolver la depositacion mas reciente', () => {
    const hoy = new Date();
    const haceDosDias = new Date(hoy);
    const haceCincoDias = new Date(hoy);
    haceDosDias.setDate(haceDosDias.getDate() - 2)
    haceCincoDias.setDate(haceCincoDias.getDate() - 5)

    const fechaRegistro = `${haceDosDias.getFullYear()}-${String(
      haceDosDias.getMonth() + 1
    ).padStart(2, '0')}-${String(haceDosDias.getDate()).padStart(2, '0')}`; const fechaRegistro5 = haceCincoDias.toISOString().slice(0, 10);
    component.seleccionarBloque(24);

    const registro = [{
      ...REGISTROS_DEPOSITACION_MOCK[0],
      mesa: 240,
      lugar: 'cordillera',
      fecha: fechaRegistro,
      ugm: {
        valor10: 25,
        valor20: 12,
        valor21: 8,
        valor24: 25,
        valor30: 15,
        valor40: 3
      }
    },
    {
      ...REGISTROS_DEPOSITACION_MOCK[1],
      mesa: 240,
      lugar: 'cordillera',
      fecha: fechaRegistro5,
      ugm: {
        valor10: 5,
        valor20: 8,
        valor21: 10,
        valor24: 12,
        valor30: 15,
        valor40: 3
      }
    },

    ];

    component.registros.set(registro);

    component.filtro.update(f => ({
      ...f,
      tipoDato: 'Ultima Depositación',
      periodo: null
    }));

    const resultado = component.casillasBloque();
    const casilla = resultado.find(c => c.numeroMesa === 240);

    expect(casilla?.registro?.dias).toBe(2);

  });

  it('deberia seleccionar el registro con mayor granulometria', () => {

    // 1. Crear dos registros para la misma mesa.
    const registros = [
      {
        ...REGISTROS_DEPOSITACION_MOCK[0],
        mesa: 240,
        lugar: 'cordillera',
        granulometria200: 35
      },
      {
        ...REGISTROS_DEPOSITACION_MOCK[1],
        mesa: 240,
        lugar: 'cordillera',
        granulometria200: 65
      }
    ];

    component.registros.set(registros);

    component.filtro.update(f => ({
      ...f,
      tipoDato: 'Granulometría',
      periodo: null
    }));

    component.seleccionarBloque(24);

    const resultado = component.casillasBloque();
    const casilla = resultado.find(c => c.numeroMesa === 240);

    expect(casilla?.registro?.granulometria200).toBe(65);

  });

  it('deberia devolver null cuando la mesa no tiene registros', () => {

    // 1. Crear dos registros para la misma mesa.
    const registros = [
      {
        ...REGISTROS_DEPOSITACION_MOCK[0],
        mesa: 100,
        lugar: 'cordillera'
      }
    ];

    component.registros.set(registros);

    component.filtro.update(f => ({
      ...f,
      tipoDato: 'Granulometría',
      periodo: null
    }));

    component.seleccionarBloque(24);

    const resultado = component.casillasBloque();
    const casilla = resultado.find(c => c.numeroMesa === 240);

    expect(casilla?.registro).toBeNull();
    expect(casilla?.ugmMax).toBeNull();
    expect(casilla?.ugmTipo).toBeNull();

  });




}); 
