import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataDir = path.resolve("./src/data");

  const users = JSON.parse(
    await fs.readFile(path.join(dataDir, "users.json"), "utf8")
  ).users;
  const hosts = JSON.parse(
    await fs.readFile(path.join(dataDir, "hosts.json"), "utf8")
  ).hosts;
  const properties = JSON.parse(
    await fs.readFile(path.join(dataDir, "properties.json"), "utf8")
  ).properties;
  const bookings = JSON.parse(
    await fs.readFile(path.join(dataDir, "bookings.json"), "utf8")
  ).bookings;
  const reviews = JSON.parse(
    await fs.readFile(path.join(dataDir, "reviews.json"), "utf8")
  ).reviews;
  const amenities = JSON.parse(
    await fs.readFile(path.join(dataDir, "amenities.json"), "utf8")
  ).amenities;

  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.property.deleteMany();
  await prisma.host.deleteMany();
  await prisma.user.deleteMany();
  await prisma.amenity.deleteMany();

  for (const u of users) {
    await prisma.user.create({ data: u });
  }

  for (const h of hosts) {
    await prisma.host.create({ data: h });
  }

  for (const a of amenities) {
    await prisma.amenity.create({ data: a });
  }

  for (const p of properties) {
    const { id, ...rest } = p;
    await prisma.property.create({ data: { id, ...rest } });
  }

  for (const b of bookings) {
    await prisma.booking.create({
      data: {
        ...b,
        checkinDate: new Date(b.checkinDate),
        checkoutDate: new Date(b.checkoutDate),
      },
    });
  }

  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }

  console.log("Seeding finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
