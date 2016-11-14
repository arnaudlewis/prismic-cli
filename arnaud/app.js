/**
 * Module dependencies.
 */
var Prismic = require('prismic-nodejs');
var app = require('./config');
var PORT = app.get('port');
var PConfig = require('./prismic-configuration');
var request = require('request');

var DEFAULT_ENDPOINT = 'https://your-repo-name.prismic.io/api';

function handleError(err, req, res) {
  if (err.status == 404) {
    res.status(404).send("404 not found");
  } else {
    res.status(500).send("Error 500: " + err.message);
  }
}

app.listen(PORT, function() {
  const repoEndpoint = PConfig.apiEndpoint.replace("/api", "");
  request.post(repoEndpoint + '/app/settings/onboarding/run', {})
  console.log('Point your browser to: http://localhost:' + PORT);
});

/**
* initialize prismic context and api
*/
function api(req, res) {
  res.locals.ctx = { // So we can use this information in the views
    endpoint: PConfig.apiEndpoint,
    linkResolver: PConfig.linkResolver
  };
  return Prismic.api(PConfig.apiEndpoint, {
    accessToken: PConfig.accessToken,
    req: req
  });
}

// INSERT YOUR ROUTES HERE

/**
* route with documentation to build your project with prismic
*/
app.get('/', function(req, res) {
  res.redirect('/help');
});

/**
* Prismic documentation to build your project with prismic
*/
app.get('/help', function(req, res) {
  const repoRegexp = new RegExp('^(https?:\/\/([a-zA-Z0-9]+)\..+)\/api$');
  const match = PConfig.apiEndpoint.match(repoRegexp);
  const repoURL = match[1];
  const name = match[2];
  const host = req.headers.host
  const isConfigured = DEFAULT_ENDPOINT != PConfig.apiEndpoint
  res.render('help', {isConfigured, repoURL, name, host});
});

/**
* preconfigured prismic preview
*/
app.get('/preview', function(req, res) {
  api(req).then(function(api) {
    return Prismic.preview(api, configuration.linkResolver, req, res);
  }).catch(function(err) {
    handleError(err, req, res);
  });
});
