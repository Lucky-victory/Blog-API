
const {StringToArray,Nester, ObjectArrayToStringArray}=require('../helpers/utils');
const Articles=require('../models/articles.model');
const {decode}=require('html-entities');
const { ARTICLES_SQL_QUERY ,ACCEPTABLE_SORT_NAMES,SORT_LISTS} = require('../constants');
const Tags = require('../models/tags.model');
const ArticleTags = require('../models/articleTags.model');

// Get all article tags
const getAllTags= async(req,res)=>{
    try{
       let {page}=req.query;
       const limit=20;
       page=parseInt(page) ||1;
    let offset=(limit * (page - 1)) || 0;
       // select article tags from Articles table, this returns an array of objects with tags props
       let allTags = await Tags.query(`SELECT DISTINCT text FROM BlogSchema.Tags ${limit} ${offset}`);
       
       // filter out null tags, and flatten the object into an array of strings
       allTags=ObjectArrayToStringArray(allTags);
       const totalTags=allTags.length;
       res.status(200).json({message:"Tags retrieved",status:200,"tags":allTags,resultCount:totalTags})
    }
    catch(error){
 
       const status=error.status ||500;
    res.status(status).json({message:"an error occurred",error,status})
    }
 };
 
 const getArticlesByTag=async(req,res)=>{
     try{
        let {page,sort}=req.query;
        if(ACCEPTABLE_SORT_NAMES.indexOf(sort) !== -1){
         sort=SORT_LISTS[sort];
          }
          else{
             sort=SORT_LISTS[ACCEPTABLE_SORT_NAMES[0]];
          }
          const orderBy=StringToArray(sort,'|')[0];
          const order=StringToArray(sort,'|')[1];
        let {tag}=req.params;
        tag=StringToArray(tag);
    
      const  limit=20;
        page=parseInt(page) ||1;
     let offset=(limit * (page - 1)) ||0;
  const recordCountQuery=`SELECT count(id) as recordCount FROM BlogSchema.Tags WHERE text IN("${tag.join('","')}") `;
  
     const recordCountResult=await Tags.query(recordCountQuery);
        const { recordCount } = recordCountResult[0];
      
        if((recordCount - offset ) <= 0 || (offset > recordCount)){
  res.status(200).json({message:"No Articles","articles":[]});
      return
        }
      let tagIds=await Tags.query(`SELECT id FROM BlogSchema.Tags WHERE text IN("${tag.join('","')}")`);
        tagIds = ObjectArrayToStringArray(tagIds);
    let postIds=await ArticleTags.query(`SELECT DISTINCT postId FROM BlogSchema.ArticleTags WHERE tagId IN("${tagIds.join('","')}")`);
        postIds = ObjectArrayToStringArray(postIds);
        const articlesQuery=`${ARTICLES_SQL_QUERY} AND a.id IN("${postIds.join('","')}") ORDER BY a.${orderBy} ${order} LIMIT ${limit} OFFSET ${offset} `;
         
   let articles=await Articles.query(articlesQuery);

articles=Nester(articles,["_fullname","_id","_bio","_twitter","_linkedIn","_username","_profileImage"],{nestedTitle:"author"});
  
        // decode html entities
   articles=articles.map((article)=>{
   article.title=decode(article.title);
   article.content=decode(article.content);
      article.intro = decode(article.intro);
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
         const status=error.status||500;
         res.status(status).json({message:"an error occurred",status,error})
     }
 }

module.exports={getAllTags,getArticlesByTag}