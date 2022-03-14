const Articles=require('../models/articles');
const Authors=require('../models/authors');
const slugify=require("slugify");
const asyncHandler=require('express-async-handler');
const shortId=require("shortid");



const getArticles=asyncHandler(async(req,res)=>{
   try{

      const {limit=20,page=1}=req.query;
      const offset=(parseInt(limit) * parseInt(page)) - limit || 0;
      const articles=await Articles.find({getAttributes:["title","body","tags","publishedAt","modifiedAt","authorId","heroImage","id","category","slug","views"],limit,offset});
      if(articles.length){
         // get authorIds from articles
         let articleAuthorsId=articles.map(({authorId})=>authorId);  
 
         // use those authorId to find the article authors from Authors table
         const authors=await Authors.findById({getAttributes:["fullname","twitter","linkedIn","id"],id:articleAuthorsId});

         // now join the authors with their respective articles
         const articlesWithAuthor=articles.map((article)=>{
            return {...article,'author':{...authors.reduce((accum,author)=>{ article.authorId==author.id ? accum=author:accum; return accum;},{})}}
               });

               res.status(200).json({"message":"Articles retrieved",status:200,"articles":articlesWithAuthor,result_count:articlesWithAuthor.length,page});
               return
            }
            res.status(200).json({"message":"No Articles","articles":null})
         }
         catch(err){
            const status=err.status ||400;
            res.status(status).json({"message":"an error occurred","error":err,status})
          }
});

// Get all article tags
const getTags= asyncHandler(async(req,res)=>{
   try{

      const {limit=20,page=1}=req.query;
      const offset=(parseInt(limit) * parseInt(page)) - limit || 0;
      // select article tags from Articles table, this returns an array of objects with tags props
      let allTags=await Articles.find({getAttributes:["tags"],limit,offset});
      
      // filter out null tags, and flatten the object into an array of strings
      allTags=[...allTags.reduce((accum,t)=>{t.tags !=null ? accum.push(t.tags):accum
         return accum;
      },[])]
      res.status(200).json({"message":"Tags retrieved",status:200,"tags":allTags})
   }
   catch(err){

      const status=err.status ||400;
   res.status(status).json({"message":"an error occurred","error":err,status})
   }
});

// Get all article categories
const getCategories=asyncHandler(async(req,res)=>{
   try{

      const {limit=20,page=1}=req.query;
      const offset=(parseInt(limit) * parseInt(page)) - limit || 0;
      let categories=await Articles.find({getAttributes:["category"],limit,offset});
      categories=[...categories.reduce((accum,c)=>{c.category !=null ? accum.push(c.category):accum; return accum},[])]
      res.status(200).json({"message":"Categories retrieved",status:200,categories})
   }
   catch(err){
      const status=err.status ||400;
      res.status(status).json({"message":"an error occurred","error":err,status})
   }
   });

   // Add new article
const createNewArticle=asyncHandler( async(req,res)=>{
   try{

      if(req.body && !Object.keys(req.body).length){
         res.status(400).json({"message":"Please include article to add",status:400})
         return;
      }
      const currentDate=new Date().toISOString();
      const {publishedAt=currentDate,category,heroImage='https://images.pexels.com/photos/4458/cup-mug-desk-office.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',title,content,tags }=req.body;
      const slug=slugify(title,{lower:true,strict:true})+"-"+shortId();
      const newArticle= {publishedAt,title,content,tags,heroImage,slug,category,authorId};
      newArticle['modifiedAt']=publishedAt;
      newArticle["views"]=0;
      
      await Articles.create(newArticle);
      res.status(201).json({status:201,"message":"article successfully created","article":newArticle})
   }
   catch(err){
      const status=err.status ||400;
   res.status(status).json({"message":"an error occurred","error":err,status})

   }
});
module.exports={getTags,getArticles,createNewArticle,getCategories}
