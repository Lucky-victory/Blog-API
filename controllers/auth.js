"use strict";
const Authors=require("../models/authors");
const randomWords=require("random-words");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {randomHexId}=require("../helpers/utils");
const asyncHandler=require("express-async-handler");
const nodemailer = require("nodemailer");
const res = require("express/lib/response");





// register a new user/author
const createUser= asyncHandler(async(req,res)=>{
    try{
    // generate random username
    const defaultUsername=randomWords({exactly:2,join:"-"})+"-"+randomHexId();

    const {profileImage="https://cdn.pixabay.com/photo/2016/08/21/16/31/emoticon-1610228__480.png",bio,twitter,linkedIn,fullname,email,password}=req.body;
    
    let {username=defaultUsername}=req.body;
    username=slugify(username,{strict:true,lower:true,remove:/[*+~.()'"!:@]/g});

    if(!fullname || !email || !password){
        res.status(400).json({"message":"please provide the required fields",requiredFields:["fullname","email","password"],status:400});
        return 
    }

    // check if a user with the email already exist;
    const emailExist= await Authors.findOne({email});

if(emailExist){
res.status(400).json({"message":"user already exist"});
    return
}
// check if a user with the username already exist;
const usernameExist= await Authors.findOne({username});
if(usernameExist){
res.status(400).json({"message":`'${username}' have been taken`});
    return
}
const newUser= {profileImage,bio,twitter,linkedIn,username,fullname,email};

// hash the password before storing in database
try{

    newUser["password"]= await bcrypt.hash(String(password),10);
}
catch{

}
newUser["superUser"]=false;

await Authors.create(newUser);
res.status(201).json({"message":"new user created",status:201});
}
catch(err){
    res.status(500).json({"message":"an error occurred",status:err.status || 500,"error":err});
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
catch(err){
    res.status(500).json({"message":"an error occured",status:err.status || 500,"error":err})
}
});

const deleteUser=async(req,res)=>{

}

const sendMail=asyncHandler(async(req,res)=>{

    try{
        main().catch(console.error)
        res.json({"info":"mail sent "})     
    }
catch(err){
    res.json({"error":err})
}
});

async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
      tls:{
rejectUnauthorized:false
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <luckyvictory54@gmail.com>', // sender address
      to: "blizwonder25@gmail.om", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
  
  
module.exports={createUser,deleteUser,loginUser,sendMail}
