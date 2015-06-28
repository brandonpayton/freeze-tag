var express = require('express');
var app = express();
var jsonParser = require('body-parser').json();
var path = require('path');
var when = require('when');
var node = require('when/node');
var fs = node.liftAll(require('fs'));

var mapsDir = path.resolve(path.join(__dirname, '..', '..', 'maps'));

//
// TODO: Unit test all these handlers
//

app.get('/', express.static(path.join(__dirname, '..', 'client')));

app.get('/maps', function (req, res) {
    fs.readdir(mapsDir).then(function (fileNames) {
      var fileNamePattern = /(.*)\.json$/i;
      return when.all(fileNames
        .map(function (fileName) { return fileName.match(fileNamePattern); })
        .filter(function (fileNameMatch) { return fileNameMatch !== null; })
        .map(function (fileNameMatch) {
          return fs.readFile(path.join(mapsDir, fileNameMatch[0]), { encoding: 'utf8' })
            .then(function (fileData) {
              return {
                name: fileNameMatch[1],
                data: JSON.parse(fileData)
              };
            });
        })
      );
    }).then(
      function (maps) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(maps));
      },
      function () {
        res.status(500).send();
      }
    );
});
app.get('/maps/:id', function (req, res) {
  var mapFileName = path.join(mapsDir, req.params.id + '.json');
  fs.readFile(mapFileName).then(function (data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  }, function (err) {
    // TODO: Find or create a hash of named statuses and use that instead
    // TODO: Where is a list of possible fs error codes?
    res.status(err.code === 'ENOENT' ? 404 : 500).send();
  });
});
app.put('/maps/:id', jsonParser, function (req, res) {
  var fileName = path.join(mapsDir, req.params.id + '.json');

  fs.writeFile(fileName, JSON.stringify(req.body)).then(function () {
    res.send();
  }, function () {
    res.status(500).send();
  });
});

app.listen(7777, function () {
  console.log('Ready');
});
