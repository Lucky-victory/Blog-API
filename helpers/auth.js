const cookie=require("cookie");
const { NullOrUndefined, isObject } = require("./utils");
const jwt=require('jsonwebtoken');
const { IS_PROD } = require("../constants");
const Users = require("../models/users.model");


const getJwtFromCookies=(req)=>{
    const {blog_user_token}=cookie.parse(req.headers.cookie || "");
    
    const token =blog_user_token;
return ({token})
}
const setJwtToCookies=(res,token='')=>{
    res.cookie("blog_user_token",token,{httpOnly:IS_PROD,secure:IS_PROD});
}
const verifyToken = (token) => {
    let payload = null;
    try {
        
        payload = jwt.verify(token, process.env.JWT_SECRET || "12345");
        
        return [payload,null]
    }
catch (error) {
    return [null,error]
}    
}
const validateToken = (req,res,next) => {
    const {token}=getJwtFromCookies(req);
    if (!token) {
         req.user = null;
        next();
        return
    }
    const [payload, error] = verifyToken(token);
    if (error) throw new Error('invalid token');
    
    req.user = {
        id:payload?.id,
        superUser:payload?.superUser
    }
    next();
    }
const generateToken =(payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET || "12345",{expiresIn:"30d"})
    }
const getUser=async (userId) => {
    try {
        if (!userId) throw new Error("userId is required");
        const user = await Users.findOne({ uid: userId },['uid as id','fullname','username','profileImage']);
        if (!user) {
            return [null,"user not found"]
        }
        return [user, null];
        
    }
    catch (error) {
        return [null,error]
    }
    }

module.exports={getJwtFromCookies,verifyToken,generateToken,setJwtToCookies,getUser,validateToken}
