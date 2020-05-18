var sql = null;
var isWindows = process.platform === "win32";
const runQuery=(connectionString, sqlQuery, callback)=>{
    console.log(sqlQuery)
    if (isWindows){        
        sql = require("msnodesqlv8");        
        sql.open(connectionString, function(err, con) {
            if(err){
                callback(err, null);
            }            
            con.query(sqlQuery, function(err, rows) {                
                if(err){
                    callback(err, null);
                }else{
                    callback(null, rows);
                }
            });
        })        
    }else{
        sql = require("mssql");
        sql.close()
        sql.connect(connectionString).then(pool => {        
            return pool.request().query(`${sqlQuery}`)
        }).then(result => {
            callback(null,result.recordset);
        }).catch(err => {
            callback(err.originalError.message,null);           
        }).then(() => {
            return sql.close();
        });      
    }
    
}
module.exports = runQuery;