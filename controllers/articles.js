const Articles=require('../models/articles');
const Authors=require('../models/authors');

const getArticles=async(req,res)=>{
   const {limit=20,page=1}=req.query;
   const offset=(parseInt(limit) * parseInt(page)) -1 || 0;
   const articles=await Articles.find({getAttributes:["title","body","tags","publishedAt","modifiedAt","authorId"],limit,offset});
   let articleAuthorsId;
   if(articles){
   articleAuthorsId=articles.map(({authorId})=>authorId);   
   }
   const authors=await Authors.findById({getAttributes:["fullname","twitter","linkedIn"],id:articleAuthorsId});
   // const articlesWithAuthor=articles.map((article)=>{
      // return ({...article,article.authorIdauthor:{}}
   // ) })
   
}
const getTags=async(req,res)=>{
   const {limit=20,page=1}=req.query;
   const offset=(parseInt(limit) * parseInt(page)) -1 || 0;
   const tags=await Articles.find({getAttributes:["tags"],limit,offset});
   

}

const createNewArticle=async(req,res)=>{
   if(!req.body){
      res.status(400).json({"message":"Please include articles to add"})
      return;
   }
   const newArticle=req.body || {};
   newArticle['publishedAt']=new Date().toISOString();
   newArticle['modifiedAt']=newArticle['publishedAt'];
   
   await Articles.create(newArticle);
}
module.exports={getTags,getArticles,createNewArticle}
