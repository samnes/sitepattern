var archiver = require('archiver');
var p = require('path');
var fs = require('fs');

exports = module.exports = function(req, res){

    var code = req.body.code;
    console.log("This is code: " + code);

    var archive = archiver('zip');

    archive.on('error', function(err) {
      console.log("This is error");
      res.status(500).send({error: err.message});
    });

    //on stream closed we can end the request
    res.on('close', function() {
      console.log('Archive wrote %d bytes', archive.pointer());
      return res.status(200).send('OK').end();
    });

    //set the archive name
    res.attachment('pattern.zip');

    //this is the streaming magic
    archive.pipe(res);

    archive.append(code, { name: 'index.html' })

    /*var files = [__dirname + '/index.html', __dirname + '/hero.html'];
    for(var i in files) {
      console.log("This is something");
      archive.append(fs.createReadStream(files[i]), { name: p.basename(files[i]) });
    }*/


    archive.finalize();

};
