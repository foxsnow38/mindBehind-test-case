import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");
  prisma.$connect();

  console.log("Seeding users ...");
  const users = await prisma.user.createMany({
    data: [
      {
        nickname: "admin",
        password: "12345678",
      },
      {
        nickname: "user",
        password: "12345678",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding companies ...");
  const companies = await prisma.companies.createMany({
    data: [
      {
        name: "MindBehind",
        latitude: 41.11414004177308,
        longitude: 29.020894190899206,
        branch_id: 7,
        full_address:
          "Maslak, Ahi Evran St. No:6 D:42, D:B Block, 34398 Sarıyer/İstanbul",
        phone: 9999999999,
      },
      {
        name: "Apple",
        latitude: 37.33182,
        longitude: -122.03118,
        branch_id: 1,
        full_address: "1 Infinite Loop, Cupertino, CA 95014, USA",
        phone: 4089961010,
      },
      {
        name: "Google",
        latitude: 37.422,
        longitude: -122.084,
        branch_id: 2,
        full_address: "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
        phone: 6502530000,
      },
      {
        name: "Facebook",
        latitude: 37.484,
        longitude: -122.148,
        branch_id: 3,
        full_address: "1 Hacker Way, Menlo Park, CA 94025, USA",
        phone: 6505434800,
      },
      {
        name: "Amazon",
        latitude: 47.6205,
        longitude: -122.3493,
        branch_id: 4,
        full_address: "410 Terry Ave N, Seattle, WA 98109, USA",
        phone: 2062661000,
      },
      {
        name: "Microsoft",
        latitude: 47.6405,
        longitude: -122.1293,
        branch_id: 5,
        full_address: "1 Microsoft Way, Redmond, WA 98052, USA",
        phone: 4258828080,
      },
      {
        name: "Tesla",
        latitude: 37.416,
        longitude: -122.151,
        branch_id: 6,
        full_address: "3500 Deer Creek Rd, Palo Alto, CA 94304, USA",
        phone: 6506815000,
      },
    ],
    skipDuplicates: true,
  });
}
console.log("Seeding finish ...");
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
