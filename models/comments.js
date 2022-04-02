const {Schema,Model}=require("harpee");

const ArticlesSchema=new Schema({name:"ArticlesSchema",fields:{
   approved:Boolean,
   postId:String,
   text:String,
   createdAt:Date,
   modifiedAt:Date,
   userId:String,
},silent:true});

const Comments=new Model("Comments",ArticlesSchema);
module.exports=Comments;
