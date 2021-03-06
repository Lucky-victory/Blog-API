const router=require('express').Router();
const {getArticleBySlug,deleteArticle,editArticle}=require('../controllers/article.controller');
const cors=require("cors");
const { authenticateUser } = require('../middlewares/auth');

router.get('/:slug',cors(),getArticleBySlug);
router.put('/edit/:articleId',authenticateUser, editArticle);
router.delete('/:articleId', authenticateUser, deleteArticle);

module.exports=router;
