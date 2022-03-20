
const jwt=require("jsonwebtoken");
const asyncHandler=require("express-async-handler");
const cookie=require("cookie");
const Authors=require("../models/authors");
const { createUser } = require("../controllers/auth");
const res = require("express/lib/response");


const isAuthent=async(req,res,next)=>{

}
const isSuperUser=async(req,res,next)=>{

}
const setAuth=(req,res,next)=>{
const {user}=req;
if(user){
   const token=generateToken({id:user.id});
res.cookie("blog_user_token",token,{httpOnly:true,secure:true});
res.status(200).json({"message":"login successful",status:200,user});
    
   next();
   return
}
res.status(401)

}
const getAuth=(req,res,next)=>{
   
      const {blog_user_token}=cookie.parse(req.headers.cookie || "");
      if(blog_user_token){
         const {id}=verifyToken(blog_user_token);
         if(id){
            req.isAuthenticated=true;
            req.userId=id;
         }
         next();
      }else{
         next();
      }
   
}

const getUserProfile=(req,res,next)=>{
const {user}=req;
if(user){
   res.status(200).json({user,status:200})
}
else{
   res.status(400).json({"message":"no profile"})
}
}

const getUser= asyncHandler(async(req,res,next)=>{
const usernameSlug=req.params.username;
if(!usernameSlug){

   return
}
const {userId,isAuthenticated}=req;

let currentUser= await Authors.findOne({"username":usernameSlug});
if(!currentUser){
   res.json({"message":"user not found",status:404});
   return;
}
if(userId && userId == currentUser.id){
currentUser= await Authors.findOne({"id":userId});
currentUser["isAuthorized"]=true;
}
const {id,fullname,username,twitter,linkedIn,bio,profileImage,isAuthorized}=currentUser;

res.json({"user":{id,fullname,username,bio,profileImage,twitter,linkedIn,isAuthorized,isAuthenticated,csrfToken:req.csrfToken()},"message":"user retrieved from"});

});

const getUserInfo=asyncHandler(async(req,res)=>{
   const {user}=req;


});

const destroyAuth= (req,res)=>{
   const {blog_user_token}=cookie.parse(req.headers.cookie || "");
      if(blog_user_token){
         res.cookie("blog_user_token","")
         res.redirect("/")
      }
}
const userProfileEdit=asyncHandler(async(req,res)=>{
const {userId,isAuthenticated}=req;
if(!isAuthenticated){
   res.redirect("/account/login");
   return;
}
const userExist= await Authors.findOne({"id":userId});
if(!userExist){
res.send({message:"user not found",status:404});
return
}

if((userId !== userExist.id) && !userExist.superUser){
   res.status(403).json({message:"Forbidden",status:403})
   return 

}
   
   await Authors.update({id:userId,...req.body});
   res.send({'message':'updated'})

});

function verifyToken(token){
   return jwt.verify(token,process.env.JWT_SECRET || "12345")
   }
   function generateToken(payload){
   return jwt.sign(payload,process.env.JWT_SECRET || "12345",{expiresIn:"30d"})
   }
   


module.exports={isSuperUser,setAuth,getAuth,getUserProfile,getUser,destroyAuth,userProfileEdit}