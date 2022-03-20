const router=require("express").Router();
const {getAuth,getUser,userProfileEdit}=require("../middlewares/auth");
const { csrfProtect } = require("../middlewares/csrf-protect");

router.get("/:username",getAuth,csrfProtect, getUser);
router.get("/:username/edit",getAuth,csrfProtect,getUser);
router.put("/edit",getAuth,userProfileEdit)

module.exports=router;