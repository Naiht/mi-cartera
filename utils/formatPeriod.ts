export function formatPeriodLabel(
  period: '7' | '15' | '30' | 'range',
  range: { start: Date; end: Date } | null
) {
  if (period !== 'range') {
    //return `Últimos ${period} días`;
     return ``;
  }

  if (!range) return 'Rango de fechas';

  return `${range.start.toLocaleDateString()} – ${range.end.toLocaleDateString()}`;
}