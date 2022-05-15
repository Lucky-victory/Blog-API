// use environment variables
require('dotenv').config();
const express=require('express');
const app=express();
const PORT=process.env.PORT ||4456;
const cookieParser=require('cookie-parser');
const createErrors=require('http-errors');
const fs=require('fs');
const path=require('path');
const morgan=require("morgan");
const { IS_DEV } = require('./constants');
const connectDB=require('./config/db.config');
connectDB();


app.use(cookieParser());
app.use(morgan("dev"));
// middleware to accept json body requests.
app.use(express.json());
// middleware to accept a url-encoded body
app.use(express.urlencoded({extended:false}));

// articles route
const articlesRouter=require('./routes/articles.route');
// single article route
const articleRouter=require('./routes/article.route');
// users route
const usersRouter=require("./routes/users.route");
const profileRouter=require("./routes/profile.route");
const tagsRouter=require('./routes/tags.route');
const categoryRouter=require('./routes/category.route');
const authorRouter=require('./routes/author.route');
const commentRouter = require('./routes/comments.route');

app.use('/articles',articlesRouter);
app.use('/article',articleRouter);
app.use("/account",usersRouter);
app.use("/profile",profileRouter)
app.use('/tags',tagsRouter);
app.use('/categories',categoryRouter);
app.use('/author',authorRouter);
app.use('/comments',commentRouter);

app.get('/',(req,res)=>{
   res.send('hello blog')
});


app.use((req,res,next)=>{

   next(createErrors(404))
});

app.use((err,req,res,next)=>{
const errorLog=errorBuilder(err,req);
   const currentDir=path.resolve(__dirname,'errors.log');
   fs.appendFile(currentDir,JSON.stringify({...errorLog,timestamp:new Date().toISOString()},null,4),()=>{
   
   })
   res.json(errorLog)
});
function errorBuilder(err,req,){
   const {stack,status=500,code,message}=err;
return {
status,
code,
message,
"stack":IS_DEV ? stack : null
}
}

app.listen(PORT,()=>{
   console.log('app listening on port '+PORT);
});
