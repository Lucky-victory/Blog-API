const router=require("express").Router();
const {authenticateUser,getUserByUsername,userProfileEdit}=require("../middlewares/auth");
const { csrfProtect } = require("../middlewares/csrf-protect");

router.get("/:username",authenticateUser,csrfProtect, getUserByUsername);
router.get("/:username/edit",authenticateUser,csrfProtect,getUserByUsername);
router.put("/edit",authenticateUser,userProfileEdit)

module.exports=router;
