const router=require('express').Router();
const { getPublishedArticles,createNewArticle}=require('../controllers/articles.controller');
const cors=require("cors");
const { editArticle, deleteArticle } = require('../controllers/article.controller');
const { authenticateUser } = require('../middlewares/auth');
const { csrfProtect } = require('../middlewares/csrf-protect');

router.get('/',cors(),getPublishedArticles);
router.post('/create',authenticateUser, createNewArticle);
router.put('/:articleId',authenticateUser,csrfProtect, editArticle);
router.delete('/:articleId',authenticateUser ,csrfProtect, deleteArticle);

module.exports=router;
