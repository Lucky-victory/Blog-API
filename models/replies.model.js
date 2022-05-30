const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema2",fields:{
   commentId:String,
   text:String,
   createdAt:Date,
   modifiedAt:Date,
   userId:String,
   status:String
},silent:true,primaryKey:'rid'});

const Replies=new Model("Replies",BlogSchema);
module.exports=Replies;
