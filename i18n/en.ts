export default {
  /* =====================
     GENERAL / APP
  ===================== */
  app: {
    name: "Mi Cartera",
    version: "Versión {{version}}",
    author: "Cristhian Morales · 2026",
  },

  /* =====================
     TABS
  ===================== */
  tabs: {
    home: "Inicio",
    expenses: "Gastos",
    income: "Ingresos",
    settings: "Ajustes",
  },

  /* =====================
     DASHBOARD / HOME
  ===================== */
  dashboard: {
    emptyState: "No hay gastos registrados para este período todavía",
    invalidRangeTitle: "Rango de fechas inválido",
    invalidRangeMessage:
      "La fecha final no puede ser menor a la fecha de inicio",
    noDescription: "Sin descripción",
    empty: "No hay gastos registrados para este período todavía",

  },

  /* =====================
     GASTOS (TAB)
  ===================== */
  expenses: {
    emptyState: "No hay gastos registrados para este período todavía",
    listTitle: "Lista de gastos",
    invalidRangeTitle: "Rango de fechas inválido",
    invalidRangeMessage:
      "La fecha final no puede ser menor a la fecha de inicio",
    noDescription: "Sin descripción",
  },

  /* =====================
     GASTOS (FORMULARIO)
  ===================== */
  expenseForm: {
    newTitle: "Nuevo gasto",
    editTitle: "Editar gasto",

    descriptionLabel: "Descripción",
    descriptionPlaceholder: "Ej. Supermercado",

    amountLabel: "Monto",
    amountPlaceholder: "0.00",

    dateLabel: "Fecha",
    categoryLabel: "Categoría",

    incompleteTitle: "Datos incompletos",
    incompleteMessage: "Debes ingresar al menos el monto y la categoría",

    saveButton: "Guardar gasto",
    updateButton: "Actualizar gasto",
    deleteButton: "Eliminar gasto",

    savedTitle: "Gasto guardado",
    savedMessage: "El gasto se registró correctamente",

    updatedTitle: "Gasto actualizado",
    updatedMessage: "Los cambios se guardaron correctamente",

    deletedTitle: "Gasto eliminado",
    deletedMessage: "El gasto se eliminó correctamente",

    saveErrorTitle: "Error",
    saveErrorMessage: "No se pudo guardar el gasto. Intenta nuevamente",

    deleteConfirmTitle: "Eliminar gasto",
    deleteConfirmMessage: "¿Estás seguro de eliminar este gasto?",
    deleteConfirmButton: "Eliminar",
  },

  /* =====================
     GASTOS (MODO LISTA)
  ===================== */
  expensesList: {
    title: "Nueva lista de gastos",

    loadListButton: "Cargar lista de gastos",
    addItemButton: "+ Agregar nuevo elemento",

    itemDescriptionPlaceholder: "Descripción",
    itemAmountPlaceholder: "0.00",

    dateLabel: "Fecha",
    categoryLabel: "Categoría",

    removeItem: "Eliminar elemento",

    loadListTitle: "Cargar lista predefinida",
    noListsAvailable: "No hay listas disponibles",
    listLoaded: "Lista cargada",

    saveExpensesTitle: "Guardar gastos",
    saveExpensesConfirmTitle: "Guardar gastos",
    saveExpensesConfirmMessage:
      "Se guardarán {{count}} gastos.\n¿Deseas continuar?",

    savedExpensesTitle: "Gastos guardados",
    savedExpensesMessage: "{{count}} registros insertados",

    saveExpensesErrorTitle: "Error",
    saveExpensesErrorMessage: "No se pudieron guardar los gastos",
  },

  /* =====================
     INGRESOS
  ===================== */
  income: {
    comingSoon:
      "Gestión de ingresos disponible en la versión 1.2.1",
  },

  /* =====================
     SETTINGS (GENERAL)
  ===================== */
  settings: {
    darkMode: "Modo oscuro",
    language: "Idioma",

    currency: "Divisa",
    categories: "Categorías",
    defaultExpenses: "Gastos predefinidos",

    wallet: "Mi Cartera",
  },

  /* =====================
     SETTINGS / CATEGORÍAS
  ===================== */
  categories: {
    title: "Categorías",

    addButton: "Agregar categoría",

    newTitle: "Nueva categoría",
    editTitle: "Editar categoría",

    namePlaceholder: "Nombre",
    colorPlaceholder: "#EF4444",

    incompleteTitle: "Datos incompletos",
    incompleteMessage:
      "Debes ingresar al menos el nombre y color para la categoría",

    savedTitle: "Categoría guardada",
    savedMessage: "La categoría se registró correctamente",

    updatedTitle: "Categoría actualizada",
    updatedMessage: "Los cambios se guardaron correctamente",

    invalidColorTitle: "Color inválido",
    invalidColorMessage: "Usa un color HEX válido",

    visibilityTitle: "Visibilidad",
    visibilityMessage: "Visibilidad actualizada correctamente",

    pendingTitle: "Pendiente",
    pendingMessage: "Aquí va el delete",
  },

  /* =====================
     SETTINGS / DIVISA
  ===================== */
  currency: {
    title: "Divisa",

    updatedTitle: "Divisa actualizada",
    updatedMessage: "Los cambios se guardaron correctamente",
  },

  /* =====================
     SETTINGS / LISTAS PREDEFINIDAS
  ===================== */
  defaultLists: {
    title: "Gastos predefinidos",

    newButton: "Nueva lista",

    newTitle: "Nueva lista",
    editTitle: "Editar lista",

    namePlaceholder: "Nombre de la lista",

    createdTitle: "Lista creada",
    updatedTitle: "Lista actualizada",
  },

  /* =====================
     COMMON
  ===================== */
  common: {
    save: "Guardar",
    update: "Actualizar",
    delete: "Eliminar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    error: "Error",
    total: "Total",
    elements: "elementos",
      invalidRange: "Rango de fechas inválido",
    invalidRangeDetail:
      "La fecha final no puede ser menor a la fecha de inicio",
  },
};
