'use strict';
const Articles=require('../models/articles.model');
const Comments=require('../models/comments.model');
const asyncHandler=require('express-async-handler');
const {Nester,GenerateSlug,CalculateReadTime, StringToArray, NullOrUndefined, NotNullOrUndefined, isEmpty,  AddPropsToObject, StringArrayToObjectArray,MergeArrays,GetIdOfDuplicateTags,RemoveDuplicateTags, GetLocalTime, isLongerThan,shortenArray}=require("../helpers/utils");
const {Converter}=require("showdown");
const converter=new Converter();
const {encode,decode}=require("html-entities");
const { ARTICLES_SQL_QUERY,ACCEPTABLE_SORT_NAMES,SORT_LISTS, MAX_ARTICLE_TAGS} = require('../constants');
const ArticleTags = require('../models/article-tags.model');
const Tags = require('../models/tags.model');


const getPublishedArticles=async(req,res)=>{
   try{
      let {page,category,sort,limit}=req.query;
      if(ACCEPTABLE_SORT_NAMES.indexOf(sort) !== -1){
         sort=SORT_LISTS[sort];
          }
          else{
             sort=SORT_LISTS[ACCEPTABLE_SORT_NAMES[0]];
          }

          const orderBy=StringToArray(sort,'|')[0];
          const order=StringToArray(sort,'|')[1];
      limit=parseInt(limit) || 20;
      page=parseInt(page) ||1;
   let offset=(limit * (page - 1)) ||0;
   const recordCountQuery=`SELECT count(pid) as recordCount FROM BlogSchema2.Articles WHERE status='published' ${!NullOrUndefined(category) ? ` AND category='${category}'`:''} `;
  const recordCountResult=await Articles.query(recordCountQuery);
  const {recordCount}=recordCountResult[0];
      if((recordCount - offset ) <= 0 || (offset > recordCount)){
         res.status(200).json({message:"No more Articles","articles":[]});
      return
      }
      const articlesQuery=`${ARTICLES_SQL_QUERY} ${!NullOrUndefined(category) ? ` AND category='${category}'`:''} ORDER BY a.${orderBy} ${order} LIMIT ${limit} OFFSET ${offset} `;

      let articles=await Articles.query(articlesQuery);
      // nest author info as author property
      articles=Nester(articles,["_fullname","_id","_bio","_twitter","_linkedIn","_username","_profileImage"],{nestedTitle:"author"});

  
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

const comments= await Comments.query(`SELECT count(cid) as commentsCount,postId FROM BlogSchema2.Comments WHERE postId IN ("${articlesId.join('","')}") GROUP BY postId`);

for(let article of articles){
for(let comment of comments){
if(article.id !==comment.postId){
   article['commentsCount']=0;
   
   
}
   else{
   article['commentsCount']=comment.commentsCount;
}

}
}
if(!articles.length){
         res.status(200).json({message:"No Articles","articles":[]})
         return
      }
      res.status(200).json({message:"Articles retrieved",status:200,articles,resultCount:articles.length});
         }
         catch(error){
            const status=error.status ||500;
            res.status(status).json({message:"an error occurred",error,status})
          }
};



   // Add new article
const createNewArticle= async(req,res)=>{
   try{

      
      if(isEmpty(req.body)){
         res.status(400).json({message:"Please include article to add",status:400})
         return;
      }
   let {category,heroImage='https://images.pexels.com/photos/4458/cup-mug-desk-office.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',status='draft',title,content,intro,tags}=req.body;
  

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
 const publishedAt=status=='published'? createdAt : null;
 const newArticle= {createdAt,publishedAt,title,content,heroImage,slug,category,authorId,modifiedAt:createdAt,views:0,readTime,intro,status};
      
 // If Tags are more than {MAX_ARTICLE TAGS}, remove the extras
      tags = isLongerThan(tags, MAX_ARTICLE_TAGS) ? shortenArray(tags, MAX_ARTICLE_TAGS) : tags;
     // get tags from database to see if they already exist
     const tagsExist=await Tags.find({getAttributes:["tid as id","text"],where:`text IN("${tags.join('","')}")`});
     let remainingTags=tags;
     let duplicateTagsId;
     if(tagsExist.length){
        duplicateTagsId=GetIdOfDuplicateTags(tagsExist,tags);
        remainingTags=RemoveDuplicateTags(tagsExist,tags);
      }
      let tagsAsObj=StringArrayToObjectArray(remainingTags);
      tagsAsObj=AddPropsToObject(tagsAsObj,[{createdAt}]);
      
      const {inserted_hashes:insertedArticleId}=await Articles.create(newArticle);
      let {inserted_hashes:insertedTagsId}=await Tags.createMany(tagsAsObj);
      let mergedTagIds=MergeArrays(insertedTagsId,duplicateTagsId);
      mergedTagIds=StringArrayToObjectArray(mergedTagIds,'tagId');
      const tagIdsWithArticleId=AddPropsToObject(mergedTagIds,[{postId:insertedArticleId[0],createdAt}])
      await ArticleTags.createMany(tagIdsWithArticleId)

      res.status(201).json({status:201,message:"article successfully created","article":{id:insertedArticleId[0],...newArticle}})
   }
   catch(error){
      const status=error.status ||500;
   res.status(status).json({message:"an error occurred, couldn't create new article",error,status})

   }
};
module.exports={getPublishedArticles,createNewArticle}
