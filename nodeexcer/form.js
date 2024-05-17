var httpserver = require('http')
var files = require('fs');
var url = require('url');


function getrequest(req,res){
    console.log("Request from:"+ req.url);
    if(req.url=="/"){
        let form = files.readFileSync("./form.html","utf8")
        res.write(form)
    }

    else{
        var Uurl = url.parse(req.url, true);
        var firstname = Uurl.query.name;
        var lastname = Uurl.query.lname;
        files.appendFile('myText.txt',firstname+ " "+ lastname+ "\n",function(err){
            if (err) throw err;
            console.log('Saved!')
        });
        res.write("Hi "+ firstname +" "+lastname+ " !")
        res.end();
    }

    res.end();
}

var server = httpserver.createServer(getrequest);
server.listen(8000);