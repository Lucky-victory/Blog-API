const router=require('express').Router();
const {getArticleBySlug,deleteArticle,editArticle}=require('../controllers/article')

router.get('/:slug',getArticleBySlug);
router.put('/edit/:articleId',editArticle);
router.delete('/delete/:articleId',deleteArticle);

module.exports=router;