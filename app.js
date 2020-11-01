require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: "006c263a5d5f401382ce57b5981b0dc8",
  clientSecret: "74222b9199d54e48a786723cfd5c2555"
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('The received data from the API:', data.body.artists.items);
      res.render('artist-search-results', { artistArr: data.body.artists.items });
      // ----> ‘HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API’
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:id', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id, { limit : 5, offset : 1 })
    .then(data => {
      res.render('albums', { result: data.body.items });
      console.log('Artist albums', data.body);
    }, function (err) {
      console.error(err);
    });
});

app.get('/traks/:id', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id, { limit : 5, offset : 1 })
    .then(data => {
      res.render('traks', { result: data.body.items });
      console.log('Artist albums', data.body);
    }, function (err) {
      console.error(err);
    });
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
