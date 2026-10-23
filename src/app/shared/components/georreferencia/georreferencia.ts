import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotate';

@Component({
  selector: 'app-georreferencia',
  imports: [],
  templateUrl: './georreferencia.html',
  styleUrl: './georreferencia.scss',
})
export class Georreferencia implements AfterViewInit, OnDestroy {
  private map!: L.Map;

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

    (window as any).map = this.map;

  }
  

  ngOnDestroy() {
    this.map?.remove();
  }
}
