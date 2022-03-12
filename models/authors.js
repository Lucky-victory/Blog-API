const {Schema,Model}=require("harpee");
const connectDB=require('../config/db');
connectDB();
const ArticlesSchema=new Schema({name:"ArticlesSchema",fields:{
   fullname:String,
   username:String,
   email:String,
   password:String,
   twitter:String,
   website:String,
   linkedIn:String,
   bio:String,
   profileImage:String,
   superUser:Boolean
}});

const Authors=new Model("Authors",ArticlesSchema);

module.exports=Authors;