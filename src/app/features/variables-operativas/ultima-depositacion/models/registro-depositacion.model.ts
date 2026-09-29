
export interface RegistroDepositacion {
  fecha: string;               // '2023-04-06' (ISO) o 'DD-MM-YYYY', a definir formato final
  modulo: number;               
  ugm: {
    valor10: number;
    valor20: number;
    valor21: number;
    valor24: number;
    valor30: number;
    valor40: number;
  };
  composicion: {
    ovn: number;
    sulf: number;
  };
  granulometria200: number;    
  estrategiaRiego: string;     // ej: 'Continuo'
  tiempoDrenajeDias: number;
  mesa: string;                 // ej: 'cabezal a 310' — TODO: migrar a number cuando se estandarice
  lugar: string;                // ej: 'Cordillera', 'Barranco'
  comportamiento: 'EA' | 'EM' | 'EB';
  ciclo: number;
}