var archiver = require('archiver');
var p = require('path');
var fs = require('fs');

exports = module.exports = function(req, res){

    var name = req.body.title,
       code = req.body.code;

    console.log("This is correct:" + name + code);

    var archive = archiver('zip');

    archive.on('error', function(err) {
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

    var files = [__dirname + '/index.html', __dirname + '/hero.html'];

    for(var i in files) {
      archive.append(fs.createReadStream(files[i]), { name: p.basename(files[i]) });
    }

    archive.finalize();

};
