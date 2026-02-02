import { db } from '../database';

export type Category = {
  id: number;
  name: string;
  type: 'expense' | 'income';
  icon: string | null;
  color: string | null;
};

export async function getExpenseCategories(): Promise<Category[]> {
  const result = await db.getAllAsync<Category>(
    `SELECT * FROM categories WHERE type = 'expense' and estado in (1,0) ORDER BY name`
  );

  return result;
}


export async function getColorsCategories() {
  return await db.getAllAsync<{
    name: string;
    color: string;
  }>(
    `SELECT name, color FROM categories
     WHERE type = 'expense' AND estado IN (1,0)`
  );
}



export async function saveCategorie(data: {
    name: string;
    color: string;
}) {
  await db.execAsync(`
    INSERT INTO categories (
      name,
      color,
      type,
      estado,
      created_at
    ) VALUES (
      '${data.name}',
      '${data.color}',
      'expense',
      1,
      '${new Date().toISOString()}'
    )
  `);
}


export async function updateCategorie(
  id: number,
  data: {
    name: string;
    color: string;
  }
) {
  await db.execAsync(`
    UPDATE categories SET
      name = '${data.name}',
      color = '${data.color}',
      updated_at = '${new Date().toISOString()}'
    WHERE id = ${id}
  `);
}


export async function stateCategorie(id: number, estado: number) {
  await db.execAsync(`
    UPDATE categories
    SET estado = ${estado},
        updated_at = '${new Date().toISOString()}'
    WHERE id = ${id}
  `);
}


export async function isCategoryInUse(id: number): Promise<boolean> {
  const result = await db.getFirstAsync<{ total: number }>(
    `
    SELECT COUNT(id) AS total
    FROM expenses
    WHERE category_id = ? AND estado = 1
    `,
    [id]
  );

  return (result?.total ?? 0) > 0;
}