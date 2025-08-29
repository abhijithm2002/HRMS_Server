import { Router } from "express";
import CandidateController from "../controller/candidateController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const candidateController = new CandidateController()

router.post('/addCandidate', candidateController.addCandidate.bind(candidateController));
router.get('/getAllCandidates', candidateController.getAllCandidates.bind(candidateController));
router.patch('/updateStatus/:id', candidateController.updateCandidateStatus.bind(candidateController));


export const candidateRoute = router;