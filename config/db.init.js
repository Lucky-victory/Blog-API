require('dotenv').config();
const connectDB=require("./db.config");
connectDB();
const Users= require("../models/users.model");
const Articles= require("../models/articles.model");
const Comments= require("../models/comments.model");
const Replies= require("../models/replies.model");
const ArticleTags = require('../models/article-tags.model');
const Tags = require('../models/tags.model');

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
