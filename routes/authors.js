const router=require("express").Router();
const {createUser,loginUser,deleteUser}=require("../controllers/auth");
const {setAuth}=require("../middlewares/auth");

router.post("/register",createUser);
router.post("/login",loginUser,setAuth);

module.exports=router;
