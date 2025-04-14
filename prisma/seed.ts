import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const groupNames = [
  'Amigos da Faculdade',
  'Família',
  'Trabalho',
  'Futebol',
  'Música',
  'Viagens',
  'Estudos',
  'Games',
  'Culinária',
  'Esportes',
  'Tecnologia',
  'Cinema',
  'Livros',
  'Música',
  'Arte',
  'Fotografia',
  'Negócios',
  'Investimentos',
  'Saúde',
  'Fitness'
];

const messages = [
  'Olá pessoal!',
  'Como vocês estão?',
  'Alguém online?',
  'Bom dia!',
  'Boa tarde!',
  'Boa noite!',
  'Tudo bem?',
  'O que vocês estão fazendo?',
  'Alguém quer conversar?',
  'Que dia lindo!',
  'Alguém viu o jogo ontem?',
  'Que filme bom!',
  'Alguém quer marcar algo?',
  'Que saudade de vocês!',
  'Quando nos vemos?',
  'Alguém tem novidades?',
  'Que notícia incrível!',
  'Alguém quer jogar?',
  'Que música boa!',
  'Alguém quer sair?'
];

async function main() {
  // Criar 5 usuários
  const users = await Promise.all(
    Array.from({ length: 5 }).map(async (_, index) => {
      return prisma.user.create({
        data: {
          email: `admin${index}@gmail.com`,
          name: faker.person.fullName(),
          password: '$2b$10$9AHzdQ.7RnfI5l3mOe0FMOz4L4gfWbauwMvpQRsgZkWADF0BaoNcK', // password: admin@123
        },
      });
    })
  );

  // Criar 20 grupos
  const groups = await Promise.all(
    groupNames.map(async (name) => {
      // Selecionar 2-4 membros aleatórios para cada grupo
      const members = faker.helpers.shuffle(users).slice(0, faker.number.int({ min: 2, max: 4 }));
      
      return prisma.group.create({
        data: {
          name,
          members: {
            connect: members.map((user: User) => ({ id: user.id })),
          },
        },
      });
    })
  );

  // Criar mensagens para cada grupo
  for (const group of groups) {
    // Criar 10-30 mensagens por grupo
    const messageCount = faker.number.int({ min: 10, max: 30 });
    
    for (let i = 0; i < messageCount; i++) {
      // Selecionar um membro aleatório do grupo
      const randomUser = faker.helpers.arrayElement(users);
      
      await prisma.message.create({
        data: {
          content: faker.helpers.arrayElement(messages),
          groupId: group.id,
          userId: randomUser.id,
          createdAt: faker.date.past(), // Mensagens com datas aleatórias no passado
        },
      });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 