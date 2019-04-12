//this class is a single wrapper for all drivers
var mssql = require('./mssqlDriver')
var mysql = require('./mysqlDriver')
var postG = require('./postgressDriver')

class DriverManager{
    constructor(config){
        this.config = config;
    }
    
    //create connection
    connect(){
        var db = this.config.database;
        var server = this.config.server;
        var user = this.config.username;
        var password = this.config.password;
        if(this.config.driverType==='mssql'){
            if(this.config.driverOptions.trustedConnection===true){
                this.connectionString = "server="+server+";Database="+db+";Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
            }else{
                this.connectionString = "server="+server+";port=1433;Database="+db+";Uid="+user+";Pwd="+password+";Driver={SQL Server Native Client 11.0}";
            }            
        }else if(this.config.driverType='mysql'){
            //do something for mysql
        }
    }
    runSQL(query,callback){
        var results;
        switch (this.config.driverType){
            case 'mysql':
                mysql(this.connectionString,query,(err,data)=>{
                    if(err){
                        callback(err)
                    }else{
                        callback(data)
                    }
                    
                })
                break;
            case 'mssql':
                this.connect()
                mssql(this.connectionString,query,(err,data)=>{
                    if(err){
                        callback(err)
                    }else{
                        callback(data)
                    }
                })
            break;
            case 'postgress':
            break;
            case "oracle":
            break;
        }
    }
 }
module.exports = DriverManager;