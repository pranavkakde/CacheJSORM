 require('../Schema/Schema');
var queryBuilder = require('./queryBuilder/queryBulider');
var DriverManager =require('../Driver/driverManager')
var cs = require('../CacheManager/CacheStore');
var a = require('../lib/analytics');

class TableMapping extends DriverManager{
    constructor(tableName, schema, config){
        super(config); 
        this.tableName = tableName
        this.schema = schema;  
        this.cacheData=''; 
        this.queryManager = new queryBuilder(tableName,schema);
        this.analytics = new a(tableName,schema);
        this.cacheStore = new cs();
    }
    setConfig(config){
        this.config = config;
    }
    //check if data is cached
    isCached(key){
        this.cacheData = this.cacheStore.getCacheStore(key);
        if (this.cacheData!=="{}"){
            return this.cacheData;
        }else{
            return null;
        }
    }
      
    //get rows
    find(condition,callback){
        var cacheKey='';
        if (condition){
            var temp='';
            Object.getOwnPropertyNames(condition).map(element=>{
                temp+=element;
            })
            cacheKey='find_'+this.tableName+this.config.database+temp;
        }else{
            cacheKey='find_'+this.tableName+this.config.database;
        }
        if(this.isCached(cacheKey)){
            callback(this.cacheData.value);
        }else{
            if(condition){
                var query = this.queryManager.queryBuilder("SELECT", "*", this.queryManager.getCondition(condition));
            }else{
                var query = this.queryManager.queryBuilder("SELECT", "*", null);
            }
            //console.log(query)
            super.runSQL(query,function(err,data){
                if (err){
                    callback(err)
                }else{
                    callback(data)
                }
            })
        }
    }
    //delete from db
    delete(condition, callback){
        if(condition){
            var query = this.queryManager.queryBuilder("DELETE", "*", this.queryManager.getCondition(condition));
        }else{
            //var query = this.queryBuilder("DELETE", "*", null);
        }
        console.log(query);
        super.runSQL(query,function(err,data){
            if (err){
                callback(err)
            }else{
                callback(data)
            }
        })
    }
    //insert from db
    insert(dateset, callback){
        if(dateset){
            var query = this.queryManager.queryBuilder("INSERT", "*", this.queryManager.buildInsertQuery(dateset));
        }else{
            throw "No dataset available to insert";
        }
        console.log(query);
        super.runSQL(query,function(err,data){
            if (err){
                callback(err)
            }else{
                callback(data)
            }
        })
    }
    //update data in db
    update(keyfields, dataset,callback){
        if(dataset){
            var query = this.queryManager.queryBuilder("UPDATE", this.queryManager.getUpdateParams(dataset), this.queryManager.getCondition(keyfields));
        }else{
            throw "No dataset available to insert";
        }
        console.log("query = " +query);
        super.runSQL(query,function(err,data){
            if (err){
                callback(err)
            }else{
                callback(data)
            }
        })
    }
    //translate error messages from driver
    translateErr(err){

    }
    //create aggregation functions
    aggregate(options, callback){
        var query = this.analytics.aggregate(options);
        super.runSQL(query,function(err,data){
            if (err){
                callback(err)
            }else{
                callback(data)
            }
        })
    }
    //create join functions
    join(options, callback){
        /*this.prototype.limit = function(start,end){
            if(start===0){
                throw("provide a value for limiting query results")
            }else if((this.config.driverType==='mssql' || this.config.driverType==='pg') && end!=0){
                throw("end limit is only applicable for mysql driver")
            }else{

            }
        }*/
        var query = this.analytics.aggregate(options);
        super.runSQL(query,function(err,data){
            if (err){
                callback(err)
            }else{
                callback(data)
            }
        })
    }    
}

module.exports=TableMapping;