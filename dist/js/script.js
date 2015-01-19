var getTemplate = function() {

    var templateURL = 'data/template.json';

    $.getJSON( templateURL, function( data ) {

        // generate all our fields from the template
        var tweet = data['tweet'],
            fields = data['fields'];

        for (var i = fields.length - 1 ; i >= 0 ; i--) {
            var thisName = fields[i]['fieldname'],
                thisPlaceholder = fields[i]['placeholder'],
                thisType = fields[i]['type'];

            $('.input').prepend('<' + thisType + ' type="text" class="template--field" id="' + thisName + '" placeholder="' + thisPlaceholder + '">');
            
            if ( i === 0 ) {
                // bind any event handlers on the fields here
                // $('#url').on('keyup', function() {
                //     var link = $('#url').val();
                //     getBitly(link);
                // });

                $('.template--field').on('keyup', function(){
                    updateTweet();
                })
            }
        };

        initTweet(tweet, fields);

    });

};

var initTweet = function(tweet, fields) {

    for (var i = 0 ; i <= fields.length - 1; i++) {
        var thisTag = fields[i]['fieldname'];
        tweet = tweet.replace('{' + thisTag + '}', '<span id="span-' + thisTag + '">' + thisTag + '</span>');
    };

    $('.tweet--result').html(tweet);

};

var updateTweet = function() {

    $('.input').find('input').each( function() {
        var fieldName = $(this).attr('id');
        var thisVal = $(this).val();
        var thisSpan = $('#span-' + fieldName);

        thisSpan.html( ( thisVal === "" ) ? $(this).id : thisVal );

    })

    updateTweetStatus();

}

var updateTweetStatus = function() {
    var tweetLength = $('.tweet--result').text().length;
    $('#tweet--chars').text(tweetLength);
    var charsStatus = (tweetLength > 140 ? "bad" : "good");
    $('.tweet--length').attr('class', 'tweet--length ' + charsStatus);
}

var getBitly = function(link) {
    var token = "748c81597b1afe6ae5a27a37d19a88bdc7bc7275";
    var longLink = encodeURIComponent(link);
    var bitlyURL = "https://api-ssl.bitly.com/v3/shorten?access_token=" + token + "&longUrl=" + longLink;

    $.getJSON( bitlyURL , function( data ) {
        console.log('getting url');
        var newURL = data['data']['url'];
        $('#span-url').html(newURL);
    });
}

var tweetLink = function() {
    var status = $('.tweet--result').text();
    var URIstatus = encodeURIComponent(status);
    $('.tweetlink--result').html('http://twitter.com/home/?status=' + URIstatus);
}

var saveCurrentSong = function() {
    var song = {};
    $('.template--field').each( function(){
        var fieldName = $(this).attr('id');
        var value = $(this).val();
        song[fieldName] = value;
    });
    console.log(song);
}

var client = new ZeroClipboard($(".copy-button"));

$(document).ready( function() {

    getTemplate();

    $('.tweet--result').on('keyup', function(){
        updateTweetStatus();
    });

    $('.save').on('click', function(){
        saveCurrentSong();
    });

});