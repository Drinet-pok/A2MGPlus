export type DatosColor = {
  dias: number;
  ugm: number;
  ugmClave: number;
  granulometria: number;
};

export function claseColor(valor: DatosColor, tipoDato: string): string {
    
  if (tipoDato === 'UGM') {
    return [10, 20, 21, 24, 30, 40].includes(valor.ugmClave)
      ? `UGM${valor.ugmClave}`
      : 'UGM0';
  }

  if (tipoDato === 'Granulometría') {
    if (valor.granulometria > 15) return 'hoy';
    if (valor.granulometria >= 10) return 'reciente';
    if (valor.granulometria >= 0) return 'pasado';
    return 'UGM0';
  }

  if (valor.dias <= 1) return 'hoy';
  if (valor.dias < 8) return 'reciente';
  if (valor.dias === Infinity) return 'UGM0';
  return 'pasado';
}

