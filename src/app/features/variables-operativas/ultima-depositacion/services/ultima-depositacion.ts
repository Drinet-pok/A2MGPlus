import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { RegistroDepositacion } from '../models/registro-depositacion.model';
import { REGISTROS_DEPOSITACION_MOCK } from '../models/registros-depositacion.mock';
import { PosicionEsparcidor } from '../models/posicion-esparcidor.model';
import { POSICION_ESPARCIDOR_MOCK } from '../models/posicion-esparcidor.mock';

@Injectable({
  providedIn: 'root',
})
export class UltimaDepositacionService {

  obtenerRegistros() {
    return of(REGISTROS_DEPOSITACION_MOCK).pipe(delay(300));
  }

  obtenerPosiciones() {
    return of(POSICION_ESPARCIDOR_MOCK).pipe(delay(300));
  }
}
