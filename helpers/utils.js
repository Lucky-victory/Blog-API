const Utils={
    randomHexId(length=4){
const hexId=Math.random().toString(16).substr(2,length);
        return hexId;
        
     },nester(arr,nestedKeys,options={}){
    
        const s=arr.reduce((accum,item)=>{
           
          accum.push(...Utils.selectKeys(item,nestedKeys,options));
          return accum;
        },[]);
        return [...s]
        }, selectKeys(obj,nestedKeys,options={}){
           const {nestedTitle="nested",seperator="_"}=options;
           const nestedKeysObj={};
           for(let i=0;i< nestedKeys.length;i++){
              nestedKeysObj[nestedKeys[i]]=true;
           }
           let keys=[];
           const newObj={};
            const nestedObj={};
           for(const key in obj){
              
           if(nestedKeysObj[key] || !obj.hasOwnProperty(key)){
           const originalKey= key.split(seperator)[1]
              nestedObj[originalKey]=obj[key]
           continue;  
           }
           newObj[key]=obj[key];
           }
           newObj[nestedTitle]=nestedObj;
           keys=[newObj];
           return keys;
        }
        
       
}

module.exports=Utils;