const router=require("express").Router();

const {createUser,loginUser,deleteUser, sendMail}=require("../controllers/auth");
const {setAuth,getAuth, getUserProfile,getUser,destroyAuth}=require("../middlewares/auth");

router.post("/register",createUser);
router.post("/login",loginUser,setAuth)
router.get("/login",getAuth,getUserProfile);
router.post("/logout",destroyAuth);


module.exports=router;
