var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs = require('fs');

http.createServer(function(req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        //form.keepExtensions = true;
        //form.uploadDir = "/home/wwwroot/product.geiliyou.com/ciwen/upload";

        form.parse(req, function(err, fields, files) {

            res.writeHead(200, {'content-type': 'text/plain'});
            //res.write('received upload:\n\n');
            res.end(util.inspect({fields: fields, files: files}));

          //fs.rename 类似于 move
            fs.rename(files.file.path, '/home/wwwroot/product.geiliyou.com/ciwen/upload/' + files.file.name, function(err) {
                if (err) throw err;
                //console.log('File uploaded!');
            });
        });
        return;
    }

    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
}).listen(8888,function(){
    console.log('Upload server is started. Port: 8888');
});
