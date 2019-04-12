var table = require('../CacheJSOrm/Schema/Schema')
var tableMapping = require('../CacheJSOrm/lib/Operations')

var sch = new table({_id: {type: Number}, name: {type: String}, serviceEndpoint: {type: String}, resourceName:{type:String}});

var tabModel = new tableMapping("Services", sch);

module.exports=tabModel;