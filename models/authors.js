const {Schema,Model}=require("harpee");

const ArticlesSchema=new Schema({name:"B2Schema",fields:{
   fullname:String,
   username:String,
   email:String,
   password:String,
   twitter:String,
   website:String,
   linkedIn:String,
   bio:String,
   profileImage:String,
   superUser:Boolean
},silent:true});

const Authors=new Model("Authors",ArticlesSchema);

module.exports=Authors;