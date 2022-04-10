const asyncHandler=require('express-async-handler');
const {NullOrUndefined,StringToArray,nester}=require('../helpers/utils');
const Articles=require('../models/articles');
const {decode}=require('html-entities');
const { ARTICLES_SQL_QUERY } = require('../constants');
// Get all article tags
const getAllTags= asyncHandler(async(req,res)=>{
    try{

       let {page}=req.query;
       const limit=20;
       page=parseInt(page) ||1;
    let offset=(limit * (page - 1)) || 0;
       // select article tags from Articles table, this returns an array of objects with tags props
       let allTags=await Articles.query(`SELECT DISTINCT tags FROM BlogSchema.Articles ${limit} ${offset}`);
       
       // filter out null tags, and flatten the object into an array of strings
       allTags=[...allTags.reduce((accum,t)=>{!NullOrUndefined(t.tags) ? accum.push(t.tags):accum
          return accum;
       },[])]
       res.status(200).json({message:"Tags retrieved",status:200,"tags":allTags})
    }
    catch(error){
 
       const status=error.status ||500;
    res.status(status).json({message:"an error occurred",error,status})
    }
 });
 
 const getArticlesByTag=asyncHandler(async(req,res)=>{
     try{
        let {page,sort='publishedAt|desc'}=req.query;
        let {tag}=req.params;
        tag=StringToArray(tag);
        const orderBy=StringToArray(sort,'|')[0];
        const order=StringToArray(sort,'|')[1] ||'desc';
      const  limit=20;
        page=parseInt(page) ||1;
     let offset=(limit * (page - 1)) ||0;
  const recordCountQuery=`SELECT count(id) as recordCount FROM BlogSchema.Articles WHERE published=true ${!NullOrUndefined(tag) ? ` AND tags LIKE("${tag.join('","')}")`:''} `;
  
  const recordCountResult=await Articles.query(recordCountQuery);
  const {recordCount}=recordCountResult[0];
        if((recordCount - offset ) <= 0 || (offset > recordCount)){
  res.status(200).json({message:"No Articles","articles":[]});
      return
        }
<<<<<<< HEAD
        const articlesQuery=`${ARTICLES_SQL_QUERY} ${!NullOrUndefined(tag) ? ` AND tags LIKE("${tag.join('","')}")`:''}  ORDER BY a.${orderBy} ${order} LIMIT ${limit} OFFSET ${offset} `;
         
 let articles=await Articles.query(articlesQuery);

articles=nester(articles,["_fullname","_id","_bio","_twitter","_linkedin","_username","_profileImage"],{nestedTitle:"author"});
  
        // decode html entities
   articles=articles.map((article)=>{
   article.title=decode(article.title);
   article.content=decode(article.content);
   article.intro=decode(article.intro);
    article.author.bio=decode(article.author.bio);
   article.tags=StringToArray(article.tags)
  return article;
  });
  if(!articles.length){
    res.status(200).json({message:"No Articles","articles":[]})
    return
 }
 res.status(200).json({message:"Articles retrieved",status:200,articles,resultCount:recordCount});
     }
     catch(error){
         const status=error.status||500;
         res.status(status).json({message:"an error occurred",status,error})
     }
 })
module.exports={getAllTags,getArticlesByTag}