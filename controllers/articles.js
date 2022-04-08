'use strict';
const Articles=require('../models/articles');
const Comments=require('../models/comments');
const Replies=require('../models/replies');

const asyncHandler=require('express-async-handler');
const {nester,arrayBinder,generateSlug,calculateReadTime, StringToArray, NullOrUndefined, NotNullOrUndefined, isEmpty}=require("../helpers/utils");
const {Sqler}=require("harpee");
const {Converter}=require("showdown");
const converter=new Converter();
const {encode,decode}=require("html-entities");


const getPublishedArticles=asyncHandler(async(req,res)=>{
   try{
      let {page,category,sort='publishedAt|desc'}=req.query;
      const orderBy=StringToArray(sort,'|')[0];
      const order=StringToArray(sort,'|')[1] ||'desc';
    const  limit=20;
      page=parseInt(page) ||1;
   let offset=(limit * (page - 1)) ||0;
   const recordCountQuery=`SELECT count(id) as recordCount FROM ArticlesSchema.Articles WHERE published=true ${!NullOrUndefined(category) ? ` AND category='${category}'`:''} `;
  const recordCountResult=await Articles.query(recordCountQuery);
  const {recordCount}=recordCountResult[0];
      if((recordCount - offset ) <= 0 || (offset > recordCount)){
         res.status(200).json({message:"No more Articles","articles":[]});
      return
      }
      const articlesQuery=`SELECT a.id,a.publishedAt,a.title,a.authorId,a.intro,a.views,a.heroImage,a.slug,a.tags,a.category,a.content,a.readTime,a.modifiedAt,u.fullname as _fullname,u.id as _id,u.twitter as _twitter,u.linkedIn as _linkedin,u.bio as _bio,u.username as _username,u.profileImage as _profileImage FROM ArticlesSchema.Articles as a INNER JOIN ArticlesSchema.Authors as u ON a.authorId=u.id WHERE a.published=true ${!NullOrUndefined(category) ? ` AND category='${category}'`:''} ORDER BY a.${orderBy} ${order} LIMIT ${limit} OFFSET ${offset} `;

      let articles=await Articles.query(articlesQuery);
      // nest author info as author property
      articles=nester(articles,["_fullname","_id","_bio","_twitter","_linkedin","_username","_profileImage"],{nestedTitle:"author"});

      // decode html entities
 articles=articles.map((article)=>{
 article.title=decode(article.title);
 article.content=decode(article.content);
 article.author.bio=decode(article.author.bio);
 article.tags=StringToArray(article.tags)
return article;
});
// get article ids to query comments table;
const articlesId=articles.map((article)=>article.id);
let comments= await Comments.query(`SELECT id,text,postId,userId,createdAt FROM ArticlesSchema.Comments WHERE postId IN ("${articlesId.join('","')}") ORDER BY createdAt DESC`);
// get comment ids to query replies table;
const commentsId=comments.map((comment)=>comment.id);

let replies=await Replies.query(`SELECT id,text,commentId,userId,createdAt FROM ArticlesSchema.Replies WHERE commentId IN ("${commentsId.join('","')}") ORDER BY createdAt DESC`);
// combine comments with replies based on their related id
comments=arrayBinder(comments,replies,{
   innerProp:"commentId",outerProp:"id",innerTitle:"replies"
});
// combine Articles with Comments based on their related id
articles=arrayBinder(articles,comments,{
   outerProp:"id",innerProp:"postId",innerTitle:"comments"
});

if(!articles.length){
         res.status(200).json({message:"No Articles","articles":[]})
         return
      }
      res.status(200).json({message:"Articles retrieved",status:200,articles,resultCount:recordCount});
         }
         catch(error){
            const status=error.status ||500;
            res.status(status).json({message:"an error occurred",error,status})
          }
});



   // Add new article
const createNewArticle=asyncHandler( async(req,res)=>{
   try{

      if(!req.isAuthenticated) return res.status(403).json({message:'Unathorized, you cant add an article',status:403});

      if(isEmpty(req.body)){
         res.status(400).json({message:"Please include article to add",status:400})
         return;
      }
   let {category,heroImage='https://images.pexels.com/photos/4458/cup-mug-desk-office.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',tags,published=false,title,content }=req.body;
      
if(!(title || content)){
res.status(400).json({message:"provide at least `title` or `content` "});
return
}
title=encode(title);
content= converter.makeHtml(content);
content=encode(content);
const currentDate=new Date().toISOString();  
const createdAt=currentDate;
const slug= generateSlug(title);
const authorId=req.userId;
const totalWords= String(NotNullOrUndefined(title) + NotNullOrUndefined(content)) ||'';
      const {readTime}=calculateReadTime(totalWords)
      const publishedAt=published? createdAt : null;
      const newArticle= {createdAt,publishedAt,title,content,tags,heroImage,slug,category,authorId,published,modifiedAt:createdAt,views:0,readTime};
      
      
      
     const {inserted_hashes}=await Articles.create(newArticle);
      res.status(201).json({status:201,message:"article successfully created","article":{id:inserted_hashes[0],...newArticle}})
   }
   catch(error){
      const status=error.status ||500;
   res.status(status).json({message:"an error occurred",error,status})

   }
});
module.exports={getPublishedArticles,createNewArticle}
