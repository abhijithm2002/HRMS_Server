import {Candidate} from '../model/candidateModel.js'
import { Employee } from '../model/employeeModel.js';

export default class CandidateController {
    constructor() {}

    addCandidate = async (req, res) => {
        try {
    
          const {
            fullName,
            email,
            phone,
            position,
            experience,
            resume, 
          } = req.body || {};
    
          if (!fullName || !email) {
            return res.status(400).json({ message: "fullName and email are required." });
          }
    
          
          let resumeFileName = null;
          if (resume && typeof resume === "string") {
            try {
              const url = new URL(resume);
              resumeFileName = url.pathname.split("/").pop() || null;
            } catch {
            
            }
          }
    
          const candidateDoc = await Candidate.create({
            name: fullName,
            email,
            phone,
            position,
            experience: Number.isNaN(Number(experience)) ? 0 : Number(experience),
            resumeUrl: resume || null,
            resumeFileName,
           
          });
          console.log("candidateDoc", candidateDoc)
          return res.status(201).json({
            message: "Candidate created successfully",
            candidate: candidateDoc,
          });
        } catch (error) {
       
          if (error?.code === 11000 && error?.keyPattern?.email) {
            return res.status(409).json({ message: "Email already exists." });
          }
          console.error("Error adding candidate:", error);
          return res.status(500).json({ message: "Server error" });
        }
      };


      getAllCandidates = async (req, res) => {
        try {
          const candidates = await Candidate.find().sort({ createdAt: -1 });
          console.log('candidates',candidates)
          return res.status(200).json({ success: true, data: candidates });
        } catch (error) {
          console.error("Error fetching candidates:", error);
          return res.status(500).json({ success: false, message: "Error fetching candidates" });
        }
      };

      updateCandidateStatus = async (req, res) => {
        try {
          const { id } = req.params;
          const { status } = req.body;
      
          if (!status) {
            return res.status(400).json({ message: "Status is required" });
          }
      
          // Update candidate status
          const candidate = await Candidate.findByIdAndUpdate(
            id,
            { status },
            { new: true }
          );
      
          if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
          }
      
          // If candidate is selected, add to Employee collection
          if (status === "Selected") {
            // Check if employee already exists
            const existingEmployee = await Employee.findOne({ email: candidate.email });
      
            if (!existingEmployee) {
              const newEmployee = await Employee.create({
                name: candidate.name,
                email: candidate.email,
                phone: candidate.phone,
                position: null,
                department: candidate.position, 
                role: "Employee",
                status: "Active",
                startDate: new Date(), 
              });
      
              console.log("New Employee Created:", newEmployee);
            }
          }
      
          return res.status(200).json({
            success: true,
            message: "Candidate status updated successfully",
            candidate,
          });
        } catch (error) {
          console.error("Error updating status:", error);
          return res.status(500).json({ success: false, message: "Server error" });
        }
      };
      
    }

