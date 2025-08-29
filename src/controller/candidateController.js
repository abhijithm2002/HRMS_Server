import { Attendance } from '../model/attendanceModel.js';
import { Candidate } from '../model/candidateModel.js'
import { Employee } from '../model/employeeModel.js';

export default class CandidateController {
    constructor() { }

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
            console.log('candidates', candidates)
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

            if (status === "Selected") {
                const existingEmployee = await Employee.findOne({ email: candidate.email });

                if (!existingEmployee) {
                    const newEmployee = await Employee.create({
                        name: candidate.name,
                        email: candidate.email,
                        phone: candidate.phone,
                        position: "Intern",
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

    getAllEmployees = async (req, res) => {
        try {
            const employees = await Employee.find().sort({ createdAt: -1 });
            console.log('employees', employees)
            return res.status(200).json({ success: true, data: employees });
        } catch (error) {
            console.error("Error fetching candidates:", error);
            return res.status(500).json({ success: false, message: "Error fetching candidates" });
        }
    }

    deleteEmployee = async (req, res) => {
        try {
            const { id } = req.params;

            const employee = await Employee.findByIdAndDelete(id);

            if (!employee) {
                return res.status(404).json({ success: false, message: "Employee not found" });
            }

            return res.status(200).json({
                success: true,
                message: "Employee deleted successfully",
                employee,
            });
        } catch (error) {
            console.error("Error deleting employee:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    };

    updateEmployee = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            console.log(updatedData)

            const employee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });

            if (!employee) {
                return res.status(404).json({ success: false, message: "Employee not found" });
            }

            return res.status(200).json({ success: true, message: "Employee updated successfully", employee });
        } catch (error) {
            console.error("Error updating employee:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    };

    getAllAttendance = async (req, res) => {
        console.log('entered get all')
        try {
            const attendence = await Employee.find().sort({ createdAt: -1 });
            console.log('employees', attendence)
            return res.status(200).json({ success: true, data: attendence });
        } catch (error) {
            console.error("Error fetching candidates:", error);
            return res.status(500).json({ success: false, message: "Error fetching candidates" });
        }
    };
    updateStatus = async (req, res) => {
        try {
          const { id } = req.params;
          const { status } = req.body;
    
          const record = await Attendance.findByIdAndUpdate(id, { status }, { new: true });
    
          if (!record) return res.status(404).json({ success: false, message: "Attendance record not found" });
    
          return res.status(200).json({ success: true, data: record });
        } catch (error) {
          console.error("Error updating attendance status:", error);
          return res.status(500).json({ success: false, message: "Server error" });
        }
      };
}

