const csurf=require("csurf");
const isProd=process.env.NODE_ENV ==='production';
const csrfProtect=csurf({cookie:{
    httpOnly:isProd,
    secure:isProd
}});

module.exports={csrfProtect};