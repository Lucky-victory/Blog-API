const csurf=require("csurf");
const { IS_PROD } = require("../constants");

const csrfProtect=csurf({cookie:{
    httpOnly:IS_PROD,
    secure:IS_PROD
}});

module.exports={csrfProtect};