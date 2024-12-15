import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getUsersPanigated,
} from "../controllers/user.js";
import { verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", verifyUser, updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/:id", verifyUser, getUser);

//GET ALL
router.get("/", getUsers);

router.get("/panigated", getUsersPanigated);


export default router;
