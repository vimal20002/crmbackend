import { adminModel } from "./modals/adminModal.js"
import { leadModel } from "./modals/leadSchema.js"
import { userModal } from "./modals/userModal.js"

export const register =async(req,res)=>{
    try {
        console.log(req.body)
        const user = await userModal.findOne({email:req.body.email})
        if(user)
        {
            res.json({message:"User already exist"})
        }
        else{
            const user = new userModal(req.body);
            user.pos=0;
            user.neg=0;
            user.done=0;
            user.target=0;
            await user.save()
            res.json({message:"Registered Successfully"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const login =async(req,res)=>{
    try {
        console.log(req.body)
        const user = await userModal.findOne({email:req.body.email})
        if(user)
        {
            const admin = await adminModel.findOne({email:"sid@admin.com"})
            if(admin.password===req.body.password)
            res.json(user)
            else
            res.json({message:"Invalid Credentials"})

        }
        else{
            res.json({message:"User not found"})
            
        }
    } catch (error) {
        console.log(error)
    }
}
export const addpos=async(req,res)=>{
    try {
        const user =  await userModal.findOne({email:req.body.email})
        if(user){
            user.pos=user.pos+1;
            await user.save();
            res.json({message:"Postive feedback added successfully"})
        }
        else{
            res.json({message:"User not found"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const addneg=async(req,res)=>{
    try {
        const user =  await userModal.findOne({email:req.body.email})
        if(user){
            user.neg=user.neg+1;
            await user.save();
            res.json({message:"Negative feedback added successfully"})
        }
        else{
            res.json({message:"User not found"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const adddone=async(req,res)=>{
    try {
        const user =  await userModal.findOne({email:req.body.email})
        if(user){
            user.done=user.done+req.body.ammount;
            await user.save();
            res.json({message:"Work updated successfully"})
        }
        else{
            res.json({message:"User not found"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const setTarget=async(req,res)=>{
    try {
        const user =  await userModal.findOne({email:req.body.email})
        if(user){
            user.target=req.body.target;
            await user.save();
            res.json({message:"Target added successfully"})

        }
        else{
            res.json({message:"User not found"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const getAllLead=async(req,res)=>{
    try {
        const leads =  await leadModel.find({})
        res.json(leads)
    } catch (error) {
        console.log(error)
    }
}
export const addLead =async(req,res)=>{
    console.log(req.body)
    try {
        console.log(req.body)
        Array.from(req.body).map(async(e)=>{
            const lead = new leadModel(e);
            lead.status=false;
            await lead.save()
        })
        res.json({message:"Leads added successfully"})
    } catch (error) {
        console.log(error)
    }
}
export const getLead=async(req,res)=>{
    try {
      const data = await leadModel.find({})
      const newData=data.filter((e)=>{
        return e?.status===false;
      })
      const rs=[];
      newData.map((e)=>{
        if(rs.length===5){
        return;
        }
        
      })
      res.json({message:"Added successfully"})

    } catch (error) {
        console.log(error)
    }
}
export const addFeed=async(req,res)=>{
    try {
        const lead =  await leadModel.findOne({phone:req.body.phone})
        if(lead){
        const arr = lead.feed;
        arr.push({feed:req.body.feed,date:new Date().toLocaleDateString(),name:req.body.name})
        lead.feed = arr;
        console.log(arr)
        await lead.save();
        res.json({message:"Comment added sucessfully"})
        }
        else{
            res.json({message:"Lead not found"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const getFeed=async(req,res)=>{
    try {
        const lead =  await leadModel.findOne({phone:req.body.phone})
        if(lead){
        const arr = lead.feed;
        res.json(arr)
        }
        else{
            res.json({message:"Lead not found"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const leadName =async(req,res)=>{
    try {
        const lead =  await leadModel.findOne({phone:req.body.phone})
        if(lead){
            lead.name=req.body.name;
            await lead.save()
            res.json({message:"Name added to lead"})
            }
            else{
                res.json({message:"Lead not found"})
            }
    } catch (error) {
        console.log(error)
    }
}
export const recall =async(req,res)=>{
    try {
        const lead =  await leadModel.findOne({phone:req.body.phone})
        if(lead){
            lead.date=req.body.date;
            await lead.save()
            res.json({message:`We will notify you at ${req.body.date}`})
            }
            else{
                res.json({message:"Lead not found"})
            }
    } catch (error) {
        console.log(error)
    }
}