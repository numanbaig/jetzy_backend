import { Router } from "express";
import { 
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany
} from "../controllers/company.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import upload from "../middlewares/upload.middleware.ts"; 

const router = Router();

router.route("/create").post(verifyJWT, upload.single('logo'), createCompany) 
router.route("/get_all_companies").get(verifyJWT, getAllCompanies); 
router.route("/get_by_id/:id") .get(verifyJWT, getCompany) 
router.route("/update_by_id/:id") .put(verifyJWT, upload.single('logo'), updateCompany) 
router.route("/delete/:id").delete(verifyJWT, deleteCompany);

export default router;