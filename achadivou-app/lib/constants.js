export const C = {
  green: "#00b140",
  greenDark: "#00913a",
  red: "#d31818",
  redDark: "#a81212",
  bg: "#f4f5f7",
  ink: "#26262b",
  sub: "#6b6f76",
  card: "#ffffff",
  line: "#e7e8ec",
};

export const CATEGORIES = [
  "Moda Feminina", "Moda Masculina", "Calçados", "Eletrônicos",
  "Casa", "Beleza", "Infantil", "Esporte", "Outros",
];

export const STORES = ["Amazon", "Mercado Livre", "Shopee", "Magalu", "Shein", "AliExpress"];

export const STORE_COLORS = {
  Amazon: "#232f3e",
  "Mercado Livre": "#ffe600",
  Shopee: "#ee4d2d",
  Magalu: "#0086ff",
  Shein: "#000000",
  AliExpress: "#ff4747",
};

export function brl(n) {
  return Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
