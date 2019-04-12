require('../Schema/Schema');
var queryBuilder = require('./queryBuilder/queryBulider');
var sql =require("msnodesqlv8");
var cs = require('../CacheManager/CacheStore');

class Analytics{
    
    constructor(tableName,schema){
        this.tableName = tableName;
        this.schema = schema;  
        this.cacheData=''; 
        this.queryManager = new queryBuilder(tableName,schema);
        this.cacheStore = new cs();
        this.options = '';
    }
    //main wrapper function
    aggregate(options){
        var retVal='';
        this.options=options;
        Object.getOwnPropertyNames(options).map(element=>{
            retVal = this.setupSQLClause(element);
        })
        console.log(retVal)
        return retVal;
    }
    setupSQLClause(clausename){
        
        switch (clausename){
            case '_group':
                return this.getGroupBy(this.options._group);
                //break;
            default:
            //do nothing
        }
    }
    getGroupBy(groupByOptions){
        var gby='';
        var have='';
        var selField = '';
        try{
            Object.getOwnPropertyNames(groupByOptions).map(element=>{
                if (this.isAggregateFunc(element)){
                    selField = 'select ' + this.getAggregateFunction(element, groupByOptions) + ' from ' + this.tableName;
                }else{
                    switch(element){
                        case '_by':
                            gby= ' group by ' + this.getFieldNames(groupByOptions._by._field);
                            break;
                        case '_having':
                            have = this.getHaving(groupByOptions._having);
                    }
                }
            })
        }catch(e){
            throw (e);
        }
        return selField + gby + have ;
    }
    isField(element){
        return element==='_field'?true:false;
    }
    getHaving(havingOptions){
        var retval = '';
        var fieldName = '';
        var condition = '';
        if(havingOptions){
            Object.getOwnPropertyNames(havingOptions).map(element=>{
                if (this.isAggregateFunc(element)){
                    fieldName = ' ' + this.getAggregateFunction(element, havingOptions);
                }else if(this.isField(element)){
                    fieldName = this.getFieldNames(havingOptions._field)
                }else{
                    switch(element){
                        case '_eq':
                            condition = this.getOperation(element) + ' ' + havingOptions._eq;
                            break;
                        case '_ls':
                            condition = this.getOperation(element) + ' ' + havingOptions._ls;
                            break;
                        case '_gt':
                            condition = this.getOperation(element) + ' ' + havingOptions._gt;
                            break;
                        case '_gteq':
                            condition = this.getOperation(element) + ' ' + havingOptions._gteq;
                            break;
                        case '_lseq':
                            condition = this.getOperation(element) + ' ' + havingOptions._lseq;
                            break;
                    }
                }
            })
        }
        return ' having ' + fieldName + ' ' + condition;
    }
        
    getOperation(operation){
        var retVal ='';
        switch (operation){
            case '_eq':
                retVal = ' = ';
                break;
            case '_gt':
                retVal = ' > ';
                break;
            case '_ls':
                retVal = ' < ';
                break;
            case '_gteq':
                retVal = ' >= ';
                break;
            case '_lseq':
                retVal = ' <= ';
                break;
        }
        return retVal;
    }

    getFieldNames(fieldNames){
        var returnFields='';
        fieldNames.forEach(element => {
            returnFields += element.name + ',';
        });
        returnFields = returnFields.substr(0, returnFields.length - 1);
        return returnFields;
    }
    isAggregateFunc(func){
        var retval=false
        var xmap =['_max','_sum','_count']
        xmap.forEach(element =>{
            if(func===element){
                retval=true
            }
        })
        return retval
    }
    getAggregateFunction(aggOptions, groupByOptions){
        var returnVal='';
        Object.getOwnPropertyNames(groupByOptions).map(element=>{
            
            if(element === aggOptions){
                try{
                    if(!groupByOptions[element]._alias){
                        returnVal=this.getAggStmt(element, groupByOptions[element]._field);
                    }else{
                        returnVal=this.getAggStmt(element, groupByOptions[element]._field);
                        returnVal = returnVal + ' as ' + groupByOptions[element]._alias;
                    }
                }catch(e){
                    throw(e)
                }
            }
        });
        return returnVal;
    }
    getAggStmt(options, fieldName){
        var returnVal = '';
        switch(options){
            case '_max':
                returnVal = ' max('+fieldName+') ';
                break;
            case '_sum':
                returnVal = ' sum('+fieldName+') ';
                break;
            case '_count':
                returnVal = ' count('+fieldName+') ';
                break;
        }
        return returnVal;
    }
}
module.exports=Analytics;