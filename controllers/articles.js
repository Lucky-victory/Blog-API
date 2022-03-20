const Articles=require('../models/articles');
const Authors=require('../models/authors');
const slugify=require("slugify");
const asyncHandler=require('express-async-handler');
const {nester}=require("../helpers/utils");
const {Sqler}=require("harpee");
const shortId=require("shortid");



const getArticles=asyncHandler(async(req,res)=>{
   try{
const queryHandler=new Sqler();
      let {limit,page}=req.query;
      limit=parseInt(limit) ||20;
      page=parseInt(page) ||1;
   let offset=(limit * page - 1) || 0;
      //const articles=await Articles.find({getAttributes:["title","body","tags","publishedAt","modifiedAt","authorId","heroImage","id","category","slug","views"],limit,offset});
      const {record_count}=await Articles.describeModel();
      if((record_count - offset ) <= 0 || ((limit + offset) >=record_count)){
         res.status(200).json({"message":"No Articles","articles":null})
      return
      }
      const query=`SELECT a.id,a.publishedAt,a.title,a.authorId,a.body,a.views,a.slug,u.fullname as _fullname,u.id as _id,u.twitter as _twitter,u.linkedIn as _linkedin,u.bio as _bio,u.username as _username FROM ArticlesSchema.Articles as a INNER JOIN ArticlesSchema.Authors as u ON a.authorId=u.id WHERE a.published=true LIMIT ${limit} OFFSET ${offset} `
      let articles=await Articles.query(query);
      articles=nester(articles,["_fullname","_id","_bio","_twitter","_linkedin","_username"],{nestedTitle:"author"});

      if(articles.length){
         // get authorIds from articles
         let articleAuthorsId=articles.map(({authorId})=>authorId);  
 
         // use those authorId to find the article authors from Authors table
         //const authors=await Authors.findById({getAttributes:["fullname","twitter","linkedIn","id"],id:articleAuthorsId});

         // now join the authors with their respective articles
         /*const articlesWithAuthor=articles.map((article)=>{
            return {...article,'author':{...authors.reduce((accum,author)=>{ article.authorId==author.id ? accum=author:accum; return accum;},{})}}
               });*/

               res.status(200).json({"message":"Articles retrieved",status:200,"articles":articles,result_count:articles.length,page});
               return
            }
            res.status(200).json({"message":"No Articles","articles":null})
         }
         catch(err){
            const status=err.status ||500;
            res.status(status).json({"message":"an error occurred","error":err,status})
          }
});

// Get all article tags
const getTags= asyncHandler(async(req,res)=>{
   try{

      let {limit,page}=req.query;
      limit=parseInt(limit) ||20;
      page=parseInt(page) ||1;
   let offset=(limit * page - 1) || 0;
      // select article tags from Articles table, this returns an array of objects with tags props
      let allTags=await Articles.find({getAttributes:["tags"],limit,offset});
      
      // filter out null tags, and flatten the object into an array of strings
      allTags=[...allTags.reduce((accum,t)=>{t.tags !=null ? accum.push(t.tags):accum
         return accum;
      },[])]
      res.status(200).json({"message":"Tags retrieved",status:200,"tags":allTags})
   }
   catch(err){

      const status=err.status ||500;
   res.status(status).json({"message":"an error occurred","error":err,status})
   }
});

// Get all article categories
const getCategories=asyncHandler(async(req,res)=>{
   try{

      let {limit,page}=req.query;
      limit=parseInt(limit) ||20;
      page=parseInt(page) ||1;
   let offset=(limit * page - 1) || 0;
      let categories=await Articles.find({getAttributes:["category"],limit,offset});
      categories=[...categories.reduce((accum,c)=>{c.category !=null ? accum.push(c.category):accum; return accum},[])]
      res.status(200).json({"message":"Categories retrieved",status:200,categories})
   }
   catch(err){
      const status=err.status ||500;
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
      const {category,heroImage='https://images.pexels.com/photos/4458/cup-mug-desk-office.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',title,content,tags,published=false }=req.body;
      
      const slug=slugify(title,{lower:true,strict:true})+"-"+shortId();
      const createdAt=currentDate;
      const publishedAt=published? createdAt : null;
      const newArticle= {createdAt,publishedAt,title,content,tags,heroImage,slug,category,authorId,published};
      newArticle['modifiedAt']=createdAt;
      newArticle["views"]=0;
      
      await Articles.create(newArticle);
      res.status(201).json({status:201,"message":"article successfully created","article":newArticle})
   }
   catch(err){
      const status=err.status ||500;
   res.status(status).json({"message":"an error occurred","error":err,status})

   }
});
module.exports={getTags,getArticles,createNewArticle,getCategories}
