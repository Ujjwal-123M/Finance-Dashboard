import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface AuthPayload {
  sub: string;
}

export const signToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
};
