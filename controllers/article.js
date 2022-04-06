const shortid = require('shortid');
const Articles=require('../models/articles');
const Authors=require("../models/authors");
const slugify=require("slugify");
const asyncHandler=require('express-async-handler');
const { StringToArray } = require('../helpers/utils');

// get a single article
const getArticleBySlug= asyncHandler (async (req,res)=>{
   try{

      const urlSlug=req.params.slug;
      if(!urlSlug){
         res.status(400).json({"message":"No slug provided",status:400});
         return
      }
      const article=await Articles.findOne({"slug":urlSlug});
      if(!article){
         res.status(404).json({"message":"article with slug '"+urlSlug+"' was not found",status:404});
   return  ;  
}
const {title,content,body,publishedAt,modifiedAt,slug,heroImage,id,authorId,category,views}=article;
let {tags}=article;
tags= StringToArray(tags);
const {fullname,twitter,linkedIn,bio,profileImage,username}=await Authors.findOne({"id":authorId});

const newViewsCount=parseInt(views)+1 || 1;
 await Articles.update([{id,'views':newViewsCount}]);
res.status(200).json({title,content,slug,views,publishedAt,modifiedAt,tags,heroImage,id,category,author:{fullname,twitter,linkedIn,profileImage,bio,username,body}});

}
catch(err){
   const status=err.status ||400;
   res.status(status).json({"message":"an error occurred","error":err,status})
}
});

// edit article
const editArticle=asyncHandler (async(req,res)=>{
   try{

      const {articleId}=req.params;
      if(!articleId){
         res.status(400).json({"message":"No article id provided","status":400});
         return
      }
      if(req.body && !Object.keys(req.body).length){
         res.status(400).json({"message":"Nothing to update, body not provided","status":400});
         return 
      }
      const {title,updateSlug}=req.body;
      const articleToUpdate=req.body || {};
      if(title && updateSlug){
         articleToUpdate["slug"]=slugify(title,{lower:true,strict:true})+"-"+shortid();
         
      }
      updateSlug != null || updateSlug != undefined ? delete articleToUpdate["updateSlug"] :"";
      articleToUpdate["id"]=articleId;
      articleToUpdate["modifiedAt"]=new Date().toISOString();
      await Articles.update([articleToUpdate]);
      res.status(200).json({"status":200,"message":"sucessfully updated article with id "+articleId})
   }
   catch(err){
      const status=err.status ||400;
      res.status(status).json({"message":"an error occurred","error":err,status})
   }
});

// delete an article
const deleteArticle=asyncHandler(async(req,res)=>{
   try{

      const {articleId}=req.params;
      if(!articleId){
     res.status(400).json({"message":"No article id provided"});
     return
   }
   
   
   await Articles.findByIdAndRemove([articleId]);
   res.status(200).json({"message":"sucessfully deleted article with id "+articleId,"status":200});
}
catch(err){
   const status=err.status ||400;
   res.status(status).json({"message":"an error occurred","error":err,status});
}
   
});

module.exports={editArticle,deleteArticle,getArticleBySlug}