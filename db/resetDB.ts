import { db } from './database';

export async function resetDatabase() {
  await db.execAsync(`
    DROP TABLE IF EXISTS expenses;
    DROP TABLE IF EXISTS expense_list_template_items;
    DROP TABLE IF EXISTS expense_list_templates;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS settings;
  `);
}