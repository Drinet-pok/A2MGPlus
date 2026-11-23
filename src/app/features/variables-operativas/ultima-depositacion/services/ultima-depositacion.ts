import { Injectable, inject } from '@angular/core';
import { delay, of, map } from 'rxjs';
import { RegistroDepositacion } from '../models/registro-depositacion.model';
import { POSICION_ESPARCIDOR_MOCK } from '../models/posicion-esparcidor.mock';
import { GRIETAS_MOCK } from '../models/grietas.mock';
import { HttpClient } from '@angular/common/http';


const num = (v: any): number => Number(v ?? 0) || 0;
const redondear = (v: number, decimales: number): number => {
  const f = 10 ** decimales;
  return Math.round(v * f) / f;
};

@Injectable({
  providedIn: 'root',
})
export class UltimaDepositacionService {
  private http = inject(HttpClient);

  obtenerRegistros() {
    return this.http
      .get<any[]>('https://pim-mlp-consultas-test.emt.cl/api/franco/test') // <-- tu URL
      .pipe(map(lista => lista.map(r => this.mapear(r))));
  }

  private mapear(r: any): RegistroDepositacion {
    return {
      fecha: String(r['Fecha']).slice(0, 10),           
      modulo: num(r['Modulo']),
      ugm: {
        valor10: redondear(num(r['UGM-10']), 2),
        valor20: redondear(num(r['UGM-20']), 2),
        valor21: redondear(num(r['UGM-21']), 2),
        valor24: redondear(num(r['UGM-24']), 2),
        valor30: redondear(num(r['UGM-30']), 2),
        valor40: redondear(num(r['UGM-40']), 2),
      },
      composicion: {
        ovn: redondear(num(r['OVN']),2),
        sulf: redondear(num(r['SULF']),2),
      },
      granulometria200: num(r['Granulometria-200']),
      estrategiaRiego: r['Riesgo'],
      tiempoDrenajeDias: Math.round(num(r['Drenaje']) * 10) / 10,  
      mesa: num(r['Mesa']),
      lugar: r['Lugar-Deposito'],
      comportamiento: r['Comportamiento'],
      ciclo: num(r['Ciclo']),
    };
  }

  obtenerPosiciones() {
    return of(POSICION_ESPARCIDOR_MOCK).pipe(delay(300));
  }

  obtenerGrietas() {
    return of(GRIETAS_MOCK).pipe(delay(300));
  }
}