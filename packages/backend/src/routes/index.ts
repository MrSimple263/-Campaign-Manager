import { Router } from "express";

import { authRoutes } from "../modules/auth/index";
import { campaignRoutes } from "../modules/campaigns/index";

const router = Router();

router.use("/auth", authRoutes);
router.use("/campaigns", campaignRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
