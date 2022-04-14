'use strict';
const Articles=require('../models/articles');
const Comments=require('../models/comments');
const Replies=require('../models/replies');

const asyncHandler=require('express-async-handler');
const {Nester,ArrayBinder,GenerateSlug,CalculateReadTime, StringToArray, NullOrUndefined, NotNullOrUndefined, isEmpty, ObjectArrayToStringArray, AddPropsToObject, StringArrayToObjectArray,MergeArrays,GetIdOfDuplicateTags,RemoveDuplicateTags, GetLocalTime}=require("../helpers/utils");
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
    // decode html entities
    articles=articles.map((article)=>{
      article.title=decode(article.title);
      article.content=decode(article.content);
      !NullOrUndefined(article.intro) ? article.intro=decode(article.intro) : '';
      !NullOrUndefined(article.author && article.author.bio) ? article.author.bio=decode(article.author.bio) : '';      
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
const currentDate=GetLocalTime();  
const createdAt=currentDate;
const slug= GenerateSlug(title);
const authorId=req.userId;
const totalWords= String(NotNullOrUndefined(title) + NotNullOrUndefined(content)) ||'';
const {readTime}=CalculateReadTime(totalWords)
 const publishedAt=published? createdAt : null;
 const newArticle= {createdAt,publishedAt,title,content,heroImage,slug,category,authorId,published,modifiedAt:createdAt,views:0,readTime,intro};
      
     // try getting tags from database to see if they exist
     const tagsExist=await Tags.find({getAttributes:["id","text"],where:`text IN("${tags.join('","')}")`});
     let remainingTags=tags;
     let duplicateTagsId;
     if(tagsExist.length){
        duplicateTagsId=GetIdOfDuplicateTags(tagsExist,tags);
        remainingTags=RemoveDuplicateTags(tagsExist,tags);
      }
      let tagsAsObj=StringArrayToObjectArray(remainingTags);
      tagsAsObj=AddPropsToObject(tagsAsObj,{createdAt});
      
      const {inserted_hashes:insertedArticleId}=await Articles.create(newArticle);
      let {inserted_hashes:insertedTagsId}=await Tags.createMany(tagsAsObj);
      let mergedTagIds=MergeArrays(insertedTagsId,duplicateTagsId);
      mergedTagIds=StringArrayToObjectArray(mergedTagIds,'tagId');
      const tagIdsWithArticleId=AddPropsToObject(mergedTagIds,{postId:insertedArticleId[0],createdAt})
      await ArticleTags.createMany(tagIdsWithArticleId)

      res.status(201).json({status:201,message:"article successfully created","article":{id:insertedArticleId[0],...newArticle}})
   }
   catch(error){
      const status=error.status ||500;
   res.status(status).json({message:"an error occurred, couldn't create new article",error,status})

   }
});
module.exports={getPublishedArticles,createNewArticle}
