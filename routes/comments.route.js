const router=require("express").Router();
const { getApprovedComments } = require('../controllers/comments.controller');
router.get("/:postId",getApprovedComments);
router.post("/new/:postId")
router.put("/edit/:commentId")

router.delete('/:commentId')

module.exports=router
