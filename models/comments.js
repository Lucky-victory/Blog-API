const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema",fields:{
   approved:Boolean,
   postId:String,
   text:String,
   createdAt:Date,
   modifiedAt:Date,
   userId:String,
},silent:true,primaryKey:'id'});

const Comments=new Model("Comments",BlogSchema);
module.exports=Comments;
