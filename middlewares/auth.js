
const jwt=require("jsonwebtoken");
const asyncHandler=require("express-async-handler");


const isAuthenticated=async(req,res,next)=>{

}
const isSuperUser=async(req,res,next)=>{

}
const setAuth=(req,res,next)=>{
const {user}=req;
if(user){
   const signedJwt= jwt.sign(user.id,"12345");

   next()
}
res.status(401)

}
module.exports={isAuthenticated,isSuperUser,setAuth}