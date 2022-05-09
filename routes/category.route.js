const { getCategories,getArticlesByCategory} = require('../controllers/category.controller');
const cors=require("cors");
const router=require('express').Router();


router.get("/",cors(),getCategories);
router.get("/:category",cors(),getArticlesByCategory);
module.exports=router;
