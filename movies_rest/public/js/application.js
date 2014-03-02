var moviesList = [];

$(document).ready(function() {
  seed();
  $('#movieList').on('click', '.show', showMovie);
  $('#btnAddMovie').on('click', addMovie);
  $('#movieList table tbody').on('click', 'td a.delete', deleteMovie);
});

var seed = function() {
  var content = '';

  $.getJSON('/movies', function(data) {
    moviesList = data; // put all data in global var
    $.each(data, function() {
      content += '<tr>';
      content += '<td><a href="show"' + this.title;
      content += '<td><a href="#" class="show" rel="' + this.title + '"title="Movie info">' + this.title + '</td>';
      content += '<td>' + this.director + '</td>';
      content += '<td>' + this.rating + '</td>';
      content += '<td><a href="#" class="delete" rel="' + this._id + '">Delete</a></td>';
      content += '</tr>';
    });

    $('#movieList table tbody').html(content);
  });
};

var showMovie = function(evt) {
  evt.preventDefault();

  var thisMovie = $(this).attr('rel');

  var aP = moviesList.map(function(item) { return item.title; }).indexOf(thisMovie);

  var myMovieObj = moviesList[aP];

  $('#title').text(myMovieObj.title);
  $('#year').text(myMovieObj.year);
  $('#director').text(myMovieObj.director);
  $('#writer').text(myMovieObj.writer);
  $('#rating').text(myMovieObj.rating);
  $('#movie_id').text(myMovieObj._id);

  $('#movieInfo').show("fast");
};

var addMovie = function(evt) {
  evt.preventDefault();

  var validate = function() {
    $('#addMovie input').each(function(i, val) {
      if($(this).val() === '') { return 0; }
    });

    function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

    year = $('#inputYear').val();
    rating = $('#inputRating').val();

    if(isNumber(year) && isNumber(rating)) {
      return 1;
    } else {
      return 0;
    }
  };

  var check_title = function() {
    title = $('#inputTitle').val();
    len = moviesList.length;
    for(var i = 0; i < len; i++) {
      if(title === moviesList[i].title) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  var exist = check_title();

  if (exist) {
    alert("Movie already exist!");
  } else {
    if(validate()) {
      var newMovie = {
        'title' : $('#inputTitle').val(),
        'year' : $('#inputYear').val(),
        'director' : $('#inputDirector').val(),
        'writer' : $('#inputWriter').val(),
        'rating' : $('#inputRating').val()
      };

      $.ajax({ 
        type: 'POST',
        data: newMovie,
        url: '/addmovie',
        dataType: 'JSON'
      }).done(function(res) {
        if (res.msg === '') {
          $('#addMovie input').val('');
          seed();
        } else {
          alert('Err: ' + res.msg); 
        }
      });
    } else {
      alert("Some fields doesn't respect criteria");
      return false;
    }
  }
};

var deleteMovie = function(evt) {

  evt.preventDefault();

  var sure = confirm('Are you sure?');

  if (sure) {
    var movieInfo_id = $('#movie_id').html();
    var movie_id = $(this).attr('rel');

    if(movieInfo_id === movie_id) {
      $('#movieInfo').hide("fast");
    }

    $.ajax({
      type: 'DELETE',
      url: '/deletemovie/' + $(this).attr('rel')
    }).done(function(res) {
      if (res.msg === '') {
      } else {
        alert('Error: ' + res.msg);
      }
      seed();
    });
  } else { 
    return false; 
  }

};
