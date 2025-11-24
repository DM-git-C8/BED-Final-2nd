import { findUserForAuth } from "./users.js";

export const validateUser = async (username, password) => {
  const user = await findUserForAuth(username);
  if (!user) return null;
  if (user.password !== password) return null;
  // return user without password
  const { password: pw, ...rest } = user;
  return rest;
};
