var getBandGenres = function(bandName) {
    console.log('getting genres for ' + bandName);
    var result = [];
    $.get( "http://developer.echonest.com/api/v4/artist/profile?api_key=IW70HUWQIYTB3XQUM &format=json&name=" + encodeURIComponent(bandName) + "&bucket=genre", function( data ) {
        if (data.response.artist && data.response.artist.genres.length > 0) {
            for (var i = data.response.artist.genres.length - 1; i >= 0; i--) {
                result.push(data.response.artist.genres[i].name);
            }
            console.log("got genres for " + bandName + " : " + result);
        } else {
            console.log("no genres listed for " + bandName);
        }
    }).then(
        function() {
            updateUserGenres(result);
        }, function() {
            console.log('genre request failed!');
        }
    );
};

var getBatch = function(bandNames, batchSize) {
    var batch = bandNames.slice(0, batchSize);
    bandNames = bandNames.slice(batchSize);
    for (var i = batch.length - 1; i >= 0; i--) {
        getBandGenres(batch[i]);
    }
    return bandNames;
};

var updateUserGenres = function(genreArray) {
    var userGenres = localStorage.userGenres ? JSON.parse(localStorage.userGenres) : {};
    for (var i = genreArray.length - 1; i >= 0; i--) {
        var thisGenre = genreArray[i];
        if (thisGenre in userGenres) {
            userGenres[thisGenre].count ++;
            $($("#" + thisGenre.replace(/\W/g, '') ).children()[1]).html(userGenres[thisGenre].count);
        } else {
            userGenres[thisGenre] = {"count" : 1};
            $('#result').append("<tr id='" + thisGenre.replace(/\W/g, '') + "'><td class='genres--table-genre'>" + thisGenre + "</td><td class='genres--table-count'>" + userGenres[thisGenre].count + "</td></tr>");
        }
    }
    localStorage.userGenres = JSON.stringify(userGenres);
    return userGenres;
};

var compareGenreLists = function(userGenres, curatorGenres) {
    var totalMatched = 0;
    for (var i = userGenres.length - 1; i >= 0; i--) {
        if (userGenres[i] in curatorGenres) {
            totalMatched ++;
        }
    }
};

$(document).ready( function() {
    console.log('ready');
    $('#submit').on('click', function(){
        // clear results
        $("#result").html("");
        localStorage.removeItem("userGenres");

        //grab the list of band names from the input
        var bandNames = $('#input').val().split('\n').filter(Boolean);

        //if we have more than the rate limit, wait a second between requests
        var rate = 120;
        if( bandNames.length > rate) {
            var rateLimited = setInterval(function(){
                if(bandNames.length > 0) {
                    bandNames = getBatch(bandNames, rate);
                    console.log(bandNames.length + " bands remaining");
                } else {
                    clearInterval(rateLimited);
                }
            }, 1000);
        } else {
            for (var i = bandNames.length - 1; i >= 0; i--) {
                getBandGenres(bandNames[i]);
            }
        }
    });
});