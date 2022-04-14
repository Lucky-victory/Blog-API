
const {Sqler}=require('harpee');
const {query}=new Sqler().select(["a.id","a.publishedAt","a.intro","a.title","a.heroImage","a.slug","a.category","a.readTime","a.modifiedAt","a.authorId","a.views","a.content","u.fullname as _fullname","u.id as _id","u.twitter as _twitter","u.linkedIn as _linkedIn","u.username as _username","u.profileImage as _profileImage","u.bio as _bio"]).from("BlogSchema","Articles").as("a").innerJoin("BlogSchema","Users").as("u").on("a","authorId").isEqual("u","id").where("a.published=true")
const IS_PROD=process.env.NODE_ENV==='production';
const IS_DEV=process.env.NODE_ENV !=='production';
const ARTICLES_SQL_QUERY=query;
// const ARTICLES_SQL_QUERY=`SELECT a.id,a.publishedAt,a.intro,a.title,a.authorId,a.content,a.views,a.heroImage,a.slug,a.tags,a.category,a.readTime,a.modifiedAt,u.fullname as _fullname,u.id as _id,u.twitter as _twitter,u.linkedIn as _linkedin,u.bio as _bio,u.username as _username,u.profileImage as _profileImage FROM BlogSchema.Articles as a INNER JOIN BlogSchema.Users as u ON a.authorId=u.id WHERE a.published=true `;
module.exports={
    IS_PROD,
    IS_DEV,
    ARTICLES_SQL_QUERY
}