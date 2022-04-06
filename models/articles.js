const {Schema,Model}=require("harpee");

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
   readTime:Number,
   heroImage:String,
   published:Boolean
},silent:true});

const Articles=new Model("Articles",ArticlesSchema);
module.exports=Articles;
