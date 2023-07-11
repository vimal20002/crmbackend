import express from "express"
import { addFeed, addLead, addPLead, addTag, addToList, adddone, addneg, addpos,  adminLogin,  delLead,  delLead2,  getEmployee, getLead, getPlead, getnextLead, getprevLead, leadName, login, partEmployee, recall, register, removeFromList, setPass, setTarget } from "../controllers.js";
import { adminModel } from "../modals/adminModal.js";
import { userModal } from "../modals/userModal.js";

const checkAdmin=async(req,res,next)=>{
    try {
        const admin=await adminModel.findOne({email:"sid@admin.com"})
         if(admin.token===req.body.token){
            next();
         }
         else{
            res.json({message:"Sorry ! You're not an admin."})
         }
    } catch (error) {
        console.log(error)
    }
}





const router = express.Router();
router.post("/register",register)
router.post("/login",login)

router.post('/addlead',checkAdmin,addLead)
router.post('/addfeed',addFeed)
router.post('/getplead',getPlead)


router.post('/addpos',addpos)
router.post('/adddone',checkAdmin,adddone)
router.post('/addname',leadName)
router.post('/recall',recall)
router.post('/settarget',checkAdmin,setTarget)
router.post('/getnextleads',checkAdmin,getnextLead)
router.post('/getprevleads',checkAdmin,getprevLead)
router.post('/getlead',getLead)
router.post('/addplead',checkAdmin,addPLead)
router.post('/addtag',addTag)
router.post('/addtolist',addToList)
router.post('/removefromlist',removeFromList)
router.post('/getemployee',checkAdmin,getEmployee)
router.post('/partemployee',checkAdmin,partEmployee)
router.post('/dellead',checkAdmin,delLead)
router.post('/dellead2',checkAdmin,delLead2)
router.post('/adminlogin',adminLogin);
router.post('/resettoken',setPass);












export default router