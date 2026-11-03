import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotate';
import { PosicionEsparcidor } from '../../../features/variables-operativas/ultima-depositacion/models/posicion-esparcidor.model';

@Component({
  selector: 'app-georreferencia',
  imports: [],
  templateUrl: './georreferencia.html',
  styleUrl: './georreferencia.scss',
})
export class Georreferencia implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private marcadorEsparcidor?: L.Marker;

  private posicion: PosicionEsparcidor = {
    fecha: '2026-10-13T08:00:00Z',
    mesa: 240,
    lugar: 'Barranco',
    latitud: -22.567740,    // original -22.57356 (Δ +0.005820)
    longitud: -69.864160,
    este: 410650.178,
    norte: 7503799.148,
    cota: 1647.5,
  };

  ngAfterViewInit() {
    this.map = L.map('map', {
      rotate: true,
      bearing: 43, // grados de rotación inicial, ajusta según necesites
      dragging: false,
      scrollWheelZoom: false,
    } as any).setView([-22.56989970847931, -69.86796584702523], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    const bounds = L.latLngBounds([-22.594, -69.886], [-22.549, -69.838]);

    L.tileLayer('tiles4/{z}/{x}/{y}.png', {
      minZoom: 14,
      maxZoom: 19,
      bounds: bounds,
    }).addTo(this.map);

    this.agregarMarcadorEsparcidor(this.posicion);

    (window as any).map = this.map;

  }

  private agregarMarcadorEsparcidor(pos: PosicionEsparcidor): void {
    const icono = L.icon({
      iconUrl: 'esparcidor.svg',
      iconSize: [60, 60],      // tamaño en px
      iconAnchor: [20, 50],    // punto del icono que toca la coordenada (centro)
      popupAnchor: [0, -20],   // dónde sale el popup respecto al icono
    });

    this.marcadorEsparcidor = L.marker([pos.latitud, pos.longitud], { icon: icono })
      .addTo(this.map)
      .bindPopup(`
        <strong>Mesa ${pos.mesa}</strong><br>
        Lugar: ${pos.lugar}<br>
        Cota: ${pos.cota} m<br>
        Fecha: ${new Date(pos.fecha).toLocaleString('es-CL')}
      `);
  }


  ngOnDestroy() {
    this.map?.remove();
  }
}
