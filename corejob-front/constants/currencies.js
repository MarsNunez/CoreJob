export const PRICE_CURRENCIES = [
  {
    code: "PEN",
    label: "Soles (S/.)",
    emoji: "🇵🇪",
    locale: "es-PE",
    symbol: "S/.",
  },
  {
    code: "ARG",
    label: "Pesos ($.)",
    emoji: "🇦🇷",
    locale: "es-AR",
    symbol: "$.",
  },
];

export const PRICE_CURRENCY_MAP = PRICE_CURRENCIES.reduce((acc, currency) => {
  acc[currency.code] = currency;
  return acc;
}, {});
