const router=require('express').Router();
const {getArticles,getTags,createNewArticle,getCategories}=require('../controllers/articles');

router.get('/',getArticles);
router.get('/tags',getTags);
router.get("/categories",getCategories);
router.post('/create',createNewArticle);

module.exports=router;