const router=require('express').Router();
const {getArticleBySlug,deleteArticle,editArticle}=require('../controllers/article');
const cors=require("cors");
router.get('/:slug',cors(),getArticleBySlug);
router.put('/edit/:articleId',editArticle);
router.delete('/delete/:articleId',deleteArticle);

module.exports=router;