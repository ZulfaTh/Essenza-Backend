import express from 'express'
import authUser from '../middleware/authUser.js'
import { processPayment, sendStripeAPI } from '../controllers/paymentController.js'

const paymentRouter = express.Router()

paymentRouter.post('/process',authUser,processPayment)

paymentRouter.get('/stripeapi',sendStripeAPI)

export default paymentRouter;