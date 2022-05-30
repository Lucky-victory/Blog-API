const Comments = require("../models/comments.model");
const Replies = require("../models/replies.model");
const { ArrayBinder,GetLocalTime, isEmpty } = require('../helpers/utils');
const { getUser } = require("../helpers/auth");

const getApprovedComments = async (req, res) => {
   try {

      const { postId } = req.params;
      if (!postId) return res.status(400).json({
         message: "No 'postId' provided"
      });
      let comments = await Comments.query(`SELECT cid as id,text,postId,userId,createdAt FROM BlogSchema2.Comments WHERE postId='${postId}' AND status='approved' ORDER BY createdAt DESC`);

      // get comment ids to query replies table;
      const commentsId = comments.map((comment) => comment.id);

      let replies = await Replies.query(`SELECT rid as id,text,commentId,userId,createdAt FROM BlogSchema2.Replies WHERE commentId IN ("${commentsId.join('","')}") AND status='approved' ORDER BY createdAt DESC`);
      // combine comments with replies based on their related id
      comments = ArrayBinder(comments, replies, {
         innerProp: "commentId",
         outerProp: "id",
         innerTitle: "replies"
      });
   
      const [user] = await getUser(req?.user?.id);
      const currentUser = user;
      res.status(200).json({
         message: 'comments retrieved',
         comments,currentUser
      })
   }
   catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: "an error occurred", status, error })

   }
};

const addNewComment = async (req, res) => {
   try {
      
      const { postId } = req.params;
      if (!postId) return res.status(400).json({
      message: "No 'postId' provided"
   });
   const { userId } = req;
   if (isEmpty(req.body)) {
      return res.status(400).json({
         message:'No contents provided',status:400
      })
   }
   const { text, status = 'pending'} = req.body;
   const createdAt = GetLocalTime();
   await Comments.create({
      text,
      status,
      postId,
      userId,
      createdAt
   });
   res.status(201).json({
      message:'new comment added',status:201
   })
   }
   catch (error) {
      const statusCode = 500;
      res.status(statusCode).json({mesage:'an error occured, couldn\'t add comment',statusCode,error})
   }
}



module.exports = {
   getApprovedComments,addNewComment
}