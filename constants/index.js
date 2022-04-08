


const IS_PROD=process.env.NODE_ENV==='production';
const IS_DEV=process.env.NODE_ENV !=='production';

module.exports={
    IS_PROD,
    IS_DEV 
}