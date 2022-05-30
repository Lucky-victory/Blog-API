const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema2",fields:{
   createdAt:Date,
   postId:String,
   tagId:String
},silent:true,primaryKey:'atid'});

const ArticleTags=new Model("ArticleTags",BlogSchema);
module.exports=ArticleTags;
