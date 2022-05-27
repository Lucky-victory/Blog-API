const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema",fields:{
   postId:String,
   text:String,
   createdAt:Date,
   modifiedAt:Date,
   userId:String,
   status:String,
},silent:true,primaryKey:'cid'});

const Comments=new Model("Comments",BlogSchema);
module.exports=Comments;
