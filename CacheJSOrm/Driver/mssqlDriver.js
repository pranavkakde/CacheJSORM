var sql = require("msnodesqlv8");

const runQuery=(connectionString, sqlQuery, callback)=>{
    sql.query(connectionString, sqlQuery, (err, rows) => {
        if(err){
            callback(err);
        }else{
            callback(rows);
        }            
    });
}
module.exports = runQuery;