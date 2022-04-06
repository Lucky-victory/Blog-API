const router=require('express').Router();
const {getArticles: getPublishedArticles,createNewArticle,getCategories}=require('../controllers/articles');
const cors=require("cors");
const { editArticle, deleteArticle } = require('../controllers/article');

router.get('/',cors(),getPublishedArticles);
router.post('/create',createNewArticle);
router.put('/:articleId',editArticle);
router.delete('/:articleId',deleteArticle);

module.exports=router;
