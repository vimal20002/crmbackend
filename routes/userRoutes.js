import express from "express"
import { addFeed, addLead, adddone, addneg, addpos, getAllLead, getFeed, leadName, login, recall, register, setTarget } from "../controllers.js";
const router = express.Router();
router.post("/register",register)
router.post("/login",login)
router.post('/addlead',addLead)
router.post('/addfeed',addFeed)
router.post('/getfeed',getFeed)


router.post('/addpos',addpos)
router.post('/addneg',addneg)
router.post('/adddone',adddone)
router.post('/addname',leadName)
router.post('/recall',recall)
router.post('/settarget',setTarget)
router.post('/getallleads',getAllLead)











export default router