const {Schema,Model}=require("harpee");

const BlogSchema=new Schema({name:"BlogSchema",fields:{
   createdAt:Date,
     role:String
},silent:true,primaryKey:'id'});

const Roles=new Model("Roles",BlogSchema);
module.exports=Roles;
