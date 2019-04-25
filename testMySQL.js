var orderModel = require('./testModel/orderModel')
var customerModel = require('./testModel/customerModel')

var config={
    driverType: "mysql",
    server:'server',
    database:'database',
    username:'username',
    password: 'password',
    cacheDuration: 0,
    driverOptions:{            
        //trustedConnection: false
        //connectionPoolLimit: 10
    }
}

orderModel.setConfig(config);
customerModel.setConfig(config);

orderModel.find({OrderNumber: '10100'},function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
});
orderModel.join(
    {
        _join: [{
            _localkey: 'customerNumber',
            _foreignkey: 'customerNumber',
            _foreignTable: 'customers',
            _type: 'inner',
            _name: '$join1'
        },
        {
            _localkey: 'orderNumber',
            _foreignkey: 'orderNumber',
            _foreignTable: 'orderdetails',
            _type: 'left',
            _name: '$join2'
        }],
        _field: 
                [
                    {
                        _name: '_local.orderNumber',
                        _alias: 'OrderNum',
                    },
                    {
                        _name: '_foreign.contactFirstName',
                        _alias: 'customerName',
                        _join: '$join1'
                    },
                    {
                        _name: '_foreign.all',
                        _join: '$join2'
                    }
                ],
        _filter: [
            {
                _field:[{_name:'_foreign.customerNumber', _join: '$join1'}],
                _eq:'181'
            }
        ],
        _order: {
            _field: 
                [
                    {
                        _name: '_local.orderNumber',
                    },
                    {
                        _name: '_foreign.contactFirstName',
                        _join: '$join1'
                    }
                ],
            _mode: 'desc'
        }/*,
        _limit:{
            _offset: 2,
            _count: 4
        }*/
    },
    function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }
    }
)
customerModel.aggregate(
    {
        _sum:{
            _field: 'creditLimit',
            _alias: 'MaxAmount'
        },
        _group: {
                _by: {
                    _field: [{_name:'country'}]
                },
                _having:{
                    _max: {
                        _field: 'creditLimit'
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
