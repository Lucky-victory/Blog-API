const shortid = require('shortid');
const Articles=require('../models/articles');
const Authors=require("../models/authors");
const slugify=require("slugify");


const getArticleBySlug=async (req,res)=>{
   const urlSlug=req.params.slug;
   if(!urlSlug){
      res.status(400).json({"message":"No slug provided"});
      return
   }
    const article=await Articles.findOne({"slug":urlSlug});
    if(!article){
   res.status(404).json({"message":"article with slug '"+urlSlug+"' was not found"});
   return  ;  
    }
    const {title,body,publishedAt,modifiedAt,slug,tags,heroImage,id,authorId}=article;
    const {fullname,twitter,linkedIn}=await Authors.findOne({"id":authorId});
    res.status(200).json({title,body,slug,publishedAt,modifiedAt,tags,heroImage,id,author:{fullname,twitter,linkedIn}})
}
const editArticle=async(req,res)=>{
  const {articleId}=req.params;
  if(!articleId){
     res.status(400).json({"message":"No article id provided","status":400});
     return
  }
  if(req.body && !Object.keys(req.body).length){
res.status(200).json({"message":"Nothing to update","status":200});
   return 
  }
  const {title,updateSlug}=req.body;
  const articleToUpdate=req.body || {};
  if(title && updateSlug){
articleToUpdate["slug"]=slugify(title,{lower:true,strict:true})+"-"+shortid();

  }
  articleToUpdate["updateSlug"] != null || undefined ? delete articleToUpdate["updateSlug"] :"";
   articleToUpdate["id"]=articleId;
   articleToUpdate["modifiedAt"]=new Date().toISOString();
   const updateInfo=await Articles.update([articleToUpdate]);
   res.status(200).json({"status":200,"message":"sucessfully updated article with id "+articleId,updateInfo})
}
const deleteArticle=async(req,res)=>{
   const {articleId}=req.params;
  if(!articleId){
     res.status(400).json({"message":"No article id provided"});
     return
  }
    

   const deletionInfo=await Articles.findByIdAndRemove([articleId]);
   res.status(200).json({"message":"sucessfully deleted article with id "+articleId,deletionInfo,"status":200});
   
}

module.exports={editArticle,deleteArticle,getArticleBySlug}