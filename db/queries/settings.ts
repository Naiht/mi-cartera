import { db } from '../database';

export type UserSettings = {
  currency_id: number;
  theme: 'light' | 'dark';
  default_period_id: number;
};

export async function getSettings(): Promise<UserSettings | null> {
  const result = await db.getFirstAsync<UserSettings>(
    `SELECT currency_id, theme, default_period_id FROM settings WHERE id = 1`
  );

  return result ?? null;
}

export async function updateCurrency(currencyId: number) {
  await db.execAsync(`
    UPDATE settings
    SET currency_id = ${currencyId}
    WHERE id = 1
  `);
}


export async function updateThemeMode(mode: "light" | "dark" | "system") {
  await db.runAsync(
    `UPDATE settings SET theme = ? WHERE id = 1`,
    [mode]
  );
}