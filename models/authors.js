const {Schema,Model}=require("harpee");
const connectDB=require('../config/db');
connectDB();
const ArticlesSchema=new Schema({name:"ArticlesSchema",fields:{
   fullname:String,
   username:String,
   email:String,
   twitter:String,
   website:String,
   linkedIn:String
}});

const Authors=new Model("Authors",ArticlesSchema);

module.exports=Authors;