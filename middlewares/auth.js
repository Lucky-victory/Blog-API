const Users = require("../models/users.model");
const { getJwtFromCookies, verifyToken, generateToken, setJwtToCookies } = require("../helpers/auth");
const { NotNullOrUndefined } = require("../helpers/utils");
const { decode } = require("html-entities");


const setAuth = (req, res, next) => {
   const { user } = req;
   if (user) {
      const token = generateToken({ id: user.uid, superUser: user.superUser });
      setJwtToCookies(res, token);

      return res.status(200).json({ message: "login successful", status: 200, user });

   }

}
const authenticateUser = (req, res, next) => {
   const { token } = getJwtFromCookies(req);
   if (!token) {
      res.status(403).json({ message: 'Forbidden, not logged in', status: 403 })
return
   }
   const { id, superUser } = verifyToken(token);
   if (id) {
      req.isAuthenticated = true;
      req.userId = id;
      req.superUser = superUser;
   }
   next();


}

const getUserProfile = (req, res, next) => {
   const { user } = req;
   if (!user) {
      res.status(400).json({ message: "no profile" })
      return
   }
   res.status(200).json({ user, status: 200 });


}

const getUserByUsername = async (req, res, next) => {
   const usernameSlug = req.params.username;
   if (!usernameSlug) {
      return
   }
   const { userId, isAuthenticated } = req;

   let currentUser = await Users.findOne({ "username": usernameSlug });
   if (!currentUser) {
      res.status(404).json({ message: "user not found", status: 404 });
      return;
   }
   if (userId && userId == currentUser.uid) {
      // currentUser= await Users.findOne({"id":userId});
      currentUser["isAuthorized"] = true;
   }
   const { uid:id, fullname, username, twitter, linkedIn, github, profileImage, isAuthorized } = currentUser;
   let { bio } = currentUser;
   bio = decode(bio);
   res.json({ "user": { id, fullname, username, bio, profileImage, twitter, linkedIn, github, isAuthorized, isAuthenticated, csrfToken: req.csrfToken() }, message: "user retrieved" });

};



const destroyAuth = (req, res) => {
   const { token } = getJwtFromCookies();
   if (token) {
      setJwtToCookies(res);
      res.status(307).redirect("/")
   }

}

const userProfileEdit = async (req, res) => {
   const { userId, isAuthenticated } = req;
   if (!isAuthenticated) {
      res.status(400).json({
         message: 'Not logged In',
         status: 400
      })
      return;
   }
   const userExist = await Users.findOne({ uid: userId });
   if (!userExist) {
      res.send({ message: "user not found", status: 404 });
      return
   }

   if ((userId !== userExist.uid) && !userExist.superUser) {
      res.status(401).json({ message: "Unauthorized", status: 401 })
      return

   }
   const infoToUpdate = req.body;

   await Users.update({ uid: userId, ...NotNullOrUndefined(infoToUpdate) });
   res.send({ message: 'profile successfully updated', status: 200 })

};





module.exports = { setAuth, authenticateUser, getUserProfile, getUserByUsername, destroyAuth, userProfileEdit }