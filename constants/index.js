
const { Sqler } = require('harpee');

const { query } = new Sqler().select(["a.pid as id", "a.publishedAt", "a.intro", "a.title", "a.heroImage", "a.slug", "a.category", "a.readTime", "a.modifiedAt", "a.authorId", "a.views", "a.content", "u.fullname as _fullname", "u.uid as _id", "u.twitter as _twitter", "u.linkedIn as _linkedIn", "u.username as _username", "u.profileImage as _profileImage", "u.bio as _bio"])
    .from("BlogSchema2", "Articles").as("a")
    .innerJoin("BlogSchema2", "Users").as("u")
    .on("a", "authorId")
    .isEqual("u", "uid")
    .where("a.status='published'");
    const ARTICLES_SQL_QUERY=query;
const IS_PROD=process.env.NODE_ENV==='production';
const IS_DEV=process.env.NODE_ENV !=='production';
// const ARTICLES_SQL_QUERY=`SELECT a.id,a.publishedAt,a.intro,a.title,a.authorId,a.content,a.views,a.heroImage,a.slug,a.tags,a.category,a.readTime,a.modifiedAt,u.fullname as _fullname,u.id as _id,u.twitter as _twitter,u.linkedIn as _linkedin,u.bio as _bio,u.username as _username,u.profileImage as _profileImage FROM BlogSchema.Articles as a INNER JOIN BlogSchema.Users as u ON a.authorId=u.id WHERE a.published=true `;
const SORT_LISTS={
    'popular':'views|desc',
    'latest': 'publishedAt|desc',
    'short':'readTime|asc',
    'long':'readTime|desc'
 }

 const  ACCEPTABLE_SORT_NAMES=['latest','popular','short','long'];
const MAX_ARTICLE_TAGS=5; 
module.exports={
    IS_PROD,
    MAX_ARTICLE_TAGS,
    IS_DEV,
    ARTICLES_SQL_QUERY,
    ACCEPTABLE_SORT_NAMES,
    SORT_LISTS
}
