import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { RegistroDepositacion } from '../models/registro-depositacion.model';
import { REGISTROS_DEPOSITACION_MOCK } from '../models/registros-depositacion.mock';

@Injectable({
  providedIn: 'root',
})
export class UltimaDepositacionService {

  obtenerRegistros() {
    return of(REGISTROS_DEPOSITACION_MOCK).pipe(delay(300));
  }
}
