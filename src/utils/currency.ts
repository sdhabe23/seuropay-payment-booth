export const formatEuro = (amount: number): string => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const TAX_RATE = 0.24; // 24% VAT (Estonia)

export const calcSubtotal = (items: { price: number; quantity: number }[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const calcTax = (subtotal: number): number =>
  parseFloat((subtotal * TAX_RATE).toFixed(2));

export const calcTotal = (subtotal: number, tax: number): number =>
  parseFloat((subtotal + tax).toFixed(2));
