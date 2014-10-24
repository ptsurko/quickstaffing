var express = require('express'),
    fs = require('fs')
    _ = require('underscore'),
    e3sservice = require('./server/e3sservice'),
    auth = require('./auth'),
    candidateservice = require('./server/candidateservice'),
    positionservice = require('./server/positionservice'),
    cacheservice = require('./server/cacheservice'),
    https = require('https'),
    async = require('async'),
    bodyParser = require('body-parser');

var rankingCriteria = {
  primarySkill: 0,
  position: 0,
  city: 0,
  country: 0
};
var app = express();
app.use(bodyParser.json());
app.use(function(req, res, next) {
  var send = res.send;
  res.send = function (string) {
    var body = string instanceof Buffer ? string.toString() : string;
    if ((req.query.pretty || '').toLowerCase() == 'true') {
      try {
        var responseJson = JSON.parse(body);
        body = JSON.stringify(responseJson, null, 2);
      } catch (e) {
        console.log('unable to prettify response. leave as is');
      }
    }
    return send.call(this, body);
  };

  next();
});

app.use('/api/positions/:id/candidates', function(req, res) {
  var positionId = req.params.id;
  var query = _.extend({}, rankingCriteria, req.query);
  console.log('retrieving best candidates for position \'' + positionId + '\' with criteria + \'' + JSON.stringify(query) + '\'.');

  positionservice.getCandidatesForPosition(positionId, query, function(rankedCandidates) {
    console.log('found candidates');
    res.end();
  });
});
app.use('/api/positions/:id', function(req, res) {
  var positionId = req.params.id;
  console.log('retrieving position \'' + positionId + '\'.');
  positionservice.getPositionById(positionId, function(data) {
    res.json(data);
  });
});
app.use('/api/positions', function(req, res) {
  console.log('retrieving positions.');

  var project = req.query.project;
  positionservice.getPositions({project: project}, function(data) {
    res.json(data);
  });
});

app.use('/api/candidates/photo/:photoId', function(req, res) {
  var photoId = req.params.photoId;
  console.log('retrieving photo \'' + photoId + '\'.');

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
app.use('/api/candidates/:id/positions', function(req, res) {
  var candidateId = req.params.id;
  var query = _.extend({}, rankingCriteria, req.query);
  console.log('retrieving candidate \'' + candidateId + '\' with criteria + \'' + JSON.stringify(query) + '\'.');

  candidateservice.getPositionsForCandidate(candidateId, query, function(rankedPositions) {
    console.log('found positions');
    res.end();
  });
});

app.use('/api/candidates/:id', function(req, res) {
  var candidateId = req.params.id;
  console.log('retrieving candidate \'' + candidateId + '\'.');
  candidateservice.getCandidateById(candidateId, function(data) {
    res.json(data);
  });
});
app.use('/api/candidates', function(req, res) {
  console.log('retrieving candidates.');

  var candidateName = req.query.name;
  candidateservice.getCandidates({name: candidateName}, function(data) {
    res.json(data);
  });
});

app.use('/api/init', function(req, res) {
  async.parallel([
    function(callback) {
      e3sservice.syncCandidates(function() { callback();});
    },
    function(callback) {
      e3sservice.syncPositions(function() { callback();});
    },
  ], function(err, results) {
    res.status(200).send('caches were successfully initialized.').end();
  });
});

app.use('/api/reset', function(req, res) {
  e3sservice.clearMemoryCache();
  cacheservice.clearCache(function() {
    console.log('Caches were successfully cleared.');
    res.status(200).send('caches were successfully reset.').end();
  });
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
      }
    });
  }
});
