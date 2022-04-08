const csurf=require("csurf");
const { isProd } = require("../constants");

const csrfProtect=csurf({cookie:{
    httpOnly:isProd,
    secure:isProd
}});

module.exports={csrfProtect};