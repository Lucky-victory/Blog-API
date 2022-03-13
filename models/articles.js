const {Schema,Model}=require("harpee");
const connectDB=require('../config/db');
connectDB();
const ArticlesSchema=new Schema({name:"ArticlesSchema",fields:{
   title:String,
   content:String,
   tags:String,
   publishedAt:Date,
   modifiedAt:Date,
   authorId:String,
   category:String,
   slug:String,
   views:Number,
   heroImage:String
},silent:true});

const Articles=new Model("Articles",ArticlesSchema);
module.exports=Articles;