import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import staffModel from "../models/staffModel.js";
import appointmentModel from "../models/appointmentModel.js";

const changeStaffAvailability = async (req, res) => {
  try {
    const { staffId } = req.body;

    const staffData = await staffModel.findById(staffId);
    await staffModel.findByIdAndUpdate(staffId, {
      available: !staffData.available,
    });
    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const staffList = async (req, res) => {
  try {
    const staffs = await staffModel.find({}).select(["-password", "-email"]);

    res.json({ success: true, staffs });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for Staff Login
const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await staffModel.findOne({ email });

    if (!staff) {
      return res.json({ success: false, message: "Invalid credintials" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);

    if (isMatch) {
      const token = jwt.sign({ id: staff._id }, process.env.JWT_SECRET);

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credintials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get staff appoitnments for staff panel
const appointmentsStaff = async (req, res) => {
  try {
    const { staffId } = req.body;
    const appointments = await appointmentModel.find({ staffId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to mark appointment completed for staff panel
const appointmentComplete = async (req, res) => {
  try {
    const { staffId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.staffId === staffId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to cancel appointment for staff panel
const appointmentCancel = async (req, res) => {
  try {
    const { staffId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.staffId === staffId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get dashboard data for staff
const staffDashboard = async (req, res) => {
  try {
    const { staffId } = req.body;

    const appointments = await appointmentModel.find({ staffId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let users = [];

    appointments.map((item) => {
      if (!users.includes(item.userId)) {
        users.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      users: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get staff profile
const staffProfile = async (req, res) => {
  try {
    const { staffId } = req.body;

    const profileData = await staffModel
      .findById(staffId)
      .select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to update staff profile data
const updateStaffProfile = async (req, res) => {
  try {
    const { staffId, available } = req.body;

    await staffModel.findByIdAndUpdate(staffId, {available})

    res.json({ success: true,message: 'Profile updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeStaffAvailability,
  staffList,
  loginStaff,
  appointmentsStaff,
  appointmentComplete,
  appointmentCancel,
  staffDashboard,
  staffProfile,
  updateStaffProfile
};
