"use strict";
const Users=require("../models/users");
const bcrypt=require("bcrypt");
const { generateUsername, stripKeysFromObj, NullOrUndefined, isEmpty}=require("../helpers/utils");
const asyncHandler=require("express-async-handler");
const { encode } = require("html-entities");
const {Converter}= require("showdown");
const converter=new Converter();


// register a new user/author
const createUser= asyncHandler(async(req,res)=>{
    try{
    
    const {profileImage="https://cdn.pixabay.com/photo/2016/08/21/16/31/emoticon-1610228__480.png",twitter,linkedIn,github,fullname,email,password}=req.body;
    
    let {username,bio}=req.body;
    bio= converter.makeHtml(bio);
    bio=encode(bio);
    if(!fullname || !email || !password){
       return res.status(400).json({message:"please provide the required fields",requiredFields:["fullname","email","password"],status:400});

    }
    username=generateUsername(
        !NullOrUndefined(username) && !isEmpty(username)?
        username : fullname
        );

    // check if a user with the email already exist;
    const emailExist= await Users.findOne({email});

if(emailExist){
return res.status(400).json({message:"user already exist"});
    
}
// check if a user with the username already exist;
const usernameExist= await Users.findOne({username});
if(usernameExist){
return res.status(400).json({message:`'${username}' have been taken`});
}
const joinedAt=new Date().toISOString();
const newUser= {profileImage,bio,twitter,linkedIn,joinedAt,username,fullname,email,superUser:false,github};

// hash the password before storing in database
try{
    newUser["password"]= await bcrypt.hash(String(password),10);
}
catch{

}


await Users.create(newUser);
res.status(201).json({message:"new user created",status:201});
}
catch(error){
    const status=error.status||500;
    res.status(status).json({message:"an error occurred, couldn't create user",status,error});
}

});


// log a user/author in
const loginUser=asyncHandler(async(req,res,next)=>{
try{

    const {password,email}=req.body;
    if(!password || !email){
      return res.status(400).json({message:"please provide the required fields",requiredFields:["email","password"],status:400});
    }
    // check if user exist
    const user=await Users.findOne({email});
    if(!user){
       return res.status(404).json({message:"user not found",status:404})
        
    }
    const passwordMatch= await bcrypt.compare(String(password),user.password);
        
    if(user && !passwordMatch){
     return res.status(400).json({message:"invalid credentials",status:400});
    
    }
    
    req.user=stripKeysFromObj(user,['joinedAt','__createdtime__','__updatedtime__','password']);
    next();
}
catch(error){
    const status=error.status||500;
    res.status(status).json({message:"an error occurred, couldn't login",status,error});

}
});

const deleteUser=async(req,res)=>{

}

module.exports={createUser,deleteUser,loginUser}
