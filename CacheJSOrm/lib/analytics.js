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
        var selList = '';
        var joinclause = '';
        var whereclause ='';
        var orderclause = '';
        var toprow='';
        var groupclause='';
        this.options=options;
        var limit='';
        var orderby = '';
        var sqlString = '';
        Object.getOwnPropertyNames(options).map(clausename=>{
            if (this.isAggregateFunc(clausename)){
                selList = this.getAggregateFunction(clausename, this.options);
            }else{
                switch (clausename){
                    case '_group':
                        groupclause = this.getGroupBy(this.options);
                        break;
                    case '_join':
                        joinclause = this.getJoinSQL(this.options._join);
                        break;
                    case '_order':
                        orderclause = this.getOrderBy(this.options);
                        break;
                    case '_field':
                        if(!this.options._join)
                            selList += this.getFieldNames(this.options._field);
                        else
                            selList += this.getFieldNames(this.options._field,this.options._join._foreignTable);
                        break;
                    case '_filter':
                        if(!this.options._join)
                            whereclause += this.getFilter(this.options._filter);
                        else
                            whereclause += this.getFilter(this.options._filter,this.options._join._foreignTable);
                    case '_top':
                        if (this.options._top){
                            toprow = ` top ${this.options._top._row} `
                        }
                        break;
                    case '_limit':
                        if (this.options._limit){
                            if(this.options._limit._offset && this.options._limit._count){
                                limit =` LIMIT ${this.options._limit._offset} , ${this.options._limit._count}`
                            }else if(this.options._limit._count && !this.options._limit._offset){   
                                limit = ` LIMIT ${this.options._limit._count}`
                            }else{
                                throw("No valid options provided for LIMIT clause");
                            }
                        }
                        break;
                    default:
                        throw(`option ${clausename} is not configured `)
                    //do nothing
                }
            }
        })
        if (whereclause!=''){
            whereclause = ` Where ${whereclause}`
        }
        console.log('SELECT ' + toprow + selList + ' FROM ' + this.tableName + ' ' + limit +' ' + joinclause + ' ' + whereclause + ' ' + groupclause + ' ' + orderclause)
        return 'SELECT ' + toprow + selList + ' FROM ' + this.tableName + ' ' + limit + ' ' + joinclause + ' ' + whereclause + ' ' + groupclause + ' ' + orderclause
    }
    
    getOrderBy(allOptions){
        var orderOptions = allOptions._order;
        var orderStmt='';
        var fieldList='';
        try{
            Object.getOwnPropertyNames(orderOptions).map(element=>{
                if (this.isAggregateFunc(element)){
                    fieldList = this.getAggregateFunction(element, orderOptions);
                }else{
                    if(element==='_field'){
                        fieldList = this.getFieldNames(orderOptions._field,allOptions._join._foreignTable);
                    }
                }
            })
            orderStmt = 'Order By ' + fieldList + ' ' + orderOptions._mode
        }catch(e){
            throw (e);
        }
        return orderStmt;
    }
    getJoinSQL(joinOptions){
        var joinOn = '';
        var joinType='';
        try{
            joinOptions.forEach(element=>{
                switch(element._type){
                    case 'left':
                        joinType='LEFT';
                        break;
                    case 'right':
                        joinType='RIGHT';
                        break;
                    case 'outer':
                        joinType='OUTER';
                        break;
                    case 'inner':
                        joinType='INNER';
                        break;
                    default:
                        throw("join type is incorrect")
                }
                joinOn +=  ` ${joinType} JOIN ${element._foreignTable}  ON ` + this.tableName +'.' + element._localkey + '=' + element._foreignTable + '.' + element._foreignkey
            })
        }catch(e){
            throw (e);
        }
        return  joinOn
    }
    getFilter(filterOptions,foreignTable){
        var where='';
        
        filterOptions.forEach(ele=>{
            where = where + this.getJoinWhere(ele,foreignTable) + ' and '
        });
        where = where.substr(0,where.length-5)
        return where;
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
    getGroupBy(allOptions){
        var gby='';
        var have='';
        var groupByOptions = allOptions._group;
        try{
            Object.getOwnPropertyNames(groupByOptions).map(element=>{
                switch(element){
                    case '_by':
                        if (allOptions._join){
                            gby= ' group by ' + this.getFieldNames(groupByOptions._by._field, allOptions._join._foreignTable);
                        }else{
                            gby= ' group by ' + this.getFieldNames(groupByOptions._by._field);
                        }
                        
                        break;
                    case '_having':
                        have = this.getHaving(groupByOptions._having);
                        break;
                    default:
                        //nothing
                }
            })
        }catch(e){
            throw (e);
        }
        return gby + have ;
    }
    isField(element){
        return element==='_field'?true:false;
    }
    getHaving(havingOptions){
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
        return ` HAVING ${fieldName} ${condition}`;
    }        
    getFieldNames(fieldNames){
        var returnFields='';
        var foreignTable='';
        fieldNames.forEach(element => {
            var fieldName =JSON.stringify(element._name)
            
            if(fieldName.indexOf('_local')>0){
                if (!element._alias){
                    returnFields = returnFields + this.tableName + '.' 
                    + this.isAll(this.stripFieldName(fieldName)) +',';
                }else{
                    returnFields = returnFields + this.tableName + '.' 
                    + this.isAll(this.stripFieldName(fieldName)) + ' as ' + element._alias + ' ,';
                }
            }else if(fieldName.indexOf('_foreign')>0){
                foreignTable = this.getForeignTable(element._join)
                if(!element._alias){
                    returnFields = returnFields +  foreignTable + '.' 
                    + this.isAll(this.stripFieldName(fieldName)) +',';
                }else{
                    returnFields = returnFields +  foreignTable + '.' 
                    + this.isAll(this.stripFieldName(fieldName)) + ' as ' + element._alias +' ,';
                }
            }else{
                if(!element._alias){
                    returnFields += this.isAll(fieldName) + ',';
                }else{
                    returnFields += this.isAll(fieldName) + ' as ' + element._alias + ' ,';    
                }
                
            }
        });
        returnFields = returnFields.substr(0, returnFields.length - 1);
        return returnFields;
    }
    stripFieldName(inputString){
        return inputString.substr(inputString.indexOf('.')+1,inputString.length).replace(/"/g,'')
    }
    isAll(fieldName){
        return fieldName==='all'?'*':fieldName;
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
                        returnVal = `${returnVal}  as ${groupByOptions[element]._alias}`;
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
                returnVal = ` max(${fieldName}) `;
                break;
            case '_sum':
                returnVal = ` sum(${fieldName}) `;
                break;
            case '_count':
                returnVal = ` count(${fieldName}) `;
                break;
        }
        return returnVal;
    }
    getForeignTable(joinSeq){
        var tableName='';
        if(this.options._join){
            this.options._join.forEach(element=>{
                if(element._name===joinSeq){
                    tableName = element._foreignTable
                }
            })
        }else{
            throw("join options are not provided")
        }
        return tableName;
    }
}
module.exports=Analytics;