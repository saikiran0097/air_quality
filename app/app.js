// Import necessary modules
const axios = require('axios');
const express = require("express");
const bodyParser = require('body-parser');

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Render the form page
app.get('/', (req, res) => {
    res.render('air-quality');
});


app.get('/air-quality', function (req, res) {
    const { latitude, longitude, timezone, start_date, end_date } = req.query;

    // If the necessary query parameters are not provided, render the form
    if (!latitude || !longitude || !timezone || !start_date || !end_date) {
        return res.render('air-quality');
    }

    // Construct the API URL with the provided query parameters
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,uv_index_clear_sky,ammonia,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth,dust,uv_index,uv_index_clear_sky,ammonia,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=${timezone}&start_date=${start_date}&end_date=${end_date}`;

    // Fetch the air quality data from the API
    axios.get(url)
      .then(response => {
        // Render the results on the air-quality-results page
        res.render('output', { data: response.data });
      })
      .catch(error => {
        console.error('Error fetching air quality data:', error);
        res.status(500).send('Error fetching air quality data');
      });
});



// Start server on port 3000
app.listen(3000, function () {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
