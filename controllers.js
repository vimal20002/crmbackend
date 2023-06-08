import { adminModel } from "./modals/adminModal.js"
import { leadModel } from "./modals/leadSchema.js"
import { userModal } from "./modals/userModal.js"
import nodemailer from "nodemailer"
import uuid4 from "uuid4";
import bcrypt from "bcrypt"

const datee=new Date();
console.log(datee.getHours())
    const setPass=async()=>{
    if(datee.getHours()===16){
        var chars = "0123456789mnopqr";
        var passwordLength = 6;
        var password = "";
        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber +1);
           }
           console.log(password);
           const admin =await adminModel.findOne({email:"sid@admin.com"})
           admin.password=password;
           await admin.save();
           const leads =await leadModel.find({});
           leads?.map(async(e)=>{
              const lead=await leadModel.findOne({_id:e._id});
              lead.today=false;
              await lead.save();
           })
           const transporter=nodemailer.createTransport({
            service:'outlook',
            pool:true,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.EMAIL_PASS
            }
           });
          
           var mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.SID,
            subject: 'Token for Employee Login',
            text: `Dear Siddharth,\n
Token for the Tommorow Login is ${password} \n
Regards,\n
 MoneyArambh Soft. Ltd`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log("error hai")
              console.log(error);
            } else {
              console.log('Email sent');
            }
          });

          var mailOption2={
            from: process.env.SMTP_USER,
            to: process.env.SOMIL,
            subject: 'Token for Employee Login',
            text: `Dear Somil,\n
 Token for the Tommorow Login is ${password} \n
Regards,\n
MoneyArambh Soft. Ltd`
          }


          setTimeout(()=>{
            transporter.sendMail(mailOption2,function(error,info){
                if(error){
                    console.log(error)
                }
                else{
                    console.log("Email Sent!")
                }
             })
          },60*1000)
        





    }
}
setPass();
setInterval(()=>{
    setPass();
},24*60*60*1000)
    
    
  
   


