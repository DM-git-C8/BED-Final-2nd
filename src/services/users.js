import prisma from "./prismaClient.js";

export const getAllUsers = async (filters = {}) => {
  const where = {};

  if (filters.username) {
    where.username = {
      contains: filters.username,
      mode: "insensitive",
    };
  }

  if (filters.email) {
    where.email = filters.email;
  }

  return prisma.user.findMany({
    where,
    select: {
      password: false,
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      pictureUrl: true,
    },
  });
};

export const getUserById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      password: false,
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      pictureUrl: true,
    },
  });

export const createUser = (data) => prisma.user.create({ data });

export const updateUser = (id, data) =>
  prisma.user.update({ where: { id }, data });

export const deleteUser = (id) => prisma.user.delete({ where: { id } });

export const deleteUserWithDependencies = async (id) => {
  await prisma.review.deleteMany({ where: { userId: id } });
  await prisma.booking.deleteMany({ where: { userId: id } });
  return prisma.user.delete({ where: { id } });
};

export const findUserForAuth = (username) =>
  prisma.user.findFirst({
    where: { username },
  });
