import { Router } from "express";
import { 
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employee.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.route("/create").post(verifyJWT, createEmployee);
router.route("/get_all_employees").get(verifyJWT, getAllEmployees);
router.route("/get_by_id/:id").get(verifyJWT, getEmployee);
router.route("/update_by_id/:id").put(verifyJWT, updateEmployee);
router.route("/delete/:id").delete(verifyJWT, deleteEmployee);

export default router;