
const Articles=require('../models/articles');
const Authors=require("../models/authors");
const Comments=require("../models/comments");
const Replies=require("../models/replies");
const asyncHandler=require('express-async-handler');
const { StringToArray, generateSlug, NullOrUndefined, isEmpty,arrayBinder, stripKeysFromObj} = require('../helpers/utils');
const { decode } = require('html-entities');

// get a single article
const getArticleBySlug= asyncHandler (async (req,res)=>{
   try{

      const urlSlug=req.params.slug;
      if(!urlSlug){
         res.status(400).json({message:"No slug provided",status:400});
         return
      }
      const article=await Articles.findOne({"slug":urlSlug});
      if(!article){
         res.status(404).json({message:`article with slug '${urlSlug}' was not found`,status:404});
   return  ;  
}
const {title,publishedAt,modifiedAt,slug,heroImage,id,authorId,category,views,readTime,intro}=article;
let {tags,content}=article;
content=decode(content);
tags= StringToArray(tags);
const {fullname,twitter,linkedIn,bio,profileImage,username}=await Authors.findOne({"id":authorId});

// query comments table with article id
let comments= await Comments.query(`SELECT id,text,postId,userId,createdAt FROM ArticlesSchema.Comments WHERE postId='${id}' ORDER BY createdAt DESC`);
// get comment ids to query replies table;
const commentsId=comments.map((comment)=>comment.id);

let replies=await Replies.query(`SELECT id,text,commentId,userId,createdAt FROM ArticlesSchema.Replies WHERE commentId IN ("${commentsId.join('","')}") ORDER BY createdAt DESC`);
// combine comments with replies based on their related id
comments=arrayBinder(comments,replies,{
   innerProp:"commentId",outerProp:"id",innerTitle:"replies"
});
// combine Articles with Comments based on their related id

const newViewsCount=parseInt(views)+1 || 1;
 await Articles.update([{id,'views':newViewsCount}]);
res.status(200).json({title,content,slug,views,publishedAt,modifiedAt,tags,intro,heroImage,id,category,author:{'id':authorId,fullname,twitter,linkedIn,profileImage,bio,username,readTime},comments});

}
catch(err){
   const status=err.status ||500;
   res.status(status).json({message:"an error occurred",error:err,status})
}
});

// edit article
const editArticle=asyncHandler (async(req,res)=>{
   try{
      if(!req.isAuthenticated) return res.status(403).json({message:'Forbidden, not logged in',status:403});
      const userId=req.userId;
      const user= await Authors.findOne({'id':userId});
      if(user && user.id != userId) return res.status(401).json({message:'Unathorized, you can\'t edit this article',status:401});
      
      const {articleId}=req.params;
      if(!articleId) return res.status(400).json({message:"No article id provided",status:400});

      
   if(isEmpty(req.body)) return res.status(400).json({message:"Nothing to update, body not provided",status:400});
      
      const {title,updateSlug}=req.body;
      const articleToUpdate=req.body || {};
      if(title && updateSlug){
         articleToUpdate["slug"]=generateSlug(title);
         
      }
      !NullOrUndefined(updateSlug) ? stripKeysFromObj(articleToUpdate,['updateSlug']) :"";
      articleToUpdate["id"]=articleId;
      articleToUpdate["modifiedAt"]=new Date().toISOString();
     const {update_hashes,skipped_hashes}= await Articles.update([articleToUpdate]);
     if(skipped_hashes[0]){
        res.status(404).json({"status":404,message:`article with id ${skipped_hashes[0]} was not found`})
      return
     }
      res.status(200).json({"status":200,message:`sucessfully updated article with id ${update_hashes[0]}`})
   }
   catch(err){
      const status=err.status ||500;
      res.status(status).json({message:"an error occurred",error:err,status})
   }
});

// delete an article
const deleteArticle=asyncHandler(async(req,res)=>{
   try{

      const {articleId}=req.params;
      if(!articleId){
     res.status(400).json({message:"No article id provided"});
     return
   }
   const {deleted_hashes,skipped_hashes}=await Articles.findByIdAndRemove([articleId]);
   if(skipped_hashes[0]){

      res.status(404).json({message:`article with id '${skipped_hashes[0]}' was not found`,status:404});
      return;
   }
   res.status(200).json({message:`sucessfully deleted article with id ${deleted_hashes[0]}`,status:200});
}
catch(err){
   const status=err.status ||500;
   res.status(status).json({"message":"an error occurred","error":err,status});
}
   
});

const getArticleById=asyncHandler( async(id)=>{
try{
const article=await Articles.findById([id]);
return [article,null];
}
catch(error){
   return [null,error];
}
   
}


)
module.exports={editArticle,deleteArticle,getArticleBySlug,getArticleById}