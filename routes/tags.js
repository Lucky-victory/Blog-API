const { getTags } = require('../controllers/articles');
const cors=require("cors");

const router=require('express').Router();


router.get('/tags',cors(),getTags);
module.exports=router;
