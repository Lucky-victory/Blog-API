const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema2",fields:{
   createdAt:Date,
     userId:String,
     roleId:String
},silent:true,primaryKey:'urid'});

const userRoles=new Model("userRoles",BlogSchema);
module.exports=userRoles;
