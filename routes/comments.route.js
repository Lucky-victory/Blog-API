const router=require("express").Router();
const { getApprovedComments, addNewComment } = require('../controllers/comments.controller');
const { validateToken } = require("../helpers/auth");
const { authenticateUser } = require('../middlewares/auth');

router.get("/:postId",validateToken,getApprovedComments);
router.post("/new/:postId",authenticateUser , addNewComment)
router.put("/edit/:commentId",authenticateUser)

router.delete('/:commentId')

module.exports=router
