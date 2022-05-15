const asyncHandler=require('express-async-handler');
const {Nester,StringToArray, ObjectArrayToStringArray}=require('../helpers/utils');
const {decode}=require('html-entities');
const Articles=require('../models/articles.model');
const { ARTICLES_SQL_QUERY,ACCEPTABLE_SORT_NAMES,SORT_LISTS } = require('../constants');
// Get all article categories
const getCategories=asyncHandler(async(req,res)=>{
    try{
 
       let {page}=req.query;
       const limit=20;
       page=parseInt(page) ||1;
    let offset=(limit * (page - 1)) || 0;
       let categories=await Articles.query(`SELECT DISTINCT category FROM BlogSchema.Articles ${limit} ${offset} WHERE published=true`);
       categories=ObjectArrayToStringArray(categories);
       res.status(200).json({message:"Categories retrieved",status:200,categories})
    }
    catch(error){
       const status=error.status ||500;
       res.status(status).json({message:"an error occurred",error,status})
    }
    });
 const getArticlesByCategory=asyncHandler(async(req,res)=>{
     try{
        let {page,sort}=req.query;
        const {category}=req.params;
        if(ACCEPTABLE_SORT_NAMES.indexOf(sort) !== -1){
         sort=SORT_LISTS[sort];
          }
          else{
             sort=SORT_LISTS[ACCEPTABLE_SORT_NAMES[0]];
          }
          const orderBy=StringToArray(sort,'|')[0];
          const order=StringToArray(sort,'|')[1];
      const  limit=20;
        page=parseInt(page) ||1;
     let offset=(limit * (page - 1)) ||0;
  const recordCountQuery=`SELECT count(id) as recordCount FROM BlogSchema.Articles WHERE published=true  AND category='${category}' `;
  const recordCountResult=await Articles.query(recordCountQuery);
   const {recordCount}=recordCountResult[0];
        if((recordCount - offset ) <= 0 || (offset > recordCount)){
           res.status(200).json({message:"No more Articles","articles":[]});
        return
        }
        const articlesQuery=`${ARTICLES_SQL_QUERY}   AND category='${category}' ORDER BY a.${orderBy} ${order} LIMIT ${limit} OFFSET ${offset} `;
  
        let articles=await Articles.query(articlesQuery);
        // nest author info as author property
        articles=Nester(articles,["_fullname","_id","_bio","_twitter","_linkedIn","_username","_profileImage"],{nestedTitle:"author"});
  
        // decode html entities
   articles=articles.map((article)=>{
   article.title=decode(article.title);
   article.content=decode(article.content);
   article.intro=decode(article.intro);
   article.author.bio= article?.author?.bio ? decode(article.author.bio) : null;
  return article;
  });
  if(!articles.length){
    res.status(200).json({message:"No Articles","articles":[]})
    return
 }
 res.status(200).json({message:"Articles retrieved",status:200,articles,resultCount:articles.length});
    }
     catch(error){
         const status=error.status ||500;
         res.status(status).json({message:"an error occurred",status,error})
     }
 })
module.exports={
    getCategories,
    getArticlesByCategory
} 
