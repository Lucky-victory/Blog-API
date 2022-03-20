const csurf=require("csurf");

const csrfProtect=csurf({cookie:{
    httpOnly:true
}});

module.exports={csrfProtect};