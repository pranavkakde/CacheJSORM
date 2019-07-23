var sql = require("msnodesqlv8");

const runQuery=(connectionString, sqlQuery, callback)=>{
    sql.open(connectionString, (err, con)=> {
        if(err){
            callback(err)
        }else{
            con.query(sqlQuery, (err, rows) => {
                if(err){
                    callback(err, null);
                }else{
                    callback(null,rows);
                }            
            });
        }
    })
}
module.exports = runQuery;