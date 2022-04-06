const { getCategories } = require('../controllers/articles');
const cors=require("cors");
const router=require('express').Router();


router.get("/categories",cors(),getCategories);
module.exports=router;
