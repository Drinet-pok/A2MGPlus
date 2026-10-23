import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-vista-aerea',
  imports: [],
  templateUrl: './vista-aerea.html',
  styleUrl: './vista-aerea.scss',
})
export class VistaAerea implements AfterViewInit, OnDestroy {
  private map!: L.Map;

  ngAfterViewInit() {
    this.map = L.map('map').setView([-22.56224674938022, -69.85837921500206], 19);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    const bounds = L.latLngBounds([-22.594, -69.886], [-22.549, -69.838]);

    L.tileLayer('tiles3/{z}/{x}/{y}.png', {
      minZoom: 14,
      maxZoom: 20,
      bounds: bounds,
    }).addTo(this.map);

    /*this.cargarRastro();*/
  }
/*
private cargarRastro() {
  fetch('https://apps.emt.cl/api/posicion2/registros')
    .then((res) => res.json())
    .then((geojson) => {
      let features = [...geojson.features].sort(
        (a: any, b: any) =>
          new Date(a.properties.fecha).getTime() - new Date(b.properties.fecha).getTime()
      );

      features = features.filter((_, index) => index % 50 === 0);

      console.log('Puntos después de reducir:', features.length);

      if (features.length < 2) return;

      const fechaMin = new Date(features[0].properties.fecha).getTime();
      const fechaMax = new Date(features[features.length - 1].properties.fecha).getTime();
      const rangoFechas = fechaMax - fechaMin || 1;

      for (let i = 0; i < features.length - 1; i++) {
        const puntoA = features[i].geometry.coordinates;
        const puntoB = features[i + 1].geometry.coordinates;
        const fechaPunto = new Date(features[i].properties.fecha).getTime();
        const antiguedad = (fechaPunto - fechaMin) / rangoFechas;

        L.polyline(
          [
            [puntoA[1], puntoA[0]],
            [puntoB[1], puntoB[0]],
          ],
          {
            color: this.colorPorAntiguedad(antiguedad),
            weight: 8,
            opacity: 0.9,
          }
        ).addTo(this.map);
      }

      const ultimoPunto = features[features.length - 1].geometry.coordinates;
      L.circleMarker([ultimoPunto[1], ultimoPunto[0]], {
        radius: 9,
        fillColor: '#ff0000',
        color: '#fff',
        weight: 2,
        fillOpacity: 1,
      })
        .addTo(this.map)
        .bindPopup('Posición actual');
    })
    .catch((err) => console.error('Error cargando rastro:', err));
}

private colorPorAntiguedad(antiguedad: number): string {
  // Celeste tenue (viejo) -> Celeste intenso/saturado (reciente)
  const colorViejo = { r: 200, g: 230, b: 255 };  // celeste muy pálido
  const colorReciente = { r: 0, g: 140, b: 255 }; // celeste fuerte/saturado

  const r = Math.round(colorViejo.r + (colorReciente.r - colorViejo.r) * antiguedad);
  const g = Math.round(colorViejo.g + (colorReciente.g - colorViejo.g) * antiguedad);
  const b = Math.round(colorViejo.b + (colorReciente.b - colorViejo.b) * antiguedad);

  return `rgb(${r},${g},${b})`;
}
*/
  ngOnDestroy() {
    this.map?.remove();
  }
}
