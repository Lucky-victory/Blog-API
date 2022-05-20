
const Articles=require('../models/articles.model');
const Users=require("../models/users.model");
const Comments=require("../models/comments.model");
const Tags = require('../models/tags.model');
const ArticleTags = require('../models/articleTags.model');
const {  GenerateSlug, NullOrUndefined, isEmpty,ArrayBinder, RemoveKeysFromObj, ObjectArrayToStringArray,GetLocalTime} = require('../helpers/utils');
const { decode } = require('html-entities');

// get a single article
const getArticleBySlug= async (req,res)=>{
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

const {title,publishedAt,modifiedAt,slug,heroImage,id,authorId,category,views,readTime}=article;
let {content,intro}=article;
content=decode(content);
intro=decode(intro);
let author=await Users.findOne({"id":authorId},["fullname","twitter","linkedIn","id","username","profileImage","bio"]);
author['bio']=decode(author['bio']);
// get tag ids from ArticleTags table where article id matches
const tagIds=await ArticleTags.query(`SELECT tagId FROM BlogSchema.ArticleTags WHERE postId='${id}'`);

// get tag(s) from Tags table with tagIds
let tags=await Tags.query(`SELECT text FROM BlogSchema.Tags WHERE id IN("${ObjectArrayToStringArray(tagIds).join('","')}")`);
// transfrom the object response into strings
 tags=ObjectArrayToStringArray(tags);


// combine Articles with Comments based on their related id
const comments= await Comments.query(`SELECT count(id) as commentsCount FROM BlogSchema.Comments WHERE postId='${article.id}'`);

const {commentsCount}=comments[0].commentsCount;

const newViewsCount=parseInt(views)+1 || 1;
 await Articles.update([{id,'views':newViewsCount}]);
res.status(200).json({title,content,slug,views,publishedAt,modifiedAt,intro,heroImage,id,category,author,readTime, tags,commentsCount});

}
catch(err){
   const status=err.status ||500;
   res.status(status).json({message:"an error occurred",error:err,status})
}
};

// edit article
const editArticle=async(req,res)=>{
   try{
      if(!req.isAuthenticated) return res.status(403).json({message:'Forbidden, not logged in',status:403});
      const {userId,superUser}=req;
   
      const {articleId}=req.params;
const article= await Articles.findOne({id:articleId})
 if(!article){
        res.status(404).json({"status":404,message:`article with id '${articleId}' was not found`})
      return
     }
    
      if(article.authorId != userId && !superUser) return res.status(401).json({message:'Unathorized, you can\'t edit this article',status:401});

      
   if(isEmpty(req.body)) return res.status(400).json({message:"Nothing to update, body not provided",status:400});
      
      // the updateSlug property is to decide whether to update the slug when the title gets updated, 
      // updating a slug would cause 404 errors for shared links
     // this is why slug update was made optional
      const {title,updateSlug}=req.body;
      const articleToUpdate=req.body || {};
      if(title && updateSlug){
         articleToUpdate["slug"]=GenerateSlug(title);
         
      }
      !NullOrUndefined(updateSlug) ? RemoveKeysFromObj(articleToUpdate,['updateSlug']) :"";
      articleToUpdate["id"]=articleId;
      articleToUpdate["modifiedAt"]=GetLocalTime();
     const {update_hashes}= await Articles.update([articleToUpdate]);
    
      res.status(200).json({"status":200,message:`sucessfully updated article with id ${update_hashes[0]}`})
   }
   catch(err){
      const status=err.status ||500;
      res.status(status).json({message:"an error occurred",error:err,status})
   }
};

// delete an article
const deleteArticle=async(req,res)=>{
   try{

      const {articleId}=req.params;
  const article= await Articles.findOne({id:articleId});
    if(!article){

      res.status(404).json({message:`article with id '${articleId}' was not found`,status:404});
      return;
   }
  
   const {deleted_hashes}=await Articles.findByIdAndRemove([articleId]);
  
   res.status(200).json({message:`sucessfully deleted article with id ${deleted_hashes[0]}`,status:200});
}
catch(err){
   const status=err.status ||500;
   res.status(status).json({"message":"an error occurred","error":err,status});
}
   
};

const getArticleById=async(id)=>{
try{
const article=await Articles.findById([id]);
return [article,null];
}
catch(error){
   return [null,error];
}
   
}

module.exports={editArticle,deleteArticle,getArticleBySlug,getArticleById}
