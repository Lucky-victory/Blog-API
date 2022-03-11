const {createConnection}=require('harpee');

const connectDB=()=>createConnection({host:"https://hashnode-lv.harperdbcloud.com",password:"@veek.247",username:"veek"});

module.exports=connectDB;