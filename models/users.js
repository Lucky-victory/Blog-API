const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema",fields:{
   fullname:String,
   username:String,
   email:String,
   password:String,
   twitter:String,
   github:String,
   joinedAt:String,
   linkedIn:String,
   bio:String,
   profileImage:String,
   superUser:Boolean
},silent:true,primaryKey:'id'});

const Users=new Model("Users",BlogSchema);

module.exports=Users;