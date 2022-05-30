const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema2",fields:{
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
   status:String,

},silent:true,primaryKey:'pid'});

const Articles=new Model("Articles",BlogSchema);
module.exports=Articles;
