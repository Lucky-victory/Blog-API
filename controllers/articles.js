const Articles=require('../models/articles');
const Comments=require('../models/comments');
const Replies=require('../models/replies');

const Authors=require('../models/authors');
const slugify=require("slugify");
const asyncHandler=require('express-async-handler');
const {nester,arrayBinder,generateSlug,calculateReadTime, StringToArray}=require("../helpers/utils");
const {Sqler}=require("harpee");
const shortId=require("shortid");
const {Converter}=require("showdown");
const {encode,decode}=require("html-entities");

const getArticles=asyncHandler(async(req,res)=>{
   try{
const queryHandler=new Sqler();
      let {limit,page}=req.query;
      limit=parseInt(limit) ||20;
      page=parseInt(page) ||1;
   let offset=(limit * (page - 1)) ||0;
      //const articles=await Articles.find({getAttributes:["title","body","tags","publishedAt","modifiedAt","authorId","heroImage","id","category","slug","views"],limit,offset});
      const {record_count}=await Articles.describeModel();
      if((record_count - offset ) <= 0 || (offset > record_count)){
         res.status(200).json({message:"No more Articles","articles":[]})
      return
      }
      const query=`SELECT a.id,a.publishedAt,a.title,a.authorId,a.body,a.views,a.heroImage,a.slug,a.tags,a.category,u.fullname as _fullname,u.id as _id,u.twitter as _twitter,u.linkedIn as _linkedin,u.bio as _bio,u.username as _username,u.profileImage as _profileImage FROM ArticlesSchema.Articles as a INNER JOIN ArticlesSchema.Authors as u ON a.authorId=u.id ORDER BY publishedAt DESC LIMIT ${limit} OFFSET ${offset} `;

      let articles=await Articles.query(query);
      // nest author info as author property
      articles=nester(articles,["_fullname","_id","_bio","_twitter","_linkedin","_username","_profileImage"],{nestedTitle:"author"});

      // decode html entities
 articles=articles.map((article)=>{
 article.title=decode(article.title);
 article.body=decode(article.body);
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

      if(articles.length){
         res.status(200).json({message:"Articles retrieved",status:200,articles,result_count:articles.length,page});
               return
            }
   res.status(200).json({message:"No Articles","articles":null})
         }
         catch(err){
            const status=err.status ||500;
            res.status(status).json({message:"an error occurred","error":err,status})
          }
});

// Get all article tags
const getTags= asyncHandler(async(req,res)=>{
   try{

      let {limit,page}=req.query;
      limit=parseInt(limit) ||20;
      page=parseInt(page) ||1;
   let offset=(limit * (page - 1)) || 0;
      // select article tags from Articles table, this returns an array of objects with tags props
      let allTags=await Articles.find({getAttributes:["tags"],limit,offset});
      
      // filter out null tags, and flatten the object into an array of strings
      allTags=[...allTags.reduce((accum,t)=>{t.tags !=null ? accum.push(t.tags):accum
         return accum;
      },[])]
      res.status(200).json({message:"Tags retrieved",status:200,"tags":allTags})
   }
   catch(err){

      const status=err.status ||500;
   res.status(status).json({message:"an error occurred","error":err,status})
   }
});

// Get all article categories
const getCategories=asyncHandler(async(req,res)=>{
   try{

      let {limit,page}=req.query;
      limit=parseInt(limit) ||20;
      page=parseInt(page) ||1;
   let offset=(limit * (page - 1)) || 0;
      let categories=await Articles.find({getAttributes:["category"],limit,offset});
      categories=[...categories.reduce((accum,c)=>{c.category !=null ? accum.push(c.category):accum; return accum},[])]
      res.status(200).json({message:"Categories retrieved",status:200,categories})
   }
   catch(err){
      const status=err.status ||500;
      res.status(status).json({message:"an error occurred","error":err,status})
   }
   });

   // Add new article
const createNewArticle=asyncHandler( async(req,res)=>{
   try{

      if(req.body && !Object.keys(req.body).length){
         res.status(400).json({message:"Please include article to add",status:400})
         return;
      }
      const converter=new Converter();
      const {category,heroImage='https://images.pexels.com/photos/4458/cup-mug-desk-office.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',tags,published=false }=req.body;
      let {title,content}=req.body;
if(!(title || content)){
res.status(400).json({message:"provide at least `title` or `content` "});
return
}

      const currentDate=new Date().toISOString();
      
      const slug= generateSlug(title)
      title=encode(title);
      content= converter.makeHtml(content);
      content=encode(content);
      
      const {readTime}=calculateReadTime()
      const createdAt=currentDate;
      const publishedAt=published? createdAt : null;
      const newArticle= {createdAt,publishedAt,title,content,tags,heroImage,slug,category,authorId,published,modifiedAt:createdAt,views:0,readTime};
      
      
      
      await Articles.create(newArticle);
      res.status(201).json({status:201,message:"article successfully created","article":newArticle})
   }
   catch(err){
      const status=err.status ||500;
   res.status(status).json({message:"an error occurred","error":err,status})

   }
});
module.exports={getTags,getArticles,createNewArticle,getCategories}
