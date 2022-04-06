
const Articles=require('../models/articles');
const Authors=require("../models/authors");
const asyncHandler=require('express-async-handler');
const { StringToArray, generateSlug, NullOrUndefined, isEmpty } = require('../helpers/utils');
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
const {title,content,publishedAt,modifiedAt,slug,heroImage,id,authorId,category,views,readTime}=article;
let {tags,body}=article;
body=decode(body);
tags= StringToArray(tags);
const {fullname,twitter,linkedIn,bio,profileImage,username}=await Authors.findOne({"id":authorId});

const newViewsCount=parseInt(views)+1 || 1;
 await Articles.update([{id,'views':newViewsCount}]);
res.status(200).json({title,content,slug,views,publishedAt,modifiedAt,tags,heroImage,id,category,body,author:{fullname,twitter,linkedIn,profileImage,bio,username,readTime}});

}
catch(err){
   const status=err.status ||500;
   res.status(status).json({message:"an error occurred",error:err,status})
}
});

// edit article
const editArticle=asyncHandler (async(req,res)=>{
   try{

      const {articleId}=req.params;
      if(!articleId){
         res.status(400).json({message:"No article id provided",status:400});
         return
      }
      if(isEmpty(req.body)){
         res.status(400).json({message:"Nothing to update, body not provided",status:400});
         return 
      }
      const {title,updateSlug}=req.body;
      const articleToUpdate=req.body || {};
      if(title && updateSlug){
         articleToUpdate["slug"]=generateSlug(title);
         
      }
      !NullOrUndefined(updateSlug) ? delete articleToUpdate["updateSlug"] :"";
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
   const status=err.status ||400;
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