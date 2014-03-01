exports.index = function(req, res){
  res.render('index', { title: 'MoviesDB' });
};

exports.movieslist = function(db) {
  return function(req, res) {
    db.collection('movies').find().toArray(function (err, items) {
      res.json(items);
    });
  };
};

exports.addmovie = function(db) {
  return function(req, res) {
    db.collection('movies').insert(req.body, function(err, result){
      res.send(
        (err === null) ? { msg: '' } : { msg: err }
      );
    });
  };
};

exports.deletemovie = function(db) {
  return function(req, res) {
    movie = req.params.id;
    db.collection('movies').removeById(movie, function(err, result) {
      res.send(
        (result === 1) ? { msg : '' } : { msg : 'error: ' + err }
      );
    });
  };
};
