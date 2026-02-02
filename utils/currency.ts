import { currencies } from '../constants/currencies';

export function getCurrencyById(id: number) {
  return currencies.find(c => c.id === id) ?? currencies[0];
}
