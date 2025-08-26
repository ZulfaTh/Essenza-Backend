import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentsStaff, loginStaff, staffDashboard, staffList, staffProfile, updateStaffProfile } from '../controllers/staffController.js'
import authStaff from '../middleware/authStaff.js'

const staffRouter = express.Router()

staffRouter.get('/list',staffList)
staffRouter.post('/login',loginStaff)
staffRouter.get('/appointments',authStaff,appointmentsStaff)
staffRouter.post('/complete-appointment',authStaff,appointmentComplete)
staffRouter.post('/cancel-appointment',authStaff,appointmentCancel)
staffRouter.get('/dashboard',authStaff,staffDashboard)
staffRouter.get('/profile',authStaff,staffProfile)
staffRouter.post('/update-profile',authStaff,updateStaffProfile)
export default staffRouter;