"use strict";
const Authors=require("../models/authors");
const bcrypt=require("bcrypt");
const { generateUsername}=require("../helpers/utils");
const asyncHandler=require("express-async-handler");
const nodemailer = require("nodemailer");


// register a new user/author
const createUser= asyncHandler(async(req,res)=>{
    try{
    
    const {profileImage="https://cdn.pixabay.com/photo/2016/08/21/16/31/emoticon-1610228__480.png",bio,twitter,linkedIn,fullname,email,password}=req.body;
    
    let {username}=req.body;
    username=generateUsername(username);

    if(!fullname || !email || !password){
        res.status(400).json({message:"please provide the required fields",requiredFields:["fullname","email","password"],status:400});
        return 
    }

    // check if a user with the email already exist;
    const emailExist= await Authors.findOne({email});

if(emailExist){
res.status(400).json({message:"user already exist"});
    return
}
// check if a user with the username already exist;
const usernameExist= await Authors.findOne({username});
if(usernameExist){
res.status(400).json({message:`'${username}' have been taken`});
    return
}
const joinedAt=new Date().toISOString();
const newUser= {profileImage,bio,twitter,linkedIn,website,joinedAt,username,fullname,email,superUser:false};

// hash the password before storing in database
try{

    newUser["password"]= await bcrypt.hash(String(password),10);
}
catch{

}


await Authors.create(newUser);
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
        res.status(400).json({"message":"please provide the required fields",requiredFields:["email","password"],status:400});
        
        return;
    }
    // check if user exist
    const user=await Authors.findOne({email});
    if(!user){
        res.status(404).json({"message":"user not found",status:404})
        return
    }
    let passwordMatch= await bcrypt.compare(String(password),String(user.password));
        
    if(user && !passwordMatch){
        res.status(400).json({"message":"invalid credentials",status:400});
        return
    }
    
    req.user=user;
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
