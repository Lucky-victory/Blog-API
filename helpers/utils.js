const slugify=require('slugify');
const shortId=require('shortid');
const randomWords=require("random-words");


const Utils = {
   randomHexId(length = 4) {
      const hexId = Math.random().toString(16).substr(2, length);
      return hexId;

   },
   Nester(arr, nestedKeys, options = {}) {

      const transformedObjs = arr.reduce((accum, item) => {
const arrayOfObj=Utils.selectKeys(item,nestedKeys,options);
         accum.push(...arrayOfObj);
         return accum;
      }, []);
      return [...transformedObjs];
   },
   selectKeys(obj, nestedKeys, options = {}) {
      const { nestedTitle = "nested", seperator = "_" } = options;
      const nestedKeysObj = {};
      for (let i = 0; i < nestedKeys.length; i++) {
         nestedKeysObj[nestedKeys[i]] = true;
      }
      const newObj = {};
      const nestedObj = {};
      for (const key in obj) {

         if (nestedKeysObj[key] || !obj.hasOwnProperty(key)) {
            const originalKey = key.split(seperator)[1]
            nestedObj[originalKey] = obj[key]
            continue;
         }
         newObj[key] = obj[key];
      }
      newObj[nestedTitle] = nestedObj;
      return [newObj];
   },
   ArrayBinder(outer, inner, options = {}) {
      if (!(Array.isArray(outer) && Array.isArray(inner))) {
         return []
      }
      const { innerTitle = 'nested', outerProp = 'id', innerProp = 'postId' } = options;
      const result = outer.map((item) => {
         return (
         {
            ...item,
            [innerTitle]: [...inner.reduce((accum, inItem) => {
               item[outerProp] == inItem[innerProp] ? accum.push(inItem) : accum;
               return accum;
            }, [])]
         })
      })
      return result;


   },
   matchWords(words) {
   const wordMatchRegex = /(\w+)/g;
   const wordCount = String(words).match(wordMatchRegex).length;
   return { wordCount }
},
CalculateReadTime(words) {
   const { wordCount } = Utils.matchWords(words);
   const rawReadTime = wordCount / 200;
   const minutes = parseInt(String(rawReadTime).split('.')[0]);

   let seconds = '.' + String(rawReadTime).split('.')[1];
   seconds = seconds * .60;
   const readTime = Math.ceil(minutes + seconds)||0;
   return { readTime };
},
GenerateSlug(title){
   const slugifyOptions={
      lower:true,
      strict:true,
      remove:/[*+~.()'"!:@]/g
   }
   const slug=title ? slugify(title+' '+shortId(),slugifyOptions) : null;
   return slug;
},
isEmpty(arg){
return (
   (!Utils.NullOrUndefined(arg) && !Object.keys(arg).length) || (!Utils.NullOrUndefined(arg) && arg==='')
   );
},

NotNullOrUndefined(val){
if(!Utils.NullOrUndefined(val)) return val;
},

NullOrUndefined(val){
  return( 
     Object.prototype.toString.call(val) =='[object Null]' ||
     Object.prototype.toString.call(val) =='[object Undefined]');
},

StringToArray(str,seperator=','){
   if(Utils.NullOrUndefined(str)) return null;
return String(str).split(seperator)
},
GenerateUsername(name){
   // generate random username
   const defaultUsername=randomWords({exactly:2,join:"-",maxLength:5});
   const slugifyOptions={
      lower:true,
      strict:true,
      remove:/[*+~.()'"!:@]/g
   }
  
return (Utils.NullOrUndefined(name) ? slugify(defaultUsername,slugifyOptions) :slugify(name,slugifyOptions) )
},
RemoveKeysFromObj(obj={},keysArr=[]){
   const keysToDrop = {};
   for (let i = 0; i < keysArr.length; i++) {
      keysToDrop[keysArr[i]] = true;
   }
   const newObj = {};
   for (const key in obj) {

      if (keysToDrop[key] || !obj.hasOwnProperty(key)) {
         continue;
      }
      newObj[key] = obj[key];
   }
   return newObj;

},
StringArrayToObjectArray(arr, propTitle = 'text') {
   if (!NullOrUndefined(arr)) {
    return ( arr.reduce((accum,item,index)=>{
   const obj={[objTitle]:item}
      accum.push(obj);
      return accum;
      },[]));
   }
   return null
},
AddPropsToObject(arrayOfObj, newProps) {
   if (!NullOrUndefined(arrayOfObj)) {
      return (arrayOfObj.map((item) => Object.assign(item, newProps)))

   }
},
ObjectArrayToStringArray(arrayOfObj) {
   return arrayOfObj.reduce((accum, item) => {
      for (let key in item) {
         accum.push(item[key])
      }
      return accum;
   }, [])
}
}

module.exports = Utils;