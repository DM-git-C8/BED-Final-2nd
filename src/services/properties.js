import prisma from "./prismaClient.js";

export const getAllProperties = async (filters = {}) => {
  const where = {};

  if (filters.location) {
    where.location = {
      contains: String(filters.location),
    };
  }

  if (filters.pricePerNight !== undefined) {
    const price = Number(filters.pricePerNight);

    if (!isNaN(price)) {
      where.pricePerNight = {
        lte: price,
      };
    }
  }

  return prisma.property.findMany({
    where,
    include: { reviews: true },
  });
};

export const getPropertyById = (id) =>
  prisma.property.findUnique({
    where: { id },
    include: { reviews: true },
  });

export const createProperty = (data) => prisma.property.create({ data });

export const updateProperty = (id, data) =>
  prisma.property.update({ where: { id }, data });

export const deleteProperty = (id) => prisma.property.delete({ where: { id } });
