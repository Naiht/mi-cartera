export function  handleMontoChange (text: string)  {
  // Permite solo números y un punto decimal
  const cleaned = text
    .replace(/[^0-9.]/g, "")      // elimina letras y símbolos
    .replace(/(\..*)\./g, "$1"); // evita más de un punto

  return cleaned;
};