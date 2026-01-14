import express from "express";
import * as lowonganController from "../controllers/lowonganController.js";
import * as pelamarController from "../controllers/pelamarController.js";
import * as userController from "../controllers/userController.js";
import { authenticateTokenMiddleware } from "../middlewares/authenticateTokenMiddleware.js";
import { authorizeRoleMiddleware } from "../middlewares/authorizeRoleMiddleware.js";

const api = express.Router();

api.post("/signin", userController.signIn)
api.post("/signup", userController.signUp)

api.get("/lowongan", authenticateTokenMiddleware, lowonganController.listLowongan);
api.post("/lowongan", authenticateTokenMiddleware,authorizeRoleMiddleware("admin"), lowonganController.createLowongan);
api.put("/lowongan/:id", authenticateTokenMiddleware, authorizeRoleMiddleware("admin"), lowonganController.updateLowongan);
api.delete("/lowongan/:id", authenticateTokenMiddleware, authorizeRoleMiddleware("admin"), lowonganController.deleteLowongan);

api.get("/pelamar/mine", authenticateTokenMiddleware, pelamarController.listPelamarByUser);
api.get("/pelamar", authenticateTokenMiddleware, authorizeRoleMiddleware("admin"), pelamarController.listPelamar);
api.post("/pelamar", authenticateTokenMiddleware,pelamarController.createPelamar);
api.put("/pelamar/:id", authenticateTokenMiddleware, pelamarController.updatePelamar);
api.delete("/pelamar/:id", authenticateTokenMiddleware, pelamarController.deletePelamar);

export default api;