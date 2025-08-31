import express from 'express'
import {addService, addStaff,allStaffs,allServices,loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard, allReviews, allUsers, updateStaff, appointmentComplete, deleteStaff, updateService, deleteService} from '../controllers/adminController.js'
import upload from '../middleware/multor.js'
import authAdmin from '../middleware/authAdmin.js'
import {changeStaffAvailability} from '../controllers/staffController.js'
import {changeServiceAvailability} from '../controllers/serviceController.js'


const adminRouter = express.Router()

adminRouter.post('/add-staff',authAdmin,upload.single('image'),addStaff)
adminRouter.post('/update-staff', upload.single("image"),authAdmin,updateStaff)
adminRouter.post('/delete-staff',authAdmin,deleteStaff)

adminRouter.post('/add-service',authAdmin,upload.single('image'),addService)
adminRouter.post('/update-service', upload.single("image"),authAdmin,updateService)
adminRouter.post('/delete-service',authAdmin,deleteService)

adminRouter.post('/login',loginAdmin)

adminRouter.post('/all-users',authAdmin,allUsers)
adminRouter.post('/all-staffs',authAdmin,allStaffs)
adminRouter.post('/all-services',authAdmin,allServices)
adminRouter.post('/all-reviews',authAdmin,allReviews)

adminRouter.post('/change-staff-availability',authAdmin,changeStaffAvailability)
adminRouter.post('/change-service-availability',authAdmin,changeServiceAvailability)

adminRouter.get('/appointments',authAdmin,appointmentsAdmin);
adminRouter.post('/complete-appointment',authAdmin,appointmentComplete)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)

adminRouter.get('/dashboard',authAdmin,adminDashboard)

export default adminRouter;