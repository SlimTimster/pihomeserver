const express = require('express');
const app = express();

const port = 8000;

var request = require('request');

var astroPictureOfTheDay;

var parseMyAwesomeHtml = function(html) {
    var obj = JSON.parse(html);
    var url = obj.url;
    var explanation = obj.explanation;
    astroPictureOfTheDay = '<img src=' + url + ' alt=' + explanation + '>' +
        '<br> <p style="font-family:Arial, Helvetica, sans-serif; line-height: 1.2;">' + explanation + '</p>';
};

request("https://api.nasa.gov/planetary/apod?api_key=lQ3b3WeJ0thpL4s9kuFOxZQjqqZrdbWzeYUCvaF5", function (error, response, body) {
    if (!error) {
        parseMyAwesomeHtml(body);
    } else {
        console.log(error);
    }
});


app.get('/', (request, response) => {
    response.send(astroPictureOfTheDay);
});

app.listen(port, () => console.log('Server running on port: ' + port));