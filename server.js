const express=require('express');
const app=express();
const PORT=process.env.PORT ||4901;
app.use(express.json({extended:false}));
app.use(express.urlencoded({extended:false}));


const articlesRouter=require('./routes/articles');
const articleRouter=require('./routes/article');
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