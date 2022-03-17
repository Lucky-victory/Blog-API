const router=require("express").Router();
const {getAuth,getUser,userProfileEdit}=require("../middlewares/auth");

router.get("/:username",getAuth,getUser);
router.get("/:username/edit",getAuth,getUser);
router.put("/edit",getAuth,userProfileEdit)

module.exports=router;