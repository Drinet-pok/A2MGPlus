import { RegistroDepositacion } from '../models/registro-depositacion.model';

export const REGISTROS_DEPOSITACION_MOCK: RegistroDepositacion[] = [
  {
    fecha: '2026-07-01',
    modulo: 6,
    ugm: { valor10: 0, valor20: 4, valor21: 14, valor24: 15, valor30: 37, valor40: 29 },
    composicion: { ovn: 66, sulf: 34 },
    granulometria200: 4.45,
    estrategiaRiego: 'Continuo',
    tiempoDrenajeDias: 11,
    mesa: '240',
    lugar: 'Barranco',
    comportamiento: 'EA',
    ciclo: 41
  },
  {
    fecha: '2026-06-30',
    modulo: 5,
    ugm: { valor10: 0, valor20: 1, valor21: 0, valor24: 2, valor30: 50, valor40: 47 },
    composicion: { ovn: 97, sulf: 3 },
    granulometria200: 4.45,
    estrategiaRiego: 'Continuo',
    tiempoDrenajeDias: 10,
    mesa: '231-240',
    lugar: 'Barranco',
    comportamiento: 'EA',
    ciclo: 41
  },
  {
    fecha: '2026-06-29',
    modulo: 4,
    ugm: { valor10: 0, valor20: 3, valor21: 4, valor24: 0, valor30: 65, valor40: 28 },
    composicion: { ovn: 54, sulf: 46 },
    granulometria200: 5.28,
    estrategiaRiego: 'Continuo',
    tiempoDrenajeDias: 12,
    mesa: '220-231',
    lugar: 'Barranco',
    comportamiento: 'EA',
    ciclo: 41
  },
  {
    fecha: '2023-04-06',
    modulo: 70,
    ugm: { valor10: 33, valor20: 0, valor21: 0, valor24: 0, valor30: 0, valor40: 60 },
    composicion: { ovn: 60, sulf: 0 },
    granulometria200: 5.71,
    estrategiaRiego: 'Continuo',
    tiempoDrenajeDias: 11,
    mesa: 'cabezal a 310',
    lugar: 'Cordillera',
    comportamiento: 'EM',
    ciclo: 26
  }
];