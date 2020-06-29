var orderModel = require('./testModel/orderModel')
var customerModel = require('./testModel/customerModel')
var tabModel = require('./testModel/model')
/*var config={
    driverType: "mysql",
    server:'server',
    database:'db',
    username:'username',
    password: 'password',
    cacheDuration: 0,
    driverOptions:{            
        trustedConnection: false
    }
}*/
var config={
    driverType: "mssql",    
    server:'server',
    database:'db',
    username:'username',
    password: 'password',
    port: 1433,
    cacheDuration: 0,
    driverOptions:{
        //connectionPoolLimit: 10,
        trustedConnection: true
    }
}

orderModel.setConfig(config);
tabModel.setConfig(config);
orderModel.join(
    {
        _join: [{
            _localkey: 'customerid',
            _foreignkey: 'id',
            _foreignTable: 'dbo.[customer]',
            _type: 'inner',
            _name: '$join1'
        },
        {
            _localkey: 'id',
            _foreignkey: 'OrderId',
            _foreignTable: 'dbo.[OrderItem]',
            _type: 'left',
            _name: '$join2'
        }],
        _field: 
                [
                    {
                        _name: '_local.OrderNumber',
                        _alias: 'OrderNum',
                    },
                    {
                        _name: '_foreign.FirstName',
                        _alias: 'CustomerName',
                        _join: '$join1'
                    },
                    {
                        _name: '_foreign.all',
                        _join: '$join2'
                    }
                ],
        _filter: [
            {
                _field:[{_name:'_foreign.id', _join: '$join1'}],
                _in:[1,2]
            },
            {
                _field:[{_name:'_local.TotalAmount'}],
                _gteq:'400'
            }
        ],
        _order: {
            _field: 
                [
                    {
                        _name: '_local.OrderNumber',
                    },
                    {
                        _name: '_foreign.FirstName',
                        _join: '$join1'
                    }
                ],
            _mode: 'desc'
        },
        _top:{_row:2}
    },
    function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }
    }
)
/*tabModel.find({UserId: 1},function(err,data){    
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
});
tabModel.find({UserId: [1,2]},function(err,data){    
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
});

orderModel.join(
    {
        _join: [{
            _localkey: 'customerid',
            _foreignkey: 'id',
            _foreignTable: 'dbo.[customer]',
            _type: 'inner',
            _name: '$join1'
        },
        {
            _localkey: 'id',
            _foreignkey: 'OrderId',
            _foreignTable: 'dbo.[OrderItem]',
            _type: 'left',
            _name: '$join2'
        }],
        _field: 
                [
                    {
                        _name: '_local.OrderNumber',
                        _alias: 'OrderNum',
                    },
                    {
                        _name: '_foreign.FirstName',
                        _alias: 'CustomerName',
                        _join: '$join1'
                    },
                    {
                        _name: '_foreign.all',
                        _join: '$join2'
                    }
                ],
        _filter: [
            {
                _field:[{_name:'_foreign.id', _join: '$join1'}],
                _eq:'85'
            },
            {
                _field:[{_name:'_local.TotalAmount'}],
                _gteq:'400'
            }
        ],
        _order: {
            _field: 
                [
                    {
                        _name: '_local.OrderNumber',
                    },
                    {
                        _name: '_foreign.FirstName',
                        _join: '$join1'
                    }
                ],
            _mode: 'desc'
        },
        _top:{_row:2}
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
        _sum:{
            _field: 'TotalAmount',
            _alias: 'MaxAmount'
        },
        _group: {
                _by: {
                    _field: [{_name:'customerId'}]
                },
                _having:{
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
        _sum:{
            _field: 'TotalAmount',
            _alias: 'MaxAmount'
        },
        _group: {
                _by: {
                    _field: [{_name:'customerId'}]
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
*/