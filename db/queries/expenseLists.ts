import { db } from "../database";

export async function getExpenseListTemplates() {
  return await db.getAllAsync(`
    SELECT
      t.id,
      t.name,
      t.estado,
      COUNT(i.id) AS item_count,
      COALESCE(SUM(i.amount), 0) AS total_amount
    FROM expense_list_templates t
    LEFT JOIN expense_list_template_items i
      ON i.template_id = t.id AND i.estado = 1
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `);
}

export async function createExpenseList(name: string) {
  await db.runAsync(
    `INSERT INTO expense_list_templates (name, created_at) VALUES (?, ?)`,
    [name, new Date().toISOString()]
  );
}

export async function toggleExpenseListVisibility(id: number, estado: number) {
  await db.runAsync(
    `UPDATE expense_list_templates SET estado = ? WHERE id = ?`,
    [estado, id]
  );
}

export async function deleteExpenseList(id: number) {
  await db.runAsync(
    `UPDATE expense_list_templates SET estado = -1 WHERE id = ?`,
    [id]
  );
}

export async function getExpenseListItems(templateId: number) {
  return await db.getAllAsync<{
    id: number;
    description: string;
    amount: number;
    category_id: number;
    position: number;
  }>(
    `
    SELECT
      id,
      description,
      amount,
      category_id,
      position
    FROM expense_list_template_items
    WHERE template_id = ? AND estado = 1
    ORDER BY position ASC, id ASC
    `,
    [templateId]
  );
}



export async function saveExpenseListItems(
  templateId: number,
  items: {
    descripcion: string;
    monto: number;
    categoria: string;
  }[]
) {
  await db.execAsync("BEGIN TRANSACTION");

  try {
    // borra los anteriores
    await db.runAsync(
      `DELETE FROM expense_list_template_items WHERE template_id = ?`,
      [templateId]
    );

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      await db.runAsync(
        `
        INSERT INTO expense_list_template_items (
          template_id,
          description,
          amount,
          category_id,
          estado,
          position
        ) VALUES (?, ?, ?, ?, 1, ?)
        `,
        [
          templateId,
          item.descripcion,
          item.monto,
          Number(item.categoria),
          i,
        ]
      );
    }

    await db.execAsync("COMMIT");
  } catch (e) {
    await db.execAsync("ROLLBACK");
    throw e;
  }
}


export async function updateExpenseListName(
  id: number,
  name: string
) {
  await db.runAsync(
    `UPDATE expense_list_templates SET name = ? WHERE id = ?`,
    [name, id]
  );
}


export async function getExpenseListsForLoad() {
  return await db.getAllAsync<{
    id: number;
    name: string;
    item_count: number;
    total_amount: number;
  }>(`
    SELECT
      t.id,
      t.name,
      COUNT(i.id) AS item_count,
      COALESCE(SUM(i.amount), 0) AS total_amount
    FROM expense_list_templates t
    LEFT JOIN expense_list_template_items i
      ON i.template_id = t.id AND i.estado = 1
    WHERE t.estado = 1
    GROUP BY t.id
    ORDER BY t.name
  `);
}



export async function getExpenseListItemsForLoad(templateId: number) {
  return await db.getAllAsync<{
    description: string;
    amount: number;
    category_id: number;
  }>(
    `
    SELECT description, amount, category_id
    FROM expense_list_template_items
    WHERE template_id = ? AND estado = 1
    ORDER BY position ASC
    `,
    [templateId]
  );
}
