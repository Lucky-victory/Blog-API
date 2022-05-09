const {createConnection}=require('harpee');

const connectDB=()=>createConnection({host:process.env.DB_HOST,password:process.env.DB_PASS,username:process.env.DB_USER});

module.exports=connectDB;