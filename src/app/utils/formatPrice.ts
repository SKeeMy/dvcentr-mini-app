export const formatPrice = (priceValue: number | undefined): string => {
  if (!priceValue && priceValue !== 0) return 'Цена не указана'
  return priceValue.toLocaleString('ru-RU') + ' ₽'
}