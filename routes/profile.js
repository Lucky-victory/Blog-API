const router=require("express").Router();
const {getAuth,getUser}=require("../middlewares/auth");

router.get("/:username",getAuth,getUser);


module.exports=router;