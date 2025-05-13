
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const generateVoucherCode = (prefix: string = 'VIP'): string => {
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomChars}`;
};