export const register =async(req,res)=>{
    try {
        console.log(req.body)
        const user = await userModal.findOne({email:req.body.email})
        if(user)
        {
            res.json({message:"User already exist"})
        }
        else{
            var salt = await bcrypt.genSalt(10);
            const hpass=await bcrypt.hash(req.body.password,salt)
            const user = new userModal({...req.body,password:hpass });
            user.pos=0;
            user.done=0;
            user.total=0;
            await user.save()
            res.json({message:"Registered Successfully"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const adminLogin=async(req,res)=>{
   try {
       const admin =await adminModel.findOne({email:req.body.email});
       if(admin){
        console.log(admin);
           if(admin.adminPassword===req.body.password){
               const token=uuid4();
               console.log(token);
            admin.token=token;
            await admin.save();
            res.json({token:token});
             
        }
        else{
            res.json({message:"Invalid Credentials"})
        }
    }
    else{
        res.json({message:"You're not an Admin !"})
    }
    
   } catch (error) {
    console.log(error)
   }
}





export const login =async(req,res)=>{
    try {
        console.log(req.body)
        const user = await userModal.findOne({email:req.body.email});
        console.log(user)
        if(user)
        {
            console.log("welcome")
            const admin = await adminModel.findOne({email:"sid@admin.com"})
            if(admin){
                console.log(admin.password,req.body.token)
            if(admin.password===req.body.token && await bcrypt.compare(req.body.password,user.password))
            res.json(user);
            else{
                res.json({message:"You are not a employee"})
            }
        }
        
    }
        
        else{
            res.json({message:"You are not a employee"})
     }
            }
           
            catch (error) {
        console.log(error)
    }
}
export const addpos=async(req,res)=>{
    try {
        const user =  await userModal.findOne({email:req.body.email})
        if(user){
            user.pos=user.leadList.length;
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
            console.log(user)
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
    console.log(req.body)
    try {
        const user =  await userModal.findOne({email:req.body.email})
        if(user){
            const prev = user.done;
            console.log(req.body.ammount)
            const tot=prev+Number(req.body.ammount);
            user.done=tot;
            await user.save();
            console.log(user)
            res.json(user)
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
            res.json(user)

        }
        else{
            res.json({message:"User not found"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const getnextLead=async(req,res)=>{
    try {
        const admin = await adminModel.findOne({email:"sid@admin.com"})
        var idx = admin.idx;
        if(idx === undefined)
        idx = 0;
        const leads =  await leadModel.find({})
        const arr=[];
        console.log(leads)
        var i  = idx;
        while(i<=idx+100){
            const element =   leads[i];
            arr.push(element)
            i++;
        }        
        if(idx>=leads.length)
        admin.idx=0;
        else
        admin.idx=idx+100;
        await admin.save()
        console.log(arr)
        res.json(arr)
    } catch (error) {
        console.log(error)
    }
}
export const getprevLead=async(req,res)=>{
    try {
        const admin = await adminModel.findOne({email:"sid@admin.com"})
        var idx = admin.idx;
        if(idx === undefined)
        idx = 0;
        const leads =  await leadModel.find({})
        const arr=[];
        console.log(leads)
        var i  = idx;
        while(i>=idx-100 && i>=0){
            const element =   leads[i];
            arr.push(element)
            i--;
        }        
        
        admin.idx=idx-100>=0?idx-100:0;
        await admin.save()
        console.log(arr)
        res.json(arr)
    } catch (error) {
        console.log(error)
    }
}
export const addLead =async(req,res)=>{
    console.log(req.body)
    try {
        console.log(req.body.obj)
        Array.from(req.body.obj).map(async(e)=>{
            const lead = new leadModel(e);
            lead.status=false;
            lead.today=false;
            lead.date=new Date().toLocaleDateString();
            lead.name="";
            await lead.save()
        })
        res.json({message:"Leads added successfully"})
    } catch (error) {
        console.log(error)
    }
}
export const addPLead =async(req,res)=>{
    try {
        const user = await userModal.findOne({email:req.body.email})
        if(user===null)
        {
            res.json({message:"You are not a employee"})
        }
        else {
        const arr=[];
        Array.from(req.body.obj).map(async(e)=>{
            const lead = new leadModel(e);
            lead.status=true;
            lead.today=false;
            lead.date=new Date().toLocaleDateString();
            lead.name="";
            await lead.save()
            // console.log(arr)
            arr.push(lead)
        })
        setTimeout(async() => {
            
            Array.from(user.leadList).map((e)=>{
                arr.push(e);
            })
            user.leadList=arr;
            await user.save();
            console.log(arr)
            res.json({message:"Leads added successfully"})
        }, 60*1000);
    }
    } catch (error) {
        console.log(error)
    }
}

export const getLead=async(req,res)=>{
    try {
      const employee=await userModal.findOne({email:req.body.email})
      if(employee===null)
      {
        res.json({message:'You are not an Employee!'})
      }
      
      else{
      const data = await leadModel.find({})
      data.reverse();
      const newData=data.filter((e)=>{
        return e?.status===false && e?.today===false;
      })
      const date = new Date();
     
      const td=newData?.filter((e)=>{
        console.log(e.date)
          return date - new Date(e?.date)<=86400000;
        }) 
             
        var count= 5;
        var idx=0;
        var arr=[];
        
        while(count&&idx<=td.length-1)
        {
            arr.push(td[idx]);
            const ld=await leadModel.findOne({_id:td[idx]._id});
            ld.today=true;
            await ld.save();
            count--;
            idx++;
        }
        if(count<=0)
        {
            res.json(arr)
        }
        const bd=newData?.filter((e)=>{
            console.log(e.date)
              return e?.tags?.length==0;
            }) 
        idx=0;
        while(count&&idx<=bd.length-1)
        {
            arr.push(bd[idx]);
            const ld=await leadModel.findOne({_id:bd[idx]._id});
            ld.today=true;
            await ld.save();
            count--;
            idx++;
        }
        if(count<=0)
        {
            res.json(arr)
        }
        const ht=newData?.filter((e)=>{
            console.log(e.date)
              return e?.tags?.length!=0;
            }) 
            idx=0;
            while(count&&idx<=ht.length-1)
            {
                arr.push(ht[idx]);
                const ld=await leadModel.findOne({_id:ht[idx]._id});
                ld.today=true;
                await ld.save();
                count--;
                idx++;
            }
        console.log(arr)
      res.json(arr)
    }

    } catch (error) {
        console.log(error)
    }
}
export const addFeed=async(req,res)=>{
    try {
        const lead =  await leadModel.findOne({phone:req.body.phone})
        console.log(lead)
        if(lead){
        const arr = lead.feed;
        arr.push({feed:req.body.feed,date:new Date().toLocaleDateString(),name:req.body.name})
        lead.feed = arr;
        console.log(arr)
        await lead.save();
        res.json({message:"Feed added successfully"});
        }
        else{
            res.json({message:"Lead not found"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const getPlead=async(req,res)=>{
    console.log(req.body)
    try {
        const lead =  await leadModel.findOne({phone:req.body.phone})
        console.log(lead)
        if(lead){
        res.json(lead)
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
            res.json({message:`This Lead will be shown you on ${req.body.date}`})
            }
            else{
                res.json({message:"Lead not found"})
            }
    } catch (error) {
        console.log(error)
    }
}
export const addTag=async(req,res)=>{
    try {
        const lead = await leadModel.findOne({phone:req.body.phone})
        const user=await userModal.findOne({email:req.body.email});
        user.total=(user.total===undefined?0:user.total)+1;
        const arr1=user.current;
        const obj = {
            phone:req.body.phone,
            tag:req.body.tag,
        }
        if(req.body==="ni")
        {
            lead.status=true;
        }
        arr1.push(obj)
        user.current=arr1;
        const arr = lead.tags;
        arr.push(req.body.tag)
        lead.tags=arr;
        await lead.save()
        await user.save();
        console.log(user)
        res.json({plead:lead,user:user})   
    } catch (error) {
        console.log(error)
    }
    
}
export const  addToList=async(req,res)=>{
try {
    const employee =await userModal.findOne({email:req.body.email})
    if(employee!==null){
    const lead = await leadModel.findOne({phone:req.body.phone})
    if(lead!==null){
    lead.status=true;
    const arr=employee.leadList
    arr.push(lead)
    employee.leadList=arr;
    employee.pos=employee.pos+1;
    await employee.save();

    res.json({message:"Added to your List",user:employee})
    }
    else{
        res.json({message:"Lead not found"})
    }
    }
    else{
        res.json({message:"You are not a employee"})
    }
} catch (error) {
    console.log(error)
}
}
export const  removeFromList=async(req,res)=>{
    try {
        const employee =await userModal.findOne({email:req.body.email})
        if(employee!==null){
        const lead = await leadModel.findOne({phone:req.body.phone})
        if(lead!==null){
        lead.status=false;
        const arr=employee.leadList.filter((e)=>{
            return e.phone!==lead.phone
        })
        employee.leadList=arr;
        await employee.save();
        res.json({message:"Deleted from List",user:employee})
        }
        else{
            res.json({message:"Lead not found"})
        }
        }
        else{
            res.json({message:"You are not a employee"})
        }
    } catch (error) {
        console.log(error)
    }
    }

export const getEmployee=async(req,res)=>{
    try {
        const data = await userModal.find({})
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}
export const partEmployee=async(req,res)=>{
    try {
        const employee=await userModal.findOne({phone:req.body.phone});
        if(employee!==null){
            res.json(employee);
        }
        else{
            res.json({message:"Employee Not Found"})
        }
    } catch (error) {
        console.log(error)
    }
}
export const delLead=async(req,res)=>{
    console.log(req.body)
    try {
        const user = await userModal.findOne({phone:req.body.ephone})
        const arr = user.leadList;
        const obj = arr.filter((e)=>{
            return e.phone!==req.body.lphone
        })
        user.leadList=obj;
        await user.save()
        res.json({message:"Deleted successfully"})

    } catch (error) {
        console.log(error)
    }
}
export const delLead2=async(req,res)=>{
    try {
        
        await leadModel.deleteOne({phone:req.body.phone});
        res.json({message:"Deleted successfully"})

    } catch (error) {
        console.log(error)
    }
}