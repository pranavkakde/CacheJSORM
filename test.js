var orderModel = require('./testModel/orderModel')
var customerModel = require('./testModel/customerModel')

var config={
    driverType: "mssql",
    server:'hostname',
    database:'OrderDB',
    username:'nodeuser',
    password: 'nodeuser',
    cacheDuration: 0,
    driverOptions:{            
        trustedConnection: false
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
orderModel.join(
    {
        _join: {
            _localkey: 'customerid',
            _foreignkey: 'id',
            _foreignTable: 'dbo.[customer]',
            _filter: [
                {
                    _field:[{_name:'_foreign.id'}],
                    _eq:'85'
                },
                {
                    _field:[{_name:'_local.TotalAmount'}],
                    _gteq:'400'
                }
            ],
            //TBD
            /*_max:{
                _field: 'salary',
                _alias: 'MaxSalary',
                _group: _localkey.deptid
            },
            _order: {
                _by: '_max_field',
                _mode: 'desc'
            },*/
            _field: 
                [
                    {
                        _name: '_local.OrderNumber',
                        _alias: 'OrderNum'
                    },
                    {
                        _name: '_foreign.FirstName',
                        _alias: 'CustomerName'
                    }
                ]
        }
    },
    function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }
    }
)
orderModel.aggregate(
    {
        _group: {
                _by: {
                    _field: [{_name:'customerId'}]
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
                    _field:[{_name:'customerId'}],
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

orderModel.aggregate(
    {
        _group: {
                _by: {
                    _field: [{_name:'customerId'}]
                },
                _sum:{
                    _field: 'TotalAmount',
                    _alias: 'MaxAmount'
                },
                _having:{
                    _max: {
                        _field: 'TotalAmount'
                    },
                    _gt: '500'
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
