var mysql = require('mysql');

const connnection=(hostName,userid,pass,db)=>{
    
} 
const runQuery=(connnection, sqlQuery, callback)=>{
    mysql.createConnection({
        host: hostName,
        user: userid,
        password: pass,
        database: db
    });
    connnection.connect(function(err) {
        if (err) throw err;
        con.query(sqlQuery, function (err, result) {
            if (err) throw err;
        });
    });
}
