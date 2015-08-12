
exports = module.exports = function(req, res){
    var file = __dirname + '/index.html';
    res.download(file); // Set disposition and send it.
};
