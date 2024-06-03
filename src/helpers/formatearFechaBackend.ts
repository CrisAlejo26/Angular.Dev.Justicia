export function formatearFecha(fecha: Date): string {
  const fechaComoString = fecha.toISOString().split('T')[0]; // Esto dará una fecha en formato 'yyyy-MM-dd'
  return fechaComoString;
}
