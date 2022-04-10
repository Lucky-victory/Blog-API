const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema",fields:{
   approved:Boolean,
   commentId:String,
   text:String,
   createdAt:Date,
   modifiedAt:Date,
   userId:String,
},silent:true,primaryKey:'id'});

const Replies=new Model("Replies",BlogSchema);
module.exports=Replies;
