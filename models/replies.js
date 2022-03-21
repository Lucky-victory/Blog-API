const {Schema,Model}=require("harpee");

const ArticlesSchema=new Schema({name:"B2Schema",fields:{
   approved:Boolean,
   commentId:String,
   text:String,
   createdAt:Date,
   modifiedAt:Date,
   userId:String,
},silent:true});

const Replies=new Model("Replies",ArticlesSchema);
module.exports=Replies;