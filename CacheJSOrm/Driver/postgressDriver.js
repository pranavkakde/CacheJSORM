const { Pool } = require('pg')
const runQuery=(connection, sqlQuery, callback)=>{
        var con = new Pool({
            host: connection.host,
            user: connection.user,
            password: connection.password,
            database: connection.db,
            port: connection.port
        });
        con.query(sqlQuery, function (err, result) {
            con.end();
            if (err) 
                callback(err)
            else
                callback(result)
        });
    
}
module.exports=runQuery;