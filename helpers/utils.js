const slugify = require('slugify');
const shortId = require('shortid');
const randomWords = require("random-words");
const { v4:uuidv4} = require('uuid');

const Utils = {
   randomHexId(length = 4) {
      const hexId = Math.random().toString(16).substr(2, length);
      return hexId;

   },
   Nester(arr, nestedKeys, options = {}) {

      const transformedObjs = arr.reduce((accum, item) => {
         const arrayOfObj = Utils.selectKeys(item, nestedKeys, options);
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

      let secondsStr = '.' + String(rawReadTime).split('.')[1];
    let  seconds = parseFloat(secondsStr) * .60;
      const readTime = Math.ceil(minutes + seconds) || 0;
      return { readTime };
   },
   GenerateSlug(title) {
      const slugifyOptions = {
         lower: true,
         strict: true,
         remove: /[*+~.()'"!:@]/g
      }
      // @ts-ignore
      const slug = title ? slugify(title + ' ' + shortId(), slugifyOptions) : null;
      return slug;
   },
   isEmpty(arg) {
      return (
         (!Utils.NullOrUndefined(arg) && !Object.keys(arg).length) || (!Utils.NullOrUndefined(arg) && arg === '')
      );
   },

   NotNullOrUndefined(val) {
      if (!Utils.NullOrUndefined(val)) return val;
   },

   NullOrUndefined(val) {
      return (
         Object.prototype.toString.call(val) == '[object Null]' ||
         Object.prototype.toString.call(val) == '[object Undefined]');
   },

   StringToArray(str, seperator = ',') {
      if (Utils.NullOrUndefined(str)) return null;
      return String(str).split(seperator)
   },
   /**
    * @param {string} name
    * @returns {string}
    * @example lucy-vine
    * **/
  
   GenerateUsername(name) {
      // generate random username
      const defaultUsername = randomWords({ exactly: 2, join: "-", maxLength: 5 });
      const slugifyOptions = {
         lower: true,
         strict: true,
         remove: /[*+~.()'"!:@]/g
      }

      // @ts-ignore
      return (Utils.NullOrUndefined(name) ? slugify(defaultUsername, slugifyOptions) : slugify(name, slugifyOptions))
   },
    /**
    * @param {string} [prefix]
    * @param {string} [suffix]
    * @returns {string}
    * @example user-12345678
    * **/
  
   GenerateUserID(prefix = 'u-', suffix = '') {
      let userId = uuidv4();
      userId = userId.replace(/[-]/gi, '');
      return `${prefix}${userId}${suffix}`;
   },
    /**
    * @param {{[key:string]:any}} obj
    * @param {string[]} keysArr
    * @returns {{[key:string]:any}}
    * **/
  
   RemoveKeysFromObj(obj = {}, keysArr = []) {
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
    /**
    * @param {string[]} arr
    * @param {string} propTitle
    * @returns {{[key:string]:any}[]}
    * **/
  
   StringArrayToObjectArray(arr, propTitle = 'text') {
      if (!Utils.NullOrUndefined(arr) && !Array.isArray(arr)) {
            arr = [arr];
         }
         return arr.reduce((accum, item) => {
            const obj = {
               [propTitle]: item };
            accum.push(obj);
            return accum;
         }, []);
      

   },
    /**
    * @param {{[key:string]:any}[]} arrayOfObj
    * @param {{[key:string]:any}[]} newProps
    * @returns {{[key:string]:any}[]}
    * **/
  
   AddPropsToObject(arrayOfObj, newProps) {
      if (!Utils.NullOrUndefined(arrayOfObj)) {
         if (!Array.isArray(newProps)) {
            newProps = [newProps];
         }
         return (arrayOfObj.map((item) => Object.assign(item, ...newProps)))

      }
   },
   /**
    * @param {any[]} arrayOfObj
    * @returns {string[]}
    * **/
   ObjectArrayToStringArray(arrayOfObj) {
      if (!Array.isArray(arrayOfObj)) return arrayOfObj;

      return arrayOfObj.reduce((accum, item) => {
         if(!Utils.isObject(item)){
            return item
         }
         for (let key in item) {
            accum.push(item[key])
         }
         return accum;
      }, [])
   },
   /**
    * check if value is an object.
    * */
    isObject(value){
       return (Object.prototype.toString.call(value) =='[object Object]');
    },
   /**
    * @param {{id:(string | number),text:string}[]} prevTags
    * @param {string[]} newTags
    * @returns {(string | number)[] | []}
    **/
   GetIdOfDuplicateTags(prevTags, newTags) {
   if(Array.isArray(prevTags) && Array.isArray(newTags)){

         const duplicateTagsIds = [];
         for (let prevTag of prevTags) {
            if (newTags.includes(prevTag.text)) {
               duplicateTagsIds.push(prevTag.id)
            }
         }
         return duplicateTagsIds
      }
      return [];
   },
   
    /**
     * Removes duplicate tags and returns the rest;
    * @param {{id?:(string | number),text:string}[]} prevTags
    * @param {string[]} newTags
    * @returns {string[] | []}
    **/
RemoveDuplicateTags(prevTags, newTags) {
   if(Array.isArray(prevTags) && Array.isArray(newTags)){
   let nonDuplicateTags = []; 
   const keysLeft = []
   for (let prevTag of prevTags) {
      keysLeft.push(Utils.RemoveKeysFromObj(prevTag, ['id']));

   }
   const valuesOfKeysLeft = Utils.ObjectArrayToStringArray(keysLeft);
   nonDuplicateTags = newTags.reduce((accum, newTag) => {
      if (!valuesOfKeysLeft.includes(newTag)) {
         accum.push(newTag);
      }
      return accum;
   }, [])
   return nonDuplicateTags
   }
   return [];
},
/**
 * Merge two arrays
 * @param {any[]} arr - array to be merged
 * @param {any[]} arr2 - array to be merged 
 * @returns 
 */
MergeArrays(arr=[], arr2=[]) {
   const newArr = [];
   newArr.push(...arr, ...arr2)
   return newArr
},
/**
 * get local time in ISO String
 * */
GetLocalTime(){
const timeZoneOffsetInHours=(new Date().getTimezoneOffset() / 60);
const currentHour=new Date().getHours();
const localDateTimeInMilliseconds=new Date().setHours(currentHour - timeZoneOffsetInHours);
const localTime=new Date(localDateTimeInMilliseconds).toISOString();
return localTime;
},
/**
 * 
 * @param {*} val - the value to be transformed to an array  
 * @returns {any[]}
 */
toArray(val){
   if(!Utils.NullOrUndefined(val) && !Array.isArray(val)){
val=[val]
return val   
}

},
/**
 * 
 * @param {any[]} arr  - an array to be checked
 * @param {number} length - the length to measure the array's length
 * @returns {boolean}
 */
isLongerThan(arr,length){
if(!Array.isArray(arr)) return;
return arr.length > length;
},
/**
 * 
 * @param {any[]} arr - the array to be shortened 
 * @param {number} size - the size to shorten the array to
 */
shortenArray(arr,size){
   if (!Array.isArray(arr)) return [];
   return (arr.slice(0,size))
}
}

module.exports = Utils;
