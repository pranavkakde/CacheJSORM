//this class creates a key value pair based store
class CacheStore{
    
    constructor(){
        this.cacheStore=[];
    }
    setCacheStore(key, val, seconds){
        this.cacheStore.push({"key": key, "value": val, "time": seconds, "datetime": Date.now()});
        setInterval(()=> {
            this.clearCache();
        }, 1000);
    }
    getCacheStore(key){
        var returnVal="{}";
        if (this.cacheStore){
            this.cacheStore.map(element => {
                if (element.key===key){
                    returnVal = element;
                }
            });
        }
        return returnVal;
    }
    clearCache(){
        var toBeRemovedObjects=[];
        Object.keys(this.cacheStore).map(element => {
            var currentDate = Date.now();
            var delay = currentDate - this.cacheStore[element].datetime;
            delay = delay/1000;
            if (delay >= this.cacheStore[element].time){
                toBeRemovedObjects.push(element);
            }
        });
        
        Object.keys(toBeRemovedObjects).map(element=>{
            this.cacheStore.splice(element,1);
        });
    }
}
module.exports=CacheStore;