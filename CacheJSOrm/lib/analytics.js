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
        //console.log(retVal)
        return retVal;
    }
    setupSQLClause(clausename){
        
        switch (clausename){
            case '_group':
                return this.getGroupBy(this.options._group);
            case '_join':
                return this.getJoinSQL(this.options._join);
            default:
            //do nothing
        }
    }
    getJoinSQL(joinOptions){
        var fieldList='';
        var where='';
        var joinOn = '';
        var selField = '';
        var tabList = '';
        try{
            Object.getOwnPropertyNames(joinOptions).map(element=>{
                /*if (this.isAggregateFunc(element)){
                    selField = 'select ' + this.getAggregateFunction(element, groupByOptions) + ' from ' + this.tableName;
                }else{*/
                    switch(element){
                        case '_field':
                            fieldList = this.getFieldNames(joinOptions._field,joinOptions._foreignTable);
                            break;
                        case '_localkey':
                            joinOn = this.tableName +'.' + joinOptions._localkey + '=' + joinOn;
                            break;
                        case '_foreignkey':
                            joinOn =  joinOn + joinOptions._foreignTable + '.' + joinOptions._foreignkey
                            break;
                        case '_foreignTable':
                            tabList =  joinOptions._foreignTable + ", " + this.tableName
                            break;
                        case '_filter':
                            joinOptions._filter.forEach(ele=>{
                                where = where + 
                                 this.getJoinWhere(ele,joinOptions._foreignTable) + ' and '
                            });
                        default:
                            //nothing
                    }
                //}
            })
        }catch(e){
            throw (e);
        }
        where = where.substr(0,where.length-5)
        return 'select ' + fieldList  + ' from ' + this.tableName + ' JOIN ' + joinOptions._foreignTable + ' ON ' + joinOn +  ' where ' + where 
    }
    getJoinWhere(options,foreignTable){
        var fieldName = '';
        var condition = '';
        Object.getOwnPropertyNames(options).map(element=>{
            if(this.isField(element)){
                fieldName = this.getFieldNames(options._field, foreignTable)
            }else{
                condition = condition  + this.getCondition(element,options)
            }
        });
             
        return fieldName + condition;
    }
    getCondition(element,options){
        var condition='';
        switch(element){
            case '_eq':
                condition =  ' = ' + options._eq;
                break;
            case '_ls':
                condition = ' < ' + options._ls;
                break;
            case '_gt':
                condition = ' > ' + options._gt;
                break;
            case '_gteq':
                condition = ' >= ' + options._gteq;
                break;
            case '_lseq':
                condition = ' <= ' + options._lseq;
                break;
        }
        return condition;
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
                            break;
                        default:
                            //nothing
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
                    condition = this.getCondition(element,havingOptions)
                }
            })
        }
        return ' having ' + fieldName + ' ' + condition;
    }        
    getFieldNames(fieldNames,foreignTable){
        var returnFields='';
        fieldNames.forEach(element => {
            var temp =JSON.stringify(element._name)
            if(temp.indexOf('_local')>0){
                if (!element._alias){
                    returnFields = returnFields + this.tableName + '.' 
                    + temp.substr(temp.indexOf('.')+1,temp.length-1).replace("\"","") +',';
                }else{
                    returnFields = returnFields + this.tableName + '.' 
                    + temp.substr(temp.indexOf('.')+1,temp.length-1).replace("\"","") + ' as ' + element._alias + ' ,';
                }
            }else if(temp.indexOf('_foreign')>0){
                if(!element._alias){
                    returnFields = returnFields +  foreignTable + '.' 
                    + temp.substr(temp.indexOf('.')+1,temp.length-1).replace("\"","") +',';
                }else{
                    returnFields = returnFields +  foreignTable + '.' 
                    + temp.substr(temp.indexOf('.')+1,temp.length-1).replace("\"","") + ' as ' + element._alias +' ,';
                }
            }else{
                if(!element._alias){
                    returnFields += temp + ',';
                }else{
                    returnFields += temp + ' as ' + element._alias + ',';    
                }
                
            }
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
    getForeignTable(modelName){

    }
}
module.exports=Analytics;