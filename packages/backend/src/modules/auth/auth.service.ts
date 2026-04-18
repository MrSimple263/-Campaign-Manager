import { sign } from "jsonwebtoken";

import { config } from "@/config/index";
import { AppError } from "@/shared/middleware/index";
import { hashPassword, comparePassword } from "@/shared/utils/index";

import { authRepository } from "./auth.repository";

import type { RegisterInput, LoginInput, AuthResponse } from "./auth.types";
import type { SafeUser, User } from "@/shared/types/index";
import type { SignOptions } from "jsonwebtoken";

function toSafeUser(user: User): SafeUser {
  const { password_hash: _, ...safeUser } = user;
  return safeUser;
}

function generateToken(user: SafeUser): string {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };

  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
  };

  return sign(payload, config.jwt.secret, options);
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, name, password } = input;

    // Check if user already exists
    const isEmailTaken = await authRepository.isEmailTaken(email);
    if (isEmailTaken) {
      throw new AppError(409, "Email already registered");
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const user = await authRepository.create({
      email,
      name,
      password_hash,
    });

    const safeUser = toSafeUser(user);
    const token = generateToken(safeUser);

    return { token, user: safeUser };
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    // Find user by email
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError(401, "Invalid email or password");
    }

    const safeUser = toSafeUser(user);
    const token = generateToken(safeUser);

    return { token, user: safeUser };
  },

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    return toSafeUser(user);
  },
};
