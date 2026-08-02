const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "troque-esta-senha";

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.create({ data: { username, passwordHash } });
    console.log(`Admin "${username}" criado com sucesso.`);
  } else {
    console.log(`Admin "${username}" já existe, pulando criação.`);
  }

  const count = await prisma.offer.count();
  if (count === 0) {
    await prisma.offer.createMany({
      data: [
        {
          title: "Tênis Feminino Adizero Corrida",
          link: "https://exemplo.com/afiliado/tenis-adizero",
          image: "",
          price: 89.9,
          originalPrice: 189.9,
          store: "Shopee",
          category: "Calçados",
          coupon: "CORRE10",
          featured: true,
          active: true,
        },
        {
          title: "Fone Bluetooth Sem Fio à Prova D'água",
          link: "https://exemplo.com/afiliado/fone-bluetooth",
          image: "",
          price: 39.9,
          originalPrice: 79.9,
          store: "Amazon",
          category: "Eletrônicos",
          coupon: "",
          featured: true,
          active: true,
        },
        {
          title: "Kit 4 Potes Herméticos Organizadores",
          link: "https://exemplo.com/afiliado/potes-organizadores",
          image: "",
          price: 34.5,
          originalPrice: 59.9,
          store: "Magalu",
          category: "Casa",
          coupon: "CASA15",
          featured: false,
          active: true,
        },
      ],
    });
    console.log("Ofertas de exemplo criadas.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
