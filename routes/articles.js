const router=require('express').Router();
const {getArticles,getTags,createNewArticle,getCategories}=require('../controllers/articles');
const cors=require("cors");

router.get('/',cors(),getArticles);
router.get('/tags',cors(),getTags);
router.get("/categories",cors(),getCategories);
router.post('/create',createNewArticle);

module.exports=router;
