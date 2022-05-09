const router=require("express").Router();

router.get("/:articleId");
router.post("/new/:articleId")
router.put("/edit/:commentId")

router.delete('/:commentId')

module.exports=router
