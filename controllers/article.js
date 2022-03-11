const Articles=require('../models/articles');


const getArticleBySlug=async (req,res)=>{
   const {slug}=req.params;
   if(!slug){
      res.status(400).json({"message":"No slug provided"});
      return
   }
    const article=await Articles.findOne({slug});
    if(!article){
   res.status(404).json({"message":"articles with slug "+slug+" was not found"});
   return  ;  
    }
    res.status(200).json(article)
}
const editArticle=async(req,res)=>{
  const {articleId}=req.params;
  if(!articleId){
     res.status(400).json({"message":"No article id provided"});
     return
  }
   const articleToUpdate=req.body || {};
   articleToUpdate["id"]=articleId;
   const updateInfo=await Articles.update(articleToUpdate);
   res.status(200).json({"message":"sucessfully updated article with id "+articleId,updateInfo})
}
const deleteArticle=async(req,res)=>{
   const {articleId}=req.params;
  if(!articleId){
     res.status(400).json({"message":"No article id provided"});
     return
  }
    

   const updateInfo=await Articles.findByIdAndRemove([articleId]);
   res.status(200).json({"message":"sucessfully deleted article with id "+articleId,updateInfo});
   
}

module.exports={editArticle,deleteArticle,getArticleBySlug}