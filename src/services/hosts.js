import prisma from "./prismaClient.js";

export const getAllHosts = async (filters = {}) => {
  const where = {};

  if (filters.name) {
    where.name = {
      equals: filters.name,
      mode: "insensitive",
    };
  }

  return prisma.host.findMany({
    where,
    select: {
      password: false,
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      pictureUrl: true,
      aboutMe: true,
    },
  });
};

export const getHostById = (id) => prisma.host.findUnique({ where: { id } });

export const createHost = (data) => prisma.host.create({ data });

export const updateHost = (id, data) =>
  prisma.host.update({ where: { id }, data });

export const deleteHost = (id) => prisma.host.delete({ where: { id } });

export const deleteHostWithDependencies = async (id) => {
  const properties = await prisma.property.findMany({
    where: { hostId: id },
    select: { id: true },
  });

  for (const p of properties) {
    await prisma.booking.deleteMany({ where: { propertyId: p.id } });
    await prisma.review.deleteMany({ where: { propertyId: p.id } });
    await prisma.property.delete({ where: { id: p.id } });
  }

  return prisma.host.delete({ where: { id } });
};
