const express = require('express');
const app = express();

app.set('view engine', 'pug')
app.use(express.static('views'));

const port = 8000;

var request = require('request');

var potd_explanation;
var potd_url;

var parsePOTD = function(html) {
    var obj = JSON.parse(html);
    potd_url = obj.url;
    potd_explanation = obj.explanation;
};

var moonrise
var moonset
var moon_alt
var moon_dist
var moon_azi
var moon_parang
var sunrise
var sunset

var parseAstroData = function(html) {
    var obj = JSON.parse(html);
    moonrise = obj.moonrise;
    moonset = obj.moonset;
    moon_alt = obj.moon_altitude.toFixed(6);
    moon_dist = obj.moon_distance.toFixed(3);
    moon_azi = obj.moon_azimuth.toFixed(6);
    moon_parang = obj.moon_parallactic_angle.toFixed(6);


    sunrise = obj.sunrise;
    sunset = obj.sunset;
};

//____________________________________  Initial API Requests  _______________________________________________________________________________________________________

//Request potd from NASA once on server startup
request("https://api.nasa.gov/planetary/apod?api_key=lQ3b3WeJ0thpL4s9kuFOxZQjqqZrdbWzeYUCvaF5", function(error, response, body) {
    if (!error) {
        console.log("Requested potd from NASA");
        parsePOTD(body);
    } else {
        console.log(error);
    }
});

request("https://api.ipgeolocation.io/astronomy?apiKey=2b8d3233d506466d8faf69a415920b41&lat=52.507550&long=13.179088", function(error, response, body) {
    if (!error) {
        console.log("Requested Astro data from ipgeolocation");
        parseAstroData(body);
    } else {
        console.log(error);
    }
});


//____________________________________  Repeating API Requests (hourly)  _______________________________________________________________________________________________________

//Request Data from APIs every hour
var requestLoop = setInterval(function() {
        request("https://api.nasa.gov/planetary/apod?api_key=lQ3b3WeJ0thpL4s9kuFOxZQjqqZrdbWzeYUCvaF5", function(error, response, body) {
            if (!error) {
                console.log("Requested potd from NASA");
                parsePOTD(body);
            } else {
                console.log(error);
            }
        });

        request("https://api.ipgeolocation.io/astronomy?apiKey=2b8d3233d506466d8faf69a415920b41&lat=52.507550&long=13.179088", function(error, response, body) {
            if (!error) {
                console.log("Requested Astro data from ipgeolocation");
                parseAstroData(body);
            } else {
                console.log(error);
            }
        });

    }, 3600000) //Every 1h: 3600000ms 

app.get('/', function(req, res) {
    res.render('potd', { potd_explanation: potd_explanation, potd_url: potd_url })
});

app.get('/potd', function(req, res) {
    res.render('potd', { potd_explanation: potd_explanation, potd_url: potd_url })
});

app.get('/astrodata', function(req, res) {
    res.render('astrodata', {
        moonrise_time: moonrise,
        moonset_time: moonset,
        moon_alt: moon_alt,
        moon_dist: moon_dist,
        moon_azi: moon_azi,
        moon_parang: moon_parang,
        sunrise_time: sunrise,
        sunset_time: sunset
    })
});

app.listen(port, () => console.log('Server running on port: ' + port));