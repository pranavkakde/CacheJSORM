var express = require("express");  
var path = require("path");  
var bodyParser = require('body-parser');   
var morgan = require("morgan");  
var cors = require('cors')  
var app = express();  
var port = process.env.PORT || '3232'  
var rfs = require('rotating-file-stream')
var tabModel = require('./testModel/model')

app.use(express.static('public'));  
app.use(bodyParser.json({limit:'5mb'}));    
app.use(bodyParser.urlencoded({extended:true, limit:'5mb'}));  
app.use(cors())

// create a rotating access log
var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
  })
  
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

var config={
    driverType: "mssql",    
    server:'servername',
    database:'OrderDB',
    username:'username',
    password: 'pass',
    cacheDuration: 10,
    driverOptions:{            
        trustedConnection: false
    }
}
//api for get data from database  
app.get("/test/:name",function(req,res){   
    tabModel.setConfig(config);
    tabModel.find({name:req.params.name},function(err,data){
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });
})  
app.get("/test",function(req,res){   
    tabModel.setConfig(config);
    tabModel.find({},function(err,data){
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });
})  
app.delete("/test/:id",function(req,res){   
    tabModel.setConfig(config);
    tabModel.delete({name:req.params.id},function(err,data){
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });
})  
app.put("/test/",function(req,res){   
    tabModel.setConfig(config);
    tabModel.update({name:req.body.name},{serviceEndpoint:req.body.serviceEndpoint, resourceName:req.body.resourceName},function(err,data){        
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });
})  
app.post("/test/",function(req,res){   
    tabModel.setConfig(config);
    tabModel.insert({name:req.body.name, serviceEndpoint:req.body.serviceEndpoint, resourceName:req.body.resourceName},function(err,data){
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    });
})  

//server stat on given port  
app.listen(port,function(){   
    console.log("server started on port"+ port);  
})  
