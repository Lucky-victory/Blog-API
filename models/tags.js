const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema",fields:{
   text:String,
   createdAt:Date,
         
},silent:true,primaryKey:'id'});

const Tags=new Model("Tags",BlogSchema);
module.exports=Tags;
