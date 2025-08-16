import express from 'express';

const router=express.Router();

import { addService, getServices, getSingleService ,updateService ,deleteService} from "../controllers/serviceController.js";

router.post("/addService",addService);
router.get("/",getServices);
router.get("/:id",getSingleService);
router.patch("/:id",updateService); 
router.delete("/:id",deleteService);

export default router;