var getTemplate = function() {

    var templateURL = 'template.json';

    $.getJSON( templateURL, function( data ) {

        var base = data['base'];
        var tags = data['tags'];
        for (var i = 0 ; i <= tags.length - 1; i++) {
            var thisName = tags[i]['fieldname'];
            var thisPlaceholder = tags[i]['placeholder'];
            $('.tweet--input').append('<input type="text" class="template--field" id="' + thisName + '" placeholder="' + thisPlaceholder + '">');
        };

        initTweet(base, tags);

    });

};

var initTweet = function(base, tags) {

    for (var i = 0 ; i <= tags.length - 1; i++) {
        var thisTag = tags[i]['tag'];
        base = base.replace('{' + thisTag + '}', '<span id="span-' + thisTag + '">' + thisTag + '</span>');
    };

    $('.tweet--result').html(base);

};

var updateTweet = function() {

    $('.tweet--input').find('input').each( function() {
        var fieldName = $(this).attr('id');
        var thisVal = $(this).val();
        var thisSpan = $('#span-' + fieldName);

        thisSpan.html( ( thisVal === "" ) ? $(this).id : thisVal );

    })

    var tweetLength = $('.tweet--result').text().length;
    $('#tweet--chars').text(tweetLength);
    
    var charsStatus = (tweetLength > 140 ? "bad" : "good");
    $('.tweet--length').attr('class', charsStatus);



}

var getBitly = function(link) {
    var token = "748c81597b1afe6ae5a27a37d19a88bdc7bc7275";
    var longLink = encodeURIComponent(link);
    var bitlyURL = "https://api-ssl.bitly.com/v3/shorten?access_token=" + token + "&longUrl=" + longLink;

    $.getJSON( bitlyURL , function( data ) {
        var newURL = data['data']['url'];
        $('.bitly--result').html(newURL);
        $('#bitly').val(newURL);
    });
}

var tweetLink = function() {
    var status = $('.tweet--result').text();
    var URIstatus = encodeURIComponent(status);
    $('.tweetlink--result').html('http://twitter.com/home/?status=' + URIstatus);
}

var client = new ZeroClipboard($(".copy-button"));

$(document).ready( function() {

    getTemplate();

    $('.bitly--submit').on('click', function() {
        var link = $('.bitly--longlink').val();
        getBitly(link);
    });

    $('.tweet--generate').on('click', function() {
        updateTweet();
    })

    $('.tweetlink--submit').on('click', function() {
        tweetLink();
    })
});