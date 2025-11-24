import prisma from "./prismaClient.js";

export const getAllReviews = () => prisma.review.findMany();

export const getReviewById = (id) =>
  prisma.review.findUnique({ where: { id } });

export const createReview = (data) => prisma.review.create({ data });

export const updateReview = (id, data) =>
  prisma.review.update({ where: { id }, data });

export const deleteReview = (id) => prisma.review.delete({ where: { id } });
