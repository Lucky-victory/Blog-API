const express=require('express');
const app=express();
const PORT=process.env.PORT ||4901;

// middleware to accept json body requests.
app.use(express.json({extended:false}));
// middleware to accept a form 
app.use(express.urlencoded({extended:false}));

// articles route
const articlesRouter=require('./routes/articles');
// single article route
const articleRouter=require('./routes/article');
// users route
const usersRouter=require("./routes/authors");

app.use('/articles',articlesRouter);
app.use('/article',articleRouter);
app.use("/account",usersRouter);


app.get('/',(req,res)=>{
   res.send('hello blog')
});


app.listen(PORT,()=>{
   console.log('app listening on port '+PORT);
})