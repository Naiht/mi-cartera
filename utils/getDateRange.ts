type Period = '7' | '15' | '30' | 'range';

export function getDateRange(
  period: Period,
  range?: { start: Date; end: Date }
) {
  const today = new Date();
 
  
  if (isNaN(today.getTime())) {
    throw new Error('Fecha actual inválida');
  }

  // =========================
  // RANGO MANUAL
  // =========================
  if (period === 'range' && range?.start && range?.end) {
    return {
      start: toISO(range.start),
      end: toISO(range.end),
    };
  }

  // =========================
  // PERIODOS AUTOMÁTICOS
  // =========================
  const days = Number(period);
  const start = new Date(today);

  start.setDate(today.getDate() - days);

  if (isNaN(start.getTime())) {
    throw new Error('Fecha de inicio inválida');
  }

  return {
    start: toISO(start),
    end: toISO(today),
  };
}

/* =========================
   Helper seguro
========================= */
function toISO(date: Date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Fecha inválida en toISO');
  }

  return date.toISOString().split('T')[0];
}
