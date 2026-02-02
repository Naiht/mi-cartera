type Scheme = 'light' | 'dark';
type GradientStops = readonly [string, string]; // 2 colores (puedes poner 3 si quieres)

export const Gradients: Record<
  'gasto' | 'ingreso',
  Record<Scheme, GradientStops>
> = {
  gasto: {
    light: ['#EF4444', '#DC2626'],
    dark: ['#7F1D1D', '#991B1B'],
  },
  ingreso: {
    light: ['#22C55E', '#16A34A'],
    dark: ['#14532D', '#166534'],
  },
} as const;
