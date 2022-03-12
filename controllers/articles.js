const Articles=require('../models/articles');
const Authors=require('../models/authors');
const slugify=require("slugify");

const shortId=require("shortid");



const getArticles=async(req,res)=>{
   try{

      const {limit=20,page=1}=req.query;
      const offset=(parseInt(limit) * parseInt(page)) - limit || 0;
      const articles=await Articles.find({getAttributes:["title","body","tags","publishedAt","modifiedAt","authorId","heroImage","id","category"],limit,offset});
      if(articles.length){
         let articleAuthorsId=articles.map(({authorId})=>authorId);   
         
         const authors=await Authors.findById({getAttributes:["fullname","twitter","linkedIn","id"],id:articleAuthorsId});
         const articlesWithAuthor=articles.map((article)=>{
            return {...article,'author':{...authors.reduce((accum,author)=>{ article.authorId==author.id ? accum=author:accum; return accum;},{})}}
               });


               res.status(200).json({"message":"Articles retrieved",status:200,data:articlesWithAuthor,result_count:articlesWithAuthor.length});
               return
            }
            res.status(200).json({"message":"No Articles"})
         }
         catch(err){
            res.status(400).json({"error":err})
         }
}
const getTags=async(req,res)=>{
const {limit=20,page=1}=req.query;
   const offset=(parseInt(limit) * parseInt(page)) - limit || 0;
   let allTags=await Articles.find({getAttributes:["tags"],limit,offset});
   allTags=[...allTags.reduce((accum,t)=>{t.tags !=null ? accum.push(t.tags):accum
   return accum;
   },[])]
res.status(200).json({"message":"Tags retrieved",status:200,"tags":allTags})
}
const getCategories=async(req,res)=>{
   const {limit=20,page=1}=req.query;
      const offset=(parseInt(limit) * parseInt(page)) - limit || 0;
      let categories=await Articles.find({getAttributes:["category"],limit,offset});
      categories=[...categories.reduce((accum,c)=>{c.category !=null ? accum.push(c.category):accum; return accum},[])]
   res.status(200).json({"message":"Categories retrieved",status:200,categories})
   }

   
const createNewArticle=async(req,res)=>{
   if(req.body && !Object.keys(req.body).length){
      res.status(400).json({"message":"Please include article to add",status:400})
      return;
   }

   const newArticle=req.body || {};
   const {title}=newArticle;
const slug=slugify(title,{lower:true,strict:true})+"-"+shortId();
   const {heroImage="https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"}=newArticle;
   newArticle['publishedAt']=new Date().toISOString();
   newArticle['modifiedAt']=newArticle['publishedAt'];
   newArticle["heroImage"]=heroImage;
newArticle["slug"]=slug;

   await Articles.create(newArticle);
   res.status(201).json({status:201,"message":"article successfully created","article":newArticle})
}
module.exports={getTags,getArticles,createNewArticle,getCategories}
