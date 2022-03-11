const {Schema,Model}=require("harpee");
const connectDB=require('../config/db');
connectDB();
const ArticlesSchema=new Schema({name:"ArticlesSchema",fields:{
   title:String,
   body:String,
   tags:String,
   publishedAt:Date,
   modifiedAt:Date,
   authorId:String,
   slug:String,
   heroImage:String
},silent:true});

const Articles=new Model("Articles",ArticlesSchema);

module.exports=Articles;