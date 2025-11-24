import prisma from "./prismaClient.js";

export const getAllBookings = (filters = {}) => {
  const where = {};
  if (filters.userId) where.userId = filters.userId;
  return prisma.booking.findMany({ where });
};

export const getBookingById = (id) =>
  prisma.booking.findUnique({ where: { id } });

export const createBooking = (data) => {
  if (data.checkinDate) data.checkinDate = new Date(data.checkinDate);
  if (data.checkoutDate) data.checkoutDate = new Date(data.checkoutDate);
  return prisma.booking.create({ data });
};

export const updateBooking = (id, data) =>
  prisma.booking.update({ where: { id }, data });

export const deleteBooking = (id) => prisma.booking.delete({ where: { id } });
