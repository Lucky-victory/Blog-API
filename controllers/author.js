const asyncHandler=require('express-async-handler');
const {nester,NullOrUndefined,StringToArray}=require('../helpers/utils');
const {decode}=require('html-entities');
const Articles=require('../models/articles')

const getArticlesByAuthor=asyncHandler(async(req,res)=>{
    try{
       let {page,sort='publishedAt|desc'}=req.query;
       const {author}=req.params;
       const orderBy=StringToArray(sort,'|')[0];
       const order=StringToArray(sort,'|')[1] ||'desc';
     const  limit=20;
       page=parseInt(page) ||1;
    let offset=(limit * (page - 1)) ||0;
 const recordCountQuery=`SELECT count(a.id) as recordCount FROM ArticlesSchema.Articles as a INNER JOIN ArticlesSchema.Authors as u ON a.authorId=u.id WHERE a.published=true AND u.username='${author}'`;
 const recordCountResult=await Articles.query(recordCountQuery);
 const {recordCount}=recordCountResult[0];
       if((recordCount - offset ) <= 0 || (offset > recordCount)){
          res.status(200).json({message:"No more Articles","articles":[]});
       return
       }
       const articlesQuery=`SELECT a.id,a.publishedAt,a.title,a.authorId,a.body,a.views,a.heroImage,a.slug,a.tags,a.category,a.content,a.readTime,a.modifiedAt,u.fullname as _fullname,u.id as _id,u.twitter as _twitter,u.linkedIn as _linkedin,u.bio as _bio,u.username as _username,u.profileImage as _profileImage FROM ArticlesSchema.Articles as a INNER JOIN ArticlesSchema.Authors as u ON a.authorId=u.id WHERE a.published=true  AND u.username='${author}' ORDER BY a.${orderBy} ${order} LIMIT ${limit} OFFSET ${offset} `;
 
       let articles=await Articles.query(articlesQuery);
       // nest author info as author property
       articles=nester(articles,["_fullname","_id","_bio","_twitter","_linkedin","_username","_profileImage"],{nestedTitle:"author"});
 
       // decode html entities
  articles=articles.map((article)=>{
  article.title=decode(article.title);
  article.body=decode(article.body);
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
        const status=error.status ||500;
        res.status(status).json({message:"an error occurred",status,error})
    }
})

module.exports={
getArticlesByAuthor
}