var archiver = require('archiver');
var p = require('path');
var fs = require('fs');

exports = module.exports = function(req, res){

    var code = req.body.code;
    /*console.log("This is code: " + code);*/

    // Async file reads
    var headerData = '';
    var footerData = '';

    var files = [ p.join(__dirname + '/html/', 'header.html'), p.join(__dirname + '/html/', 'footer.html')];


    files.forEach(function (file, i) {
      fs.readFile(file, 'utf8', function (err, data){
        if (err) {
          return console.log(err);
        }

        if(i === 0){
          headerData = data;
          console.log("Header data: " + data);
        }else{
          footerData = data;
          console.log("Footer data: " + data);
        }
      })
    });

    console.log('after calling readFile');

    // Zipping

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

    archive.append(code, { name: 'index.html' });

    /*var files = [__dirname + '/index.html', __dirname + '/hero.html'];
    for(var i in files) {
      console.log("This is something");
      archive.append(fs.createReadStream(files[i]), { name: p.basename(files[i]) });
    }*/


    archive.finalize();

};
