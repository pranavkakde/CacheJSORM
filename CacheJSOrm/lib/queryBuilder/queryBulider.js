
class QueryBuilder{
    constructor(tableName, schema){
        this.tableName = tableName;
        this.schema = schema;
    }

    queryBuilder(queryType, params, condition){
        var query='';
        if (queryType==='SELECT'){
            if (condition!=''){
                query = 'SELECT ' + params + ' FROM ' + this.tableName + ' WHERE '  + condition;
            }else{
                query = 'SELECT ' + params + ' FROM ' + this.tableName;
            }            
        }else if(queryType==='DELETE'){
            if (condition!= null){
                query = 'DELETE from ' + this.tableName +  ' where '  + condition;
            }else{
                query = 'DELETE from ' + this.tableName;
            }            
        }else if(queryType==='UPDATE'){
            if (condition!= null){
                query = 'UPDATE ' + this.tableName +  params + ' where ' + condition;
            }else{
                query = 'SELECT ' + params + ' ' + this.tableName;
            }            
        }else if(queryType==='INSERT'){
            query ='INSERT INTO ' + this.tableName + ' '  + condition;
        }
        return query;
    };
    //create condition
    getCondition(condition){        
        var names = Object.getOwnPropertyNames(condition);
        var cond = '';         
        names.map((value)=>{            
            var dataType = this.getType(value);
            if(Array.isArray(condition[value])){
                if(dataType===Number){
                    cond = value + ' in (' +condition[value] + ') and ' + cond;
                }else if(dataType===String){
                    cond = value + ' in (' + condition[value].map((v)=>{
                        return `\'${v}\'`;
                    }) + ') and ' + cond;                    
                }
            }else{                
                if(dataType===Number){
                    cond = value + ' = ' +condition[value] + ' and ' + cond;
                }else if(dataType===String){
                    cond = value + ' = \'' +condition[value] + '\' and ' + cond;
                }
            }
        });
        cond = cond.substr(0,cond.length-5);                
        return cond;  
    }    
    //get dataType based on field name
    getType(fieldName){
        var names = Object.getOwnPropertyNames(this.schema.DefJson);
        var dataType;
        for (var i=0;i<names.length;i++){
            if (fieldName == names[i]){
                dataType = this.schema.DefJson[names[i]].type;
                break;
            }
        }
        return dataType;
    }

    buildInsertQuery(condition){
        var names = Object.getOwnPropertyNames(condition);
        var nameString = '';
        var valueString = '';
        names.map((key)=>{
            var dataType = this.getType(key);
            if(dataType===Number){
                nameString += key + ", ";
                valueString += condition[key] + ", ";
            }else if(dataType===String){
                nameString += key + ", ";
                valueString += "'" + condition[key] + "', ";
            }            
        })
        nameString = nameString.substr(0,nameString.length-2);
        valueString = valueString.substr(0,valueString.length-2);
        return "( " + nameString + " ) values ( " + valueString +" )" ; 
    };

    //get update params
    getUpdateParams(dateset){
        var names = Object.getOwnPropertyNames(dateset);
        var dataString = '';        
        names.map((key)=>{
            var dataType = this.getType(key);
            if(dataType===Number){
                dataString += key + " = " + dateset[key] + ", ";
            }else if(dataType===String){                
                dataString += key + " = '" + dateset[key] + "', ";
            }            
        })
        dataString = dataString.substr(0,dataString.length-2);
        return " SET " + dataString; 
    };
}
module.exports=QueryBuilder;