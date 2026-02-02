import { db } from '../database';



export type GastoDB = {
  id: number;
  description: string | null;
  amount: number;
  date: string;
  category_id: number;
};


export type ExpenseRow = {
  id: number;
  description: string | null;
  amount: number;
  date: string;
  category_name: string;
};

export async function getGastosByPeriod(
  startDate: string,
  endDate: string
): Promise<ExpenseRow[]> {
  return await db.getAllAsync<ExpenseRow>(
    `
    SELECT 
      e.id,
      e.description,
      e.amount,
      e.date,
      c.name AS category_name
    FROM expenses e
    JOIN categories c ON c.id = e.category_id
    WHERE e.estado = 1
      AND e.date BETWEEN ? AND ?
    ORDER BY e.created_at DESC, e.date DESC
    `,
    [startDate, endDate]
  );
}


export async function getGasto(currencyId: number) {
  await db.execAsync(`
    UPDATE settings
    SET currency_id = ${currencyId}
    WHERE id = 1
  `);
}



/* =========================
   CREAR
========================= */
export async function saveGasto(data: {
  description: string;
  amount: number;
  date: string;
  category_id: number;
}) {
  await db.execAsync(`
    INSERT INTO expenses (
      description,
      amount,
      date,
      category_id,
      estado,
      created_at
    ) VALUES (
      '${data.description}',
      ${data.amount},
      '${data.date}',
      ${data.category_id},
      1,
      '${new Date().toISOString()}'
    )
  `);
}

/* =========================
   OBTENER POR ID
========================= */
export async function getGastoById(id: number): Promise<GastoDB | null> {
  const row = await db.getFirstAsync<GastoDB>(`
    SELECT *
    FROM expenses
    WHERE id = ${id}
      AND estado = 1
  `);

  return row ?? null;
}

/* =========================
   ACTUALIZAR
========================= */
export async function updateGasto(
  id: number,
  data: {
    description: string;
    amount: number;
    date: string;
    category_id: number;
  }
) {
  await db.execAsync(`
    UPDATE expenses SET
      description = '${data.description}',
      amount = ${data.amount},
      date = '${data.date}',
      category_id = ${data.category_id},
      updated_at = '${new Date().toISOString()}'
    WHERE id = ${id}
  `);
}



export async function deleteGasto(id: number) {
  await db.execAsync(`
    UPDATE expenses
    SET estado = 0,
        updated_at = '${new Date().toISOString()}'
    WHERE id = ${id}
  `);
}



/* =========================
   GASTOS PARA EL DASHBOARD
========================= */


export async function getTotalGastosByPeriod(
  startDate: string,
  endDate: string
): Promise<number> {
  const row = await db.getFirstAsync<{ total: number }>(
    `
    SELECT 
      COALESCE(SUM(amount), 0) AS total
    FROM expenses
    WHERE estado = 1
      AND date BETWEEN ? AND ?
    `,
    [startDate, endDate]
  );

  return row?.total ?? 0;
}


export type ExpenseByCategoryRow = {
  category_id: number;
  category_name: string;
  total: number;
};

export async function getGastosByCategory(
  startDate: string,
  endDate: string
): Promise<ExpenseByCategoryRow[]> {
  return await db.getAllAsync<ExpenseByCategoryRow>(
    `
    SELECT
      c.id AS category_id,
      c.name AS category_name,
      SUM(e.amount) AS total
    FROM expenses e
    JOIN categories c ON c.id = e.category_id
    WHERE e.estado = 1
      AND e.date BETWEEN ? AND ?
    GROUP BY c.id, c.name
    HAVING total > 0
    ORDER BY total DESC
    `,
    [startDate, endDate]
  );
}


export async function getRecentGastosByPeriod(
  startDate: string,
  endDate: string
): Promise<ExpenseRow[]> {
  return await db.getAllAsync<ExpenseRow>(
    `
    SELECT 
      e.id,
      e.description,
      e.amount,
      e.date,
      c.name AS category_name
    FROM expenses e
    JOIN categories c ON c.id = e.category_id
    WHERE e.estado = 1
      AND e.date BETWEEN ? AND ?
    ORDER BY e.created_at DESC
    LIMIT 10
    `,
    [startDate, endDate]
  );
}


export async function saveMultipleGastos(
  gastos: {
    description: string;
    amount: number;
    date: string;
    category_id: number;
  }[]
) {
  if (gastos.length === 0) return;

  await db.execAsync("BEGIN TRANSACTION");

  try {
    for (const g of gastos) {
      await db.runAsync(
        `
        INSERT INTO expenses (
          description,
          amount,
          date,
          category_id,
          estado,
          created_at
        ) VALUES (?, ?, ?, ?, 1, ?)
        `,
        [
          g.description,
          g.amount,
          g.date,
          g.category_id,
          new Date().toISOString(),
        ]
      );
    }

    await db.execAsync("COMMIT");
  } catch (error) {
    await db.execAsync("ROLLBACK");
    throw error;
  }
}