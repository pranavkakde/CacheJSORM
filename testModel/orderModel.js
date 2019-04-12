var table = require('../CacheJSOrm/Schema/Schema')
var tableMapping = require('../CacheJSOrm/lib/Operations')

var sch = new table(
    {id: {type: Number}, OrderDate: {type: String}, 
        OrderNumber: {type: Number}, 
        CustomerId:{type:Number},
        TotalAmount: {type: Number}
    });

var tabModel = new tableMapping("dbo.[Order]", sch);

module.exports=tabModel;