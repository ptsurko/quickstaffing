var express = require('express'),
    fs = require('fs'),
    e3sservice = require('./server/e3sservice');

var credentials = {username: '', password: ''};
var app = express();
app.use('/api/projects', function(req, res) {

});
app.use('/', express.static(__dirname + '/public'));

var port = Number(process.env.PORT || 5001);
app.listen(port, function() {
  console.log('Your files will be served through this web server')
});

fs.exists('.credentials', function(exists) {
  if (exists) {
    fs.readFile('.credentials', function(err, data) {
      if (err) {
        console.info('Unable to locate \'.credentials\' file.');
      } else {
        var lines = String(data).split('\n');
        credentials.username = String(lines[0]);
        credentials.password = String(lines[1]);

        e3sservice.getCandidates(credentials, null, function(candidates) {
          console.log('candidates loaded');
          //console.log(candidates);
        });
        e3sservice.getPositions(credentials, function(positions) {
          console.log('positions loaded');
          //console.log(positions);
        });
        e3sservice.getProjects(credentials, function(projects) {
          console.log('projects loaded');
          console.log(projects);
        });
      }
    });
  }
});
