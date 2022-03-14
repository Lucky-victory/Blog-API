const Authors=require("../models/authors");
const randomWords=require("random-words");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {randomHexId}=require("../helpers/utils");
const asyncHandler=require("express-async-handler");


// register a new user/author
const createUser= asyncHandler(async(req,res)=>{
    
    // generate random username
    const defaultUsername=randomWords({exactly:2,join:"-"})+"-"+randomHexId();

    const {profileImage="https://cdn.pixabay.com/photo/2016/08/21/16/31/emoticon-1610228__480.png",bio,twitter,linkedIn,username=defaultUsername,fullname,email,password}=req.body;
    
    if(!fullname || !email || !password){
        res.status(400).json({"message":"please provide the required fields",requiredFields:["fullname","email","password"],status:400});
        return 
    }

    // check if a user with the email already exist;
    const emailExist= await Authors.findOne({email});
    //res.status(200).json({email,"e":emailExist,"me":33})
    
if(emailExist){
res.status(400).json({"message":"user already exist"});
    return
}
// check if a user with the username already exist;
const usernameExist= await Authors.findOne({username});
if(usernameExist){
res.status(400).json({"message":`user with username '${username}' already exist`});
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
    res.status(400).json({"message":"an error occurred",status:err.status || 500,"error":err});
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

module.exports={createUser,deleteUser,loginUser}
