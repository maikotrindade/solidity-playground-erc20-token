var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

var routes = require('./api/routes/votingRoute.js');
app.use('/', routes);

app.listen(port, function () {
    console.log('Server running on : ' + port);
});