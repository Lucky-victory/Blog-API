require('dotenv').config();
const connectDB=require("./db.config");
connectDB();
const Users= require("../models/users");
const Articles= require("../models/articles");
const Comments= require("../models/comments");
const Replies= require("../models/replies");
const ArticleTags = require('../models/articleTags');
const Tags = require('../models/tags');

async function initializeDB(){

    await Articles.init();
    await Users.init();
    await Comments.init();
    await Replies.init();
    await ArticleTags.init();
    await Tags.init();
  
}
initializeDB();


module.exports=initializeDB;
