var table = require('../CacheJSOrm/Schema/Schema')
var tableMapping = require('../CacheJSOrm/lib/Operations')
var mysqlTable ='orders';
var mssqlTable ='dbo.[Order]';
var sch = new table(
    //schema for mssql
    /*{orderNumber: {type: Number}, OrderDate: {type: String}, 
        OrderNumber: {type: Number}, 
        CustomerNumber:{type:Number}
    }*/
    //schema for mysql
    {
        orderNumber: {type: Number}, 
        orderDate: {type: String}, 
        customerNumber:{type:Number},
    }
    );

var tabModel = new tableMapping(mysqlTable, sch);

module.exports=tabModel;