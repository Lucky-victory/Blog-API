const router=require("express").Router();

const {createUser,loginUser,deleteUser}=require("../controllers/auth.controller");
const {setAuth,authenticateUser, getUserProfile,destroyAuth}=require("../middlewares/auth");

router.post("/signup",createUser);
router.post("/signin",loginUser,setAuth)
router.get("/signin",authenticateUser,getUserProfile);
router.post("/signout",destroyAuth);


module.exports=router;
