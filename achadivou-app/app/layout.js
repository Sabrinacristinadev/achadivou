import "./globals.css";

export const metadata = {
  title: "Achadivou — A rede social das promoções",
  description: "Achadinhos e promoções de afiliados das melhores lojas: Amazon, Shopee, Mercado Livre, Magalu e mais.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
