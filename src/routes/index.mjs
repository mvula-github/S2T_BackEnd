import { Router } from "express";
import contributorsRouter from "./contributors.mjs";
import filesRouter from "./files.mjs";
import authRouter from "./auth.mjs";

const router = Router();

router.use(contributorsRouter);
router.use(filesRouter);
router.use(authRouter);

export default router;