'use strict';
const Articles=require('../models/articles');
const Comments=require('../models/comments');
const Replies=require('../models/replies');

const asyncHandler=require('express-async-handler');
const {Nester,ArrayBinder,GenerateSlug,CalculateReadTime, StringToArray, NullOrUndefined, NotNullOrUndefined, isEmpty, ObjectArrayToStringArray, AddPropsToObject}=require("../helpers/utils");
const {Converter}=require("showdown");
const converter=new Converter();
const {encode,decode}=require("html-entities");
const { ARTICLES_SQL_QUERY } = require('../constants');
const ArticleTags = require('../models/articleTags');
const Tags = require('../models/tags');


const getPublishedArticles=asyncHandler(async(req,res)=>{
   try{
      let {page,category,sort='publishedAt|desc'}=req.query;
      const orderBy=StringToArray(sort,'|')[0];
      const order=StringToArray(sort,'|')[1] ||'desc';
    const  limit=20;
      page=parseInt(page) ||1;
   let offset=(limit * (page - 1)) ||0;
   const recordCountQuery=`SELECT count(id) as recordCount FROM BlogSchema.Articles WHERE published=true ${!NullOrUndefined(category) ? ` AND category='${category}'`:''} `;
  const recordCountResult=await Articles.query(recordCountQuery);
  const {recordCount}=recordCountResult[0];
      if((recordCount - offset ) <= 0 || (offset > recordCount)){
         res.status(200).json({message:"No more Articles","articles":[]});
      return
      }
      const articlesQuery=`${ARTICLES_SQL_QUERY} ${!NullOrUndefined(category) ? ` AND category='${category}'`:''} ORDER BY a.${orderBy} ${order} LIMIT ${limit} OFFSET ${offset} `;

      let articles=await Articles.query(articlesQuery);
      // nest author info as author property
      articles=Nester(articles,["_fullname","_id","_bio","_twitter","_linkedin","_username","_profileImage"],{nestedTitle:"author"});

  
// get article ids to query comments table;
const articlesId=articles.map((article)=>article.id);
 
let tagIds=await ArticleTags.query(`SELECT tagId FROM BlogSchema.ArticleTags WHERE postId IN("${articlesId.join('","')}")`);
tagIds=ObjectArrayToStringArray(tagIds);

let tags= await Tags.query(`SELECT text,id FROM BlogSchema.Tags WHERE id IN("${tagIds.join('","')}")`);
console.log(tags);
let r=tagIds.reduce((acc,a,i)=>{
 if(a ==tags[i].i){
acc.push(tags[i])
 }
 return acc
},[]);
console.log(r);
    // decode html entities
    articles=articles.map((article)=>{
      article.title=decode(article.title);
      article.content=decode(article.content);
      article.intro=decode(article.intro);
      article.author.bio=decode(article.author.bio);
      
     return article;
     });
let comments= await Comments.query(`SELECT id,text,postId,userId,createdAt FROM BlogSchema.Comments WHERE postId IN ("${articlesId.join('","')}") ORDER BY createdAt DESC`);
// get comment ids to query replies table;
const commentsId=comments.map((comment)=>comment.id);

let replies=await Replies.query(`SELECT id,text,commentId,userId,createdAt FROM BlogSchema.Replies WHERE commentId IN ("${commentsId.join('","')}") ORDER BY createdAt DESC`);
// combine comments with replies based on their related id
comments=ArrayBinder(comments,replies,{
   innerProp:"commentId",outerProp:"id",innerTitle:"replies"
});
// combine Articles with Comments based on their related id
articles=ArrayBinder(articles,comments,{
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
   let {category,heroImage='https://images.pexels.com/photos/4458/cup-mug-desk-office.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',tags,published=false,title,content,intro }=req.body;
      
if(!(title || content)){
res.status(400).json({message:"provide at least `title` or `content` "});
return
}
title=encode(title);
content= converter.makeHtml(content);
content=encode(content);
intro=converter.makeHtml(intro);
intro=encode(intro);
const currentDate=new Date().toISOString();  
const createdAt=currentDate;
const slug= GenerateSlug(title);
const authorId=req.userId;
const totalWords= String(NotNullOrUndefined(title) + NotNullOrUndefined(content)) ||'';
      const {readTime}=CalculateReadTime(totalWords)
      const publishedAt=published? createdAt : null;
      const newArticle= {createdAt,publishedAt,title,content,tags,heroImage,slug,category,authorId,published,modifiedAt:createdAt,views:0,readTime,intro};
      
      
      
     const {inserted_hashes}=await Articles.create(newArticle);
      res.status(201).json({status:201,message:"article successfully created","article":{id:inserted_hashes[0],...newArticle}})
   }
   catch(error){
      const status=error.status ||500;
   res.status(status).json({message:"an error occurred",error,status})

   }
});
module.exports={getPublishedArticles,createNewArticle}
