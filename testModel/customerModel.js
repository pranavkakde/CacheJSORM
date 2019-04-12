var table = require('../CacheJSOrm/Schema/Schema')
var tableMapping = require('../CacheJSOrm/lib/Operations')

var sch = new table(
    {id: {type: Number}, FirstName: {type: String}, 
        LastName: {type: String}, 
        City:{type:String},
        Country: {type: String},
        Phone: {type: String}
    });

var tabModel = new tableMapping("Customer", sch);

module.exports=tabModel;