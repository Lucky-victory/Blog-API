const connectDB=require("./db");
connectDB();
const Authors= require("../models/authors");
const Articles= require("../models/articles");
const Comments= require("../models/comments");
const Replies= require("../models/replies");
async function runDb(){

    await Articles.init();
    await Authors.init();
    await Comments.init();
    await Replies.init();
}
runDb()


module.exports=runDb;
