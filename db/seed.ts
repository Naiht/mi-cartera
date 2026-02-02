import { db } from './database';

export async function seedDatabase() {
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories'
  );

  if (result && result.count > 0) {
    return; 
  }

  await db.execAsync(`
    INSERT INTO categories (name, type, icon, color) VALUES
      ('Comida', 'expense', 'restaurant', '#F59E0B'),
      ('Transporte', 'expense', 'directions-car', '#3B82F6'),
      ('Vivienda', 'expense', 'home', '#10B981'),
      ('Salud', 'expense', 'local-hospital', '#EF4444'),
      ('Ocio', 'expense', 'sports-esports', '#8B5CF6'),
      ('Educación', 'expense', 'school', '#0EA5E9'),
      ('Servicios', 'expense', 'bolt', '#64748B'),
      ('Otros', 'expense', 'more-horiz', '#9CA3AF');
  `);

  await db.execAsync(`
    INSERT OR IGNORE INTO settings (id, currency_id, theme, default_period_id)
    VALUES (1, 1, 'dark', 2);
  `);
}
