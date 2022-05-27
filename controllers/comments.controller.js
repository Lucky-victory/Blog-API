const Comments = require("../models/comments.model");
const Replies = require("../models/replies.model");
const { ArrayBinder,GetLocalTime } = require('../helpers/utils');


const getApprovedComments = async (req, res) => {
   try {

      const { postId } = req.params;
      if (!postId) return res.status(400).json({
         message: "No 'postId' provided"
      });
      let comments = await Comments.query(`SELECT cid as id,text,postId,userId,createdAt FROM BlogSchema.Comments WHERE postId='${postId}' AND status='approved' ORDER BY createdAt DESC`);

      // get comment ids to query replies table;
      const commentsId = comments.map((comment) => comment.id);

      let replies = await Replies.query(`SELECT rid as id,text,commentId,userId,createdAt FROM BlogSchema.Replies WHERE commentId IN ("${commentsId.join('","')}") AND status='approved' ORDER BY createdAt DESC`);
      // combine comments with replies based on their related id
      comments = ArrayBinder(comments, replies, {
         innerProp: "commentId",
         outerProp: "id",
         innerTitle: "replies"
      });
      res.status(200).json({
         message: 'comments retrieved',
         comments
      })
   }
   catch (error) {
      const status = error.status || 500;
      res.status(status).json({ message: "an error occurred", status, error })

   }
};

const addNewComment = async (req, res) => {
   const { postId } = req.params;
   if (!postId) return res.status(400).json({
      message: "No 'postId' provided"
   });
   const { userId } = req;
   const { text, status = 'pending', postId } = req.body;
   const createdAt = GetLocalTime();
   await Comments.create({
      text,
      status,
      postId,
      userId,
      createdAt
   })
}



module.exports = {
   getApprovedComments
}