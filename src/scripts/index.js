module.exports = {};

var ZeroClipboard = require( 'zeroclipboard' );

var getBitly = function(link) {
    var token = "748c81597b1afe6ae5a27a37d19a88bdc7bc7275";
    var longLink = encodeURIComponent(link);
    var bitlyURL = "https://api-ssl.bitly.com/v3/shorten?access_token=" + token + "&longUrl=" + longLink;

    $.getJSON( bitlyURL , function( data ) {
        var newURL = data.data.url;
        $('.tweet--url').html(newURL);
        updateTweetStatus();
    });
};

var updateTweetStatus = function() {
    var tweetLength = $('.input--tweet').text().length;
    $('.tweet--chars').text(tweetLength);
    var charsStatus = (tweetLength > 140 ? "bad" : "good");
    $('.tweet--status').attr('class', 'tweet--status status--' + charsStatus);
};

var compile = function() {
    $(".result--url").html($(".tweet--url").html());
    $(".result--songname").html($(".input--songname").val());
    $(".result--artist").html($(".input--artist").val());
    tweetLink();
};

var tweetLink = function() {
    var status = $('.input--tweet').text();
    var URIstatus = encodeURIComponent(status);
    $('.result--tweet').html('http://twitter.com/home/?status=' + URIstatus);
};

var resetButton = function(){
    $(".input--submit").removeClass('success').html('Compile &amp; Copy');
};

var resetFields = function() {
    $(".input").val("");
    $(".input--tweet").html('Check out this song: <span class="tweet--field tweet--songname">songname</span> by <span class="tweet--field tweet--artist">artist</span> curated just for me - <span class="tweet--field tweet--url">url</span> Get yours at asongaday.co #asongaday');
};

$(document).ready( function () {

    if (!localStorage.asadHidden) {
        $('.greeting').removeClass('hidden');
    }

    var client = new ZeroClipboard( document.getElementById("copy-button") );

    client.on( "ready", function( readyEvent ) {

      client.on( "copy", function (event) {
        event.preventDefault();
        compile();
        var clipboard = event.clipboardData;
        var thisVal = $('.result').html();
        clipboard.setData( "text/html", thisVal );
      });

      client.on( "aftercopy", function( event ) {
        $(event.target).addClass('success');
        $(event.target).html('&#10004; Copied to clipboard!');
      } );
    } );

    $('.input--url').on('keyup', function(){
        var thisUrl = $(this).val();
        getBitly(thisUrl);

        if ( $('.input--submit').hasClass('success') ) {
            resetButton();
        }

    });

    $('.input').on('keyup', function(){
        updateTweetStatus();

        if ( $('.input--submit').hasClass('success') ) {
            resetButton();
        }

        var thisTarget = $(this).attr('id');
        var thisVal = $(this).val();

        $('.tweet--' + thisTarget).html(thisVal);
    });

    $('.input--reset').on('click', function(e){
        e.preventDefault();
        resetButton();
        resetFields();
    });

    $('.greeting--hide').on('click', function(e){
        e.preventDefault();
        $('.greeting').addClass('hidden');
        localStorage.asadHidden = true;
    });

});