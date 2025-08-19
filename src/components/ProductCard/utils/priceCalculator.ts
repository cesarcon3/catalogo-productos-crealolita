export function calculateUnitPrice(precio: number, ventaPor: 'unidad' | 'docena', precioUnidad?: number): string | null {
  if (ventaPor === 'docena') {
    return precioUnidad?.toString() || (precio / 12).toFixed(2);
  }
  return null;
}

export function formatCurrency(moneda: string): string {
  return moneda === "USD" ? "$" : moneda;
}
