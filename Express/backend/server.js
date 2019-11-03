const http = require('http');
const app = require('./app');

/**
 **_ Get port from environment and store in Express.
 _**/
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 _ Create HTTP server.
 _**/
const server = http.createServer(app);

/*_
 _ Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));