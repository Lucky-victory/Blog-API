const router=require("express").Router();
const { getComments } = require('../controllers/comments.controller');
router.get("/:postId",getComments);
router.post("/new/:postId")
router.put("/edit/:commentId")

router.delete('/:commentId')

module.exports=router
