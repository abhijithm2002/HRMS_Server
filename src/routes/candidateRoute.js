import { Router } from "express";
import CandidateController from "../controller/candidateController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const candidateController = new CandidateController()

router.post('/addCandidate', candidateController.addCandidate.bind(candidateController));
router.get('/getAllCandidates', candidateController.getAllCandidates.bind(candidateController));
router.patch('/updateStatus/:id', candidateController.updateCandidateStatus.bind(candidateController));
router.get('/getAllEmployees', candidateController.getAllEmployees.bind(candidateController));
router.delete('/deleteEmployee/:id', candidateController.deleteEmployee.bind(candidateController));
router.patch('/updateEmployee/:id', candidateController.updateEmployee.bind(candidateController));



export const candidateRoute = router;