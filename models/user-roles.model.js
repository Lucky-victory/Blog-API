const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema",fields:{
   createdAt:Date,
     userId:String,
     roleId:String
},silent:true,primaryKey:'id'});

const userRoles=new Model("userRoles",BlogSchema);
module.exports=userRoles;
