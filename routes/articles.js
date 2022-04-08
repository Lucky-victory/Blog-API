const router=require('express').Router();
const { getPublishedArticles,createNewArticle}=require('../controllers/articles');
const cors=require("cors");
const { editArticle, deleteArticle } = require('../controllers/article');
const { authenticateUser } = require('../middlewares/auth');

router.get('/',cors(),getPublishedArticles);
router.post('/create',authenticateUser, createNewArticle);
router.put('/:articleId',authenticateUser, editArticle);
router.delete('/:articleId',authenticateUser ,deleteArticle);

module.exports=router;
