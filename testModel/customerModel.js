var table = require('../CacheJSOrm/Schema/Schema')
var tableMapping = require('../CacheJSOrm/lib/Operations')

var sch = new table(
    //schema for mssql
    /*{
        id: {type: Number}, 
        FirstName: {type: String}, 
        LastName: {type: String}, 
        City:{type:String},
        Country: {type: String},
        Phone: {type: String}
    }*/
    //schema for mysql
    {
        customerNumber: {type: Number}, 
        contactFirstName: {type: String}, 
        contactLastName: {type: String}, 
        city:{type:String},
        country: {type: String},
        phone: {type: String}
    }
    );
var mysqlTable='customers';
var mssqlTable='dbo.[Customer]'
var tabModel = new tableMapping(mysqlTable, sch);

module.exports=tabModel;