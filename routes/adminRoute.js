import express from 'express'
import {addService, addStaff,allStaffs,allServices,loginAdmin} from '../controllers/adminController.js'
import upload from '../middleware/multor.js'
import authAdmin from '../middleware/authAdmin.js'
import {changeStaffAvailability} from '../controllers/staffController.js'
import {changeServiceAvailability} from '../controllers/serviceController.js'


const adminRouter = express.Router()

adminRouter.post('/add-staff',authAdmin,upload.single('image'),addStaff)
adminRouter.post('/add-service',authAdmin,upload.single('image'),addService)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-staffs',authAdmin,allStaffs)
adminRouter.post('/all-services',authAdmin,allServices)
adminRouter.post('/change-staff-availability',authAdmin,changeStaffAvailability)
adminRouter.post('/change-service-availability',authAdmin,changeServiceAvailability)

export default adminRouter;