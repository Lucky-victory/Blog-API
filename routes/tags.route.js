const { getAllTags,getArticlesByTag } = require('../controllers/tags.controller');
const cors=require("cors");
const router=require('express').Router();

router.get('/',cors(),getAllTags);
router.get('/:tag',cors(),getArticlesByTag)
module.exports=router;