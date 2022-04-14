const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema",fields:{
   title:String,
   content:String,
   createdAt:Date,
   publishedAt:Date,
   modifiedAt:Date,
   authorId:String,
   category:String,
   slug:String,
   views:Number,
   readTime:Number,
   heroImage:String,
   intro:String,
   published:Boolean
},silent:true,primaryKey:'id'});

const Articles=new Model("Articles",BlogSchema);
module.exports=Articles;
