require('dotenv').config();
const connectDB=require("./db");
connectDB();
const Users= require("../models/users");
const Articles= require("../models/articles");
const Comments= require("../models/comments");
const Replies= require("../models/replies");
const ArticleTags = require('../models/articleTags');
const Tags = require('../models/tags');

async function initializeDB(){

    await Articles.init();
    await Users.init();
    await Comments.init();
    await Replies.init();
    await ArticleTags.init();
    await Tags.init();
    await Articles.createMany([
        {
        id:1,
        title:'post 1',
        content:'first content',
        published:true,
        category:'demo',
        createdAt:'2022-04-08T23:16:48.922Z',
        publishedAt:'2022-04-08T23:16:48.922Z',
        modifiedAt:'2022-04-08T23:16:48.922Z',
        views:0,
        heroImage:'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?cs=srgb&dl=pexels-pixabay-256450.jpg&fm=jpg',
        readTime:1,
        slug:'post-1-fgr', 
        authorId:'user-12345',
        intro: 'this is intro for post 1',
        tags:'tom'
    },
        {
        id:2,
        title:'post 2',
        content:'second content',
        intro: 'this is intro for post 2',
        tags:'pop',
        published:true,
        category:'junk',
        heroImage:'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?cs=srgb&dl=pexels-pixabay-256450.jpg&fm=jpg',
        createdAt:'2022-04-08T23:16:48.922Z',
        publishedAt:'2022-04-08T23:16:48.922Z',
        modifiedAt:'2022-04-08T23:16:48.922Z',
        views:0,
        readTime:1,
        slug:'post-2-wesr', 
        authorId:'user-45367'
    },
        {
        id:3,
        title:'post 3',
        content:'third content',
        published:true,
        category:'junks',
        intro: 'this is intro for post 3',
        createdAt:'2022-04-08T23:16:48.922Z',
        publishedAt:'2022-04-08T23:16:48.922Z',
        modifiedAt:'2022-04-08T23:16:48.922Z',
        heroImage: 'https://images.pexels.com/photos/5836080/pexels-photo-5836080.jpeg?cs=srgb&dl=pexels-roman-odintsov-5836080.jpg&fm=jpg',
        views:0,
        readTime:1,
        slug:'post-3-ddgr', 
        authorId:'user-12345',
        tags:'pop'
    },
        {
        id:4,
        title:'post 4',
        heroImage: 'https://images.pexels.com/photos/5836080/pexels-photo-5836080.jpeg?cs=srgb&dl=pexels-roman-odintsov-5836080.jpg&fm=jpg',
        content:'fourth content',intro:'thgis is an inyro for post 4',
        published:true,
        category:'junks',
        tags:'trash',
        intro: 'this is intro for post 4',
        createdAt:'2022-04-10T03:16:48.922Z',
        publishedAt:'2022-04-10T03:16:48.922Z',
        modifiedAt:'2022-04-10T03:16:48.922Z',
        views:0,
        readTime:1,
        slug:'post-4-fgdh', 
        authorId:'user-12345'
    },
]);
await Users.createMany([{
    id:'user-12345',
    fullname:'lucky victory',
    username:'lucky-victory',
    bio:'a dev with a difference',
    twitter:'lucky_victory1',
    email:'luckyvictory54@gmail.com',
    password:'$2b$10$RhgORChEjPfhkK4J1PIQSOX0EuasG5riHQ1EvO8KMX3up3cM2qEWm',
    superUser:true,
    github:'lucky-victory',
    profileImage:'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?cs=srgb&dl=pexels-spencer-selover-775358.jpg&fm=jpg',
    joinedAt:'',
    linkedIn:'lucky-victory-chukwuede'
},{
    id:'user-45367',
    fullname:'mike uche',
    username:'mike-uche',
    bio:'a dev with a difference',
    twitter:'mike_uche234',
    email:'mike@example.com',
    password:'$2b$10$RhgORChEjPfhkK4J1PIQSOX0EuasG5riHQ1EvO8KMX3up3cM2qEWm',
    joinedAt:'',
    linkedIn:'mike onye oma uche',
    github:'mike-uche-23',
    profileImage:'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?cs=srgb&dl=pexels-spencer-selover-775358.jpg&fm=jpg',
    superUser:false
}
]);

await Comments.createMany([
    {
        id:1,
        postId:1,
        text:'this is a comment for post 1',
        createdAt:'2022-04-10T04:16:48.922Z',
        modifiedAt:'2022-04-10T04:16:48.922Z',
        approved:true,
        userId:'user-12345'
    },
    {
        id:2,
        postId:2,
        text:'this is a comment for post 2',
        createdAt:'2022-04-10T04:16:48.922Z',
        modifiedAt:'2022-04-10T04:16:48.922Z',
        approved:true,
        userId:'user-45367'
    }
])
await Replies.createMany([
    {
        id:1,
        commentId:1,
        text:'this is a reply for comment 1',
        createdAt:'2022-04-10T04:16:48.922Z',
        modifiedAt:'2022-04-10T04:16:48.922Z',
        approved:true,
        userId:'user-12345'
    },
    {
        id:2,
        commentId:2,
        text:'this is a reply for comment 2',
        createdAt:'2022-04-10T04:16:48.922Z',
        modifiedAt:'2022-04-10T04:16:48.922Z',
        approved:true,
        userId:'user-45367'
    }
])
    await Tags.createMany([
        {
        id:1,
        text:'coach',
        createdAt:'2022-04-12T04:16:48.922Z'
    },
        {
        id:2,
        text:'men',
        createdAt:'2022-04-12T04:16:48.922Z'
    },
        {
        id:3,
        text:'wives',
        createdAt:'2022-04-12T04:16:48.922Z'
    },

]);
await ArticleTags.createMany([
    {
        id:1,
        tagId:3,
        postId:2,
        createdAt:'2022-04-12T04:16:48.922Z'
    },
        {
        id:2,
        tagId:1,
        postId:3,
        createdAt:'2022-04-12T04:16:48.922Z'
    },
        {
        id:3,
        tagId:2,
        postId:1,
        createdAt:'2022-04-12T04:16:48.922Z'
    },
])
}
initializeDB()


module.exports=initializeDB;
