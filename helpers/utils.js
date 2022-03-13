const Utils={
    randomHexId(length=4){
const hexId=Math.random().toString(16).substr(2,length);
        return hexId;
        
     }
}

module.exports=Utils;