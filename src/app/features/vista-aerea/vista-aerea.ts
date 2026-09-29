import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet'; 

@Component({
  selector: 'app-vista-aerea',
  imports: [],
  templateUrl: './vista-aerea.html',
  styleUrl: './vista-aerea.scss',
})
export class VistaAerea implements AfterViewInit, OnDestroy {
  private map!: L.Map;

async ngAfterViewInit() {
  console.log('Iniciando mapa...');
  this.map = L.map('map').setView([-38.73, -72.59], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(this.map);

  try {
    const respuesta = await fetch('ortofoto.tif');
    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar el archivo: ${respuesta.status}`);
    }

    const buffer = await respuesta.arrayBuffer();
    const georaster = await parseGeoraster(buffer);

    console.log('Bandas:', georaster.numberOfRasters);
    console.log('Tamaño:', georaster.width, 'x', georaster.height);
    console.log('Proyección:', georaster.projection);

    console.log('Mínimos:', georaster.mins);
    console.log('Máximos:', georaster.maxs);
    console.log('NoData:', georaster.noDataValue);
    console.log('Tipo:', georaster.values[0]?.constructor?.name);
    

      const capa = new GeoRasterLayer({
        georaster,
        opacity: 1,
        resolution: 128,
        pixelValuesToColorFn: (values: number[]) => {
          const [r, g, b] = values;
          // Alpha = banda 3: transparencia proporcional al valor de la banda 3
          const alpha = b / 255;
          return `rgba(${r},${g},${b},${alpha})`;
        },
      });
    capa.addTo(this.map);

    // Centrar sobre la ortofoto
    const bounds = capa.getBounds();
    console.log('Bounds:', bounds);
    this.map.fitBounds(bounds);
  } catch (error) {
    console.error('Error cargando la ortofoto:', error);
  }
}

  ngOnDestroy() {
    this.map?.remove();
  }
}
