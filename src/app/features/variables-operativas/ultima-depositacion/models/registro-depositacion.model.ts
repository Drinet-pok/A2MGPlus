
export interface RegistroDepositacion {
  fecha: string;              
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
  estrategiaRiego: string;     
  tiempoDrenajeDias: number;
  mesa: number;                 // ej: 'cabezal a 310' 
  lugar: string;               
  comportamiento: 'EA' | 'EM' | 'EB';
  ciclo: number;
}

export type RegistroConDias = RegistroDepositacion & { dias: number };