const asyncHandler=require('express-async-handler');
const {Nester,NullOrUndefined,StringToArray, NotNullOrUndefined}=require('../helpers/utils');
const {decode}=require('html-entities');
const Articles=require('../models/articles');
const { ARTICLES_SQL_QUERY } = require('../constants');
// Get all article categories
const getCategories=asyncHandler(async(req,res)=>{
    try{
 
       let {page}=req.query;
       const limit=20;
       page=parseInt(page) ||1;
    let offset=(limit * (page - 1)) || 0;
       let categories=await Articles.query(`SELECT DISTINCT category FROM BlogSchema.Articles ${limit} ${offset}`);
       categories=[...categories.reduce((accum,c)=>{!NullOrUndefined(c.category) ? accum.push(c.category):accum; return accum},[])]
       res.status(200).json({message:"Categories retrieved",status:200,categories})
    }
    catch(error){
       const status=error.status ||500;
       res.status(status).json({message:"an error occurred",error,status})
    }
    });
 const getArticlesByCategory=asyncHandler(async(req,res)=>{
     try{
        let {page,sort='publishedAt|desc'}=req.query;
        const {category}=req.params;
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
  
        // decode html entities
   articles=articles.map((article)=>{
   article.title=decode(article.title);
   article.content=decode(article.content);
   article.intro=decode(article.intro);
    article.author.bio=decode(article.author.bio);
  return article;
  });
  if(!articles.length){
    res.status(200).json({message:"No Articles","articles":[]})
    return
 }
 res.status(200).json({message:"Articles retrieved",status:200,articles,resultCount:recordCount});
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
