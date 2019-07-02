
# CacheJSORM


A JavaScript ORM with caching and connection pooling support. It supports CRUD operations and aggeration(group, order, outer join, left join, right join, inner join, top, limit for mysql, max, min, sum, count) for mssql, mysql and postgres.

This repo contains library code for ORM and examples to use this library. 

To use this ORM;

1. Clone this repo
2. run `npm install`
    or 
2. run `npm install cachejsorm`
3. Setup database schema.
4. Setup config in `server.js`, `test.js` or `testMySQL.js` .
5. run `node server.js` to run expressjs example for using this ORM
6. Alternatively, run `node test.js` for mssql or run `node testMySQL.js` for examples on mysql

Following is a snapshot of example code and functions;

After installing this package;

1. create a model with table and field discription.


```
    var table = require('cachejsorm').TableSchema
    var tableMapping = require('cachejsorm').TableMapper
    var mssqlTable ='dbo.[orders]';
    var schema = new table(
        {
            OrderNumber: {type: Number}, 
            orderDate: {type: String}, 
            customerNumber:{type:Number},
        }
    );
    var tabModel = new tableMapping(mssqlTable, schema);
    module.exports=tabModel;
```


2. create a test.js
   1. call model in test.js
   2. setup connection details
   3. use functions from package for CRUD, join and aggregate function. refer to following example.   


```
var orderModel = require('./testmodel')
//setup configuration
var config={    
    driverType: "mssql",    //supports mysql/mssql/pg    
    server:'serverip',
    database:'databasename',
    username:'username',
    password: 'password',
    cacheDuration: 10,      //duration in seconds
    driverOptions:{
        connectionPoolLimit: 10,
        //trustedConnection: false  //true for integrated security
    }
}
orderModel.setConfig(config);
```
**CRUD Operation**
```
//find based on column values 
orderModel.find({OrderNumber: '123'},function(err,data){
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
});

//find all
orderModel.find({},function(err,data){
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });

//delete 
orderModel.delete({OrderNumber:1234},function(err,data){
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });

//Update (keyfields, field key value to update)
orderModel.update({OrderNumber:1234},{OrderQuantity: 2, customerNumber: 111},function(err,data){        
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });

//insert
orderModel.insert({OrderQuantity:1, orderDate:'2019-01-01', customerNumber:111},function(err,data){
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });
```
**Join Conditions (join types inner, outer, left and right)**
```
// use .join for joining multiple tables
orderModel.join(
    {
        _join: [{
            _localkey: 'customerid',
            _foreignkey: 'id',
            _foreignTable: 'dbo.[customer]',
            _type: 'inner',
            _name: '$join1'     //create multiple joins with same table and name them to reference later
        },
        {
            _localkey: 'id',
            _foreignkey: 'OrderId',
            _foreignTable: 'dbo.[OrderItem]',
            _type: 'left',
            _name: '$join2'     //create multiple joins with same table and name them to reference later
        }],
        _field: 
                [
                    {
                        _name: '_local.OrderNumber',
                        _alias: 'OrderNum',
                    },
                    {
                        _name: '_foreign.FirstName',    //fields to retrieve for first join 
                        _alias: 'CustomerName',
                        _join: '$join1'
                    },
                    {
                        _name: '_foreign.all',  //get all fields from second join 
                        _join: '$join2'
                    }
                ],
        _filter: [      //additional filters on joins 
            {
                _field:[{_name:'_foreign.id', _join: '$join1'}],
                _eq:'85'    //equal
            },
            {
                _field:[{_name:'_local.TotalAmount'}],
                _gteq:'400'     //greater than equal
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
        _top:{_row:2}   //use _limit for driver type mysql
    },
    function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }
    }
)
```
Above function produces following SQL Query internally to retrieve from DB;

_SELECT  top 2 orders.OrderNumber as OrderNum ,dbo.[customer].FirstName as CustomerName ,dbo.[OrderItem].* 
FROM orders 
INNER JOIN dbo.[customer] ON orders.customerid=dbo.[customer].id 
LEFT JOIN dbo.[OrderItem] ON orders.id=dbo.[OrderItem].OrderId  
Where dbo.[customer].id = 85 
and orders.TotalAmount >= 400  
Order By orders.OrderNumber, dbo.[customer].FirstName desc_


**Aggregate Operations (_sum, _count, _max, _min)**
```
//Use .aggregate for _sum , _count, _max and _min functions
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
```
Above function produces following SQL Query internally;

_SELECT sum(TotalAmount) as MaxAmount FROM orders group by customerId HAVING customerId = 10_
```
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
                    _gt: '500'  //greater than
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
```
Above function produces following SQL internally;

_SELECT sum(TotalAmount) as MaxAmount FROM orders group by customerId HAVING  max(TotalAmount) > 500_

3. run node test.js
