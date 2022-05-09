const { getArticlesByAuthor} = require('../controllers/author.controller');
const cors=require("cors");
const router=require('express').Router();


router.get("/:author",cors(),getArticlesByAuthor);
module.exports=router;
