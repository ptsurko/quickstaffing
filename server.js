var express = require('express'),
    fs = require('fs'),
    e3sservice = require('./server/e3sservice'),
    auth = require('./auth'),
    candidateservice = require('./server/candidateservice'),
    positionservice = require('./server/positionservice'),
    https = require('https');

var credentials = {username: '', password: ''};
var app = express();

app.use('/api/positions/:id', function(req, res) {
  var positionId = req.params.id;
  console.log('retrieving position \'' + candidateName + '\'.');
  positionservice.getPositionById(positionId, function(data) {
    res.json(data);
  });
});
app.use('/api/positions', function(req, res) {
  console.log('retrieving positions');

  var project = req.query.project;
  positionservice.getPositions({project: project}, function(data) {
    res.json(data);
  });
});

app.use('/api/candidates/photo/:photoId', function(req, res) {
  var photoId = req.params.photoId;
  console.log('retrieving photo ' + photoId + '.');

  https.get({
    hostname: 'e3s.epam.com',
    path: '/rest/e3s-app-logo-impl/v1/logo?uri=attachment://' + photoId,
    method: 'GET',
    auth: auth.credentials.username + ':' + auth.credentials.password
  }, function(photoRes) {
    res.writeHead(200, {'Content-Type': photoRes.headers['content-type']});
    photoRes.pipe(res);
  });
});

app.use('/api/candidates/:name', function(req, res) {
  var candidateName = req.params.name;
  console.log('retrieving candidate \'' + candidateName + '\'.');
  candidateservice.getCandidateByName(candidateName, function(data) {
    res.json(data);
  });
});
app.use('/api/candidates', function(req, res) {
  console.log('retrieving candidates');

  var candidateName = req.query.name;
  candidateservice.getCandidates({name: candidateName}, function(data) {
    res.json(data);
  });
});

app.use('/api/init', function(req, res) {
  e3sservice.syncCandidates();
  e3sservice.syncPositions();
});

app.use('/api/reset', function(req, res) {
  //TODO: implement cache reset.
  //       - remove cache files
  //       - clear in-memory cache
});

app.use('/', express.static(__dirname + '/public'));

var port = Number(process.env.PORT || 5000);

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
        auth.credentials.username = String(lines[0]);
        auth.credentials.password = String(lines[1]);

        console.log('User credentials successfully loaded.');
//        e3sservice.syncCandidates();
//        e3sservice.syncPositions();

        e3sservice.getCandidates(function(candidates) {
          console.log(candidates);
        });

        e3sservice.getPositions(function(posotions) {
          console.log(posotions);
        });
      }
    });
  }
});
