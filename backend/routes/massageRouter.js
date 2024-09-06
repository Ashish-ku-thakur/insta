import express from 'express';
import { IsAuthenticated } from '../utils/isAuthenticated.js';
import { GetAllMassages, SendMassage } from '../controllers/massageController.js';

let router = express.Router()

router.route("/send/:id").post(IsAuthenticated, SendMassage)
router.route("/all/:id").get(IsAuthenticated, GetAllMassages)

export default router