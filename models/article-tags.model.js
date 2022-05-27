const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema",fields:{
   createdAt:Date,
   postId:String,
   tagId:String
},silent:true,primaryKey:'atid'});

const ArticleTags=new Model("ArticleTags",BlogSchema);
module.exports=ArticleTags;
