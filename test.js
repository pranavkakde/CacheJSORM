var orderModel = require('./testModel/orderModel')
var customerModel = require('./testModel/customerModel')

var config={
    driverType: "mssql",
    server:'servername',
    database:'OrderDB',
    username:'user',
    password: 'pass',
    cacheDuration: 10,
    driverOptions:{            
        trustedConnection: false //false if username is provided in config
    }
}

orderModel.setConfig(config);
orderModel.find({OrderNumber: '542477'},function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
});

orderModel.aggregate(
    {
        _group: {
                _by: {
                    _field: [{name:'customerId'}]
                },
                _sum:{
                    _field: 'TotalAmount',
                    _alias: 'MaxAmount'
                },
                _having:{
                    /*_max: {
                        _field: 'TotalAmount'
                    },
                    _gt: '10'*/
                    _field:[{name:'customerId'}],
                    _eq:'10'
                }
            }
        }
    ,function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }
});