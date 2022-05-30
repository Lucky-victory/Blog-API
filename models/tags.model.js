const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema2",fields:{
   text:String,
   createdAt:Date,
         
},silent:true,primaryKey:'tid'});

const Tags=new Model("Tags",BlogSchema);
module.exports=Tags;
