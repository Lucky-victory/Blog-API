const express=require('express');
const app=express();
const PORT=process.env.PORT ||4456;
const cookieParser=require('cookie-parser');
const createErrors=require('http-errors');
const fs=require('fs');
const path=require('path');
const morgan=require("morgan");
const connectDB=require('./config/db');
connectDB();


app.use(cookieParser())
app.use(morgan("dev"))
// middleware to accept json body requests.
app.use(express.json());
// middleware to accept a form 
app.use(express.urlencoded({extended:false}));

// articles route
const articlesRouter=require('./routes/articles');
// single article route
const articleRouter=require('./routes/article');
// users route
const usersRouter=require("./routes/users");
const profileRouter=require("./routes/profile");
const tagsRouter=require('./routes/tags');
const categoryRouter=require('./routes/category');
const authorRouter=require('./routes/author');


app.use('/articles',articlesRouter);
app.use('/article',articleRouter);
app.use("/account",usersRouter);
app.use("/profile",profileRouter)
app.use('/tags',tagsRouter);
app.use('/category',categoryRouter);
app.use('/author',authorRouter);

app.get('/',(req,res)=>{
   res.send('hello blog')
});


app.use((req,res,next)=>{

   next(createErrors(404))
});

app.use((err,req,res,next)=>{
const errorLog=errorBuilder(err,req);
   const currentDir=path.resolve(__dirname,'errors.log');
   fs.appendFile(currentDir,JSON.stringify({...errorLog,"timestamp":new Date().toISOString()},null,4),()=>{
   
   })
   res.json(errorLog)
});
function errorBuilder(err,req,){
return {
'status':err.status ||500,
'code':err.code,
'message':err.message,
"stack":process.env.NODE_ENV !=='production'?err.stack:null
}
}

app.listen(PORT,()=>{
   console.log('app listening on port '+PORT);
});