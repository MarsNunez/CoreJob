export const PRICE_CURRENCIES = [
  {
    code: "PEN",
    label: "🇵🇪 Soles (S/.)",
    locale: "es-PE",
    symbol: "S/.",
  },
];

export const PRICE_CURRENCY_MAP = PRICE_CURRENCIES.reduce(
  (acc, currency) => {
    acc[currency.code] = currency;
    return acc;
  },
  {}
);
