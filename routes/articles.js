const router=require('express').Router();
const {getArticles,getTags,createNewArticle}=require('../controllers/articles');

router.get('/',getArticles);
router.get('/tags',getTags);
router.post('/create',createNewArticle);

module.exports=router;