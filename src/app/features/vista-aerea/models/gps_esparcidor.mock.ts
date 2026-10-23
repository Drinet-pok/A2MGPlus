export const gpsEsparcidor = {
  type: 'FeatureCollection',
  features: [
    // Equipo 1 - varias posiciones (simulando movimiento)
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-69.86551833, -22.56897266, 1638.8] },
      properties: {
        equipo_id: 1,
        nombre: 'ESPARCIDOR',
        fecha: '2025-12-10T14:00:39-03:00',
        altitud: 1638.8,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-69.86531833, -22.56877266, 1639.1] },
      properties: {
        equipo_id: 1,
        nombre: 'ESPARCIDOR',
        fecha: '2025-12-10T14:01:10-03:00',
        altitud: 1639.1,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-69.86501833, -22.56857266, 1639.5] },
      properties: {
        equipo_id: 1,
        nombre: 'ESPARCIDOR',
        fecha: '2025-12-10T14:02:05-03:00',
        altitud: 1639.5,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-69.86471833, -22.56837266, 1640.0] },
      properties: {
        equipo_id: 1,
        nombre: 'ESPARCIDOR',
        fecha: '2025-12-10T14:03:00-03:00',
        altitud: 1640.0,
      },
    },

    // Equipo 2 - otra zona, otro movimiento
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-69.86251833, -22.57097266, 1635.2] },
      properties: {
        equipo_id: 2,
        nombre: 'CAMION',
        fecha: '2025-12-10T14:00:39-03:00',
        altitud: 1635.2,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-69.86221833, -22.57077266, 1635.8] },
      properties: {
        equipo_id: 2,
        nombre: 'CAMION',
        fecha: '2025-12-10T14:01:15-03:00',
        altitud: 1635.8,
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-69.86191833, -22.57057266, 1636.1] },
      properties: {
        equipo_id: 2,
        nombre: 'CAMION',
        fecha: '2025-12-10T14:02:20-03:00',
        altitud: 1636.1,
      },
    },

    // Equipo 3 - un solo punto, equipo detenido
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-69.85951833, -22.56597266, 1642.3] },
      properties: {
        equipo_id: 3,
        nombre: 'EXCAVADORA',
        fecha: '2025-12-10T14:00:39-03:00',
        altitud: 1642.3,
      },
    },
  ],
};