var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var routes = require('./routes');
var RequestContext = require('./requestContext');

http.createServer(
    function(request, response) {
        var requestPath = url.parse(request.url).pathname;
        var query = url.parse(request.url).query;
        var context = new RequestContext();
        var viewResponse = false;
        var notFound = function() {
            response.writeHead(
                404,
                {
                    'Content-Type': 'text/html'
                }
            );

            response.write('<html><head>');
            response.write('<title>Internal server error</title>');
            response.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
            response.write('<style>*{line-height:1.2;margin:0}html{color:#888;display:table;font-family:sans-serif;height:100%;text-align:center;width:100%}body{display:table-cell;vertical-align:middle;margin:2em auto}h1{color:#555;font-size:2em;font-weight:400}p{margin:0 auto;width:380px}a{color:inherit}@media only screen and (max-width:280px){body,p{width:95%}h1{font-size:1.5em;margin:0 0 .3em}}</style>');
            response.write('</head><body>');
            response.write('<h1>Page not found</h1>');
            response.write('<p>Check you typed the right URL or <a href="/">go back to the homepage</a>.</p>');
            response.write('</body></html>');
            response.end();
        };

        console.debug(request.method, request.url);
        Object.keys(routes).forEach(
            function(routePath) {
                var formattedEx = routePath.replace(/\:([\w-]+)/, '([^/]+)');
                var pathEx = new RegExp('^' + formattedEx + '$');
                var matches = requestPath.match(pathEx);
                var args = [];
                var func = routes[routePath];

                if(viewResponse !== false) {
                    return;
                }

                if(matches && matches.length) {
                    for(var i = 1; i < matches.length; i ++) {
                        args.push(matches[i]);
                    }

                    viewResponse = new Promise(
                        function(resolve, reject) {
                            try {
                                func.apply(context, args).then(resolve).catch(reject);
                            } catch(err) {
                                reject(err);
                                return;
                            }
                        }
                    );
                }
            }
        );

        if(viewResponse) {
            viewResponse.then(
                function(r) {
                    response.writeHead(r.code, r.headers);
                    response.write(r.content);
                    response.end();
                }
            ).catch(
                function(err) {
                    response.writeHead(
                        500,
                        {
                            'Content-Type': 'text/html'
                        }
                    );

                    response.write('<html><head>');
                    response.write('<title>Internal server error</title>');
                    response.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
                    response.write('<style>*{line-height:1.2;margin:0}html{color:#888;display:table;font-family:sans-serif;height:100%;text-align:center;width:100%}body{display:table-cell;vertical-align:middle;margin:2em auto}h1{color:#555;font-size:2em;font-weight:400}p{margin:0 auto;width:380px}a{color:inherit}@media only screen and (max-width:280px){body,p{width:95%}h1{font-size:1.5em;margin:0 0 .3em}}</style>');
                    response.write('</head><body>');
                    response.write('<h1>An error occurred while rendering the page.</h1>');
                    response.write('<p>Check your Node console for details.</p>');
                    response.write('<pre>');
                    response.write(err.toString());
                    response.write('</pre>');
                    response.write('</body></html>');
                    response.end();

                    console.error(err);
                }
            );

            return;
        }

        if(requestPath.substr(0, '/static/'.length) == '/static/') {
            var extname = path.extname(requestPath);

            fs.readFile(
                path.join(__dirname, '../' + requestPath),
                'utf8',
                function(err, data) {
                    if(err) {
                        console.error(err);
                        notFound();
                        return;
                    }

                    var contentType = 'application/octet-stream';

                    switch (extname) {
                        case '.js':
                            contentType = 'text/javascript';
                            break;
                        case '.css':
                            contentType = 'text/css';
                            break;
                        case '.png':
                            contentType = 'image/png';
                            break;
                        case '.jpg':
                            contentType = 'image/jpg';
                            break;
                    }

                    response.writeHead(
                        200,
                        {
                            'Content-Type': contentType
                        }
                    );

                    response.write(data);
                    response.end();
                }
            );

            return;
        }

        notFound();
    }
).listen(8000);

console.info();
console.info('Development server now listening at http://0.0.0.0:8000/');
