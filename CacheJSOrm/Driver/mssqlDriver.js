var sql = null;
var isWindows = process.platform === "win32";
const runQuery=(connectionString, sqlQuery, callback)=>{
    console.log(sqlQuery)    
    if (isWindows){        
        sql = require("mssql/msnodesqlv8");        
    }else{
        sql = require("mssql");
    }
    sql.close()
    sql.connect(connectionString).then(pool => {        
        return pool.request().query(`${sqlQuery}`)
    }).then(result => {
        callback(null,result.recordset);
    }).catch(err => {
        callback(err,null);           
    }).then(() => {
        return sql.close();
    });
}
module.exports = runQuery;