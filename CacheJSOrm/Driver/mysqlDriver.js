var mysql = require('mysql');

const runQuery=(connection, sqlQuery, callback)=>{
    if(connection.limit){
        var conPool = mysql.createPool({
            connectionLimit: connection.limit,
            host: connection.server,
            user: connection.user,
            password: connection.pass,
            database: connection.db
        });
        conPool.getConnection(function(err, con) {
            if (err){
                callback(err, null)
            } 
            con.query(sqlQuery, function (err, result) {
                con.destroy();
                if (err) 
                    callback(err, null)
                else
                    callback(null, result)
            });
        });
    }else{
        var con = mysql.createConnection({
            connectionLimit: connection.limit,
            host: connection.server,
            user: connection.user,
            password: connection.pass,
            database: connection.db
        });
        con.query(sqlQuery, function (err, result) {
            con.destroy();
            if (err) 
                callback(err,null)
            else
                callback(null,result)
        });
    }
    
}
module.exports=runQuery;