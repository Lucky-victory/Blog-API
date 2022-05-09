const router=require("express").Router();

const {createUser,loginUser,deleteUser}=require("../controllers/auth");
const {setAuth,authenticateUser, getUserProfile,destroyAuth}=require("../middlewares/auth");

router.post("/register",createUser);
router.post("/login",loginUser,setAuth)
router.get("/login",authenticateUser,getUserProfile);
router.post("/logout",destroyAuth);


module.exports=router;
