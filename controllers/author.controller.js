const asyncHandler=require('express-async-handler');
const {Nester,StringToArray}=require('../helpers/utils');
const {decode}=require('html-entities');
const Articles=require('../models/articles.model');
const { ARTICLES_SQL_QUERY, SORT_LISTS,ACCEPTABLE_SORT_NAMES } = require('../constants');


/** 
 * @param {import('../typings').Express.IRequest} req Request object
 * 
 */
const getArticlesByAuthor=async(req,res)=>{
    try{
       let {page,sort}=req.query;
       sort=String(sort);
       if(ACCEPTABLE_SORT_NAMES.indexOf(sort) !== -1){
      sort=SORT_LISTS[sort];
       }
       else{
          sort=SORT_LISTS[ACCEPTABLE_SORT_NAMES[0]];
       }
       const {author}=req.params;
       const orderBy=StringToArray(sort,'|')[0];
       const order=StringToArray(sort,'|')[1];
     const  limit=20;
       page=parseInt(page) ||1;
    let offset=(limit * (page - 1)) ||0;
    // check the number of articles  (record count) by that author
 const recordCountQuery=`SELECT count(a.id) as recordCount FROM BlogSchema.Articles as a INNER JOIN BlogSchema.Users as u ON a.authorId=u.id WHERE a.published=true AND u.username='${author}'`;
 const recordCountResult=await Articles.query(recordCountQuery);
 const {recordCount}=recordCountResult[0];
 // use the record count to handle pagination
       if((recordCount - offset ) <= 0 || (offset > recordCount)){
          res.status(200).json({message:"No more Articles","articles":[]});
       return
       }
       // query articles by an author with the username
       const articlesQuery=`${ARTICLES_SQL_QUERY} AND u.username='${author}' ORDER BY a.${orderBy} ${order} LIMIT ${limit} OFFSET ${offset} `;
       let articles=await Articles.query(articlesQuery);
       // nest author info as author property
       articles=Nester(articles,["_fullname","_id","_bio","_twitter","_linkedIn","_username","_profileImage"],{nestedTitle:"author"});
 
       // decode html entities
  articles=articles.map((article)=>{
  article.title=decode(article.title);
  article.content=decode(article.content);
   article.author.bio= article?.author?.bio ? decode(article.author.bio) : null;

  article.intro=decode(article.intro);
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
}

module.exports={
getArticlesByAuthor
}
