const cookie=require("cookie");
const { NullOrUndefined } = require("./utils");
const jwt=require('jsonwebtoken');
const { IS_PROD } = require("../constants");


const getJwtFromCookies=(req)=>{
    const {blog_user_token}=cookie.parse(req.headers.cookie || "");
    
    const token =blog_user_token;
return ({token})
}
const setJwtToCookies=(res,token='')=>{
    res.cookie("blog_user_token",token,{httpOnly:IS_PROD,secure:IS_PROD});
}
const verifyToken=(token)=>{
    return jwt.verify(token,process.env.JWT_SECRET || "12345")
    }
    
    const generateToken =(payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET || "12345",{expiresIn:"30d"})
    }

module.exports={getJwtFromCookies,verifyToken,generateToken,setJwtToCookies}