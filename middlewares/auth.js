
const jwt=require("jsonwebtoken");

const isAuthenticated=async(req,res,next)=>{

}
const isSuperUser=async(req,res,next)=>{

}
const setAuth=(req,res,next)=>{
const {user}=req;
if(user){

   const signedJwt= jwt.sign(user.id,"12345");
localStorage.setItem("jwt_blog",signedJwt);
   next()
}

}
module.exports={isAuthenticated,isSuperUser,setAuth}