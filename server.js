const express=require('express');
const app=express();
const PORT=process.env.PORT ||4901;

const articlesRouter=require('./routes/articles');
const articleRouter=require('./routes/article');

app.use('/articles',articlesRouter);
app.use('/article',articleRouter);
app.get('/',(req,res)=>{
   res.send('hello blog')
});


app.listen(PORT,()=>{
   console.log('app listening on port '+PORT);
})