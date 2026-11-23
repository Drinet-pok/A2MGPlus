import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { REGISTRO_HUMEDAD_MOCK } from '../models/registro-humedad.mock';


@Injectable({
  providedIn: 'root',
})
export class HumedadService {
  obtenerRegistros() {
    return of(REGISTRO_HUMEDAD_MOCK).pipe(delay(300));
  }
}
