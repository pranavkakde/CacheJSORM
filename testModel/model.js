var table = require('../CacheJSOrm/Schema/Schema')
var tableMapping = require('../CacheJSOrm/lib/Operations')

var sch = new table(
    /* {
        _id: {type: Number}, 
        name: {type: String}, 
        serviceEndpoint: {type: String}, 
        resourceName:{type:String}
    }); */
    {
        UserId: {type: Number}, 
        UserName: {type: String},
        Password: {type: String}, 
        GroupId : {type:Number}
    });
var tabModel = new tableMapping("dbo.[UserProfile]", sch);

module.exports=tabModel;