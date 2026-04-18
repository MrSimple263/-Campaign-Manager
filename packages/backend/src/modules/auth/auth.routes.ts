import { Router } from "express";

import { authenticate, validate } from "@/shared/middleware/index";
import { registerSchema, loginSchema } from "@/validations/schemas";

import { authController } from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.post("/logout", authController.logout);

router.get("/me", authenticate, authController.me);

export default router;
