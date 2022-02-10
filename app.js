import http from 'http';
import fs from 'fs';
import path from 'path';

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
     if(req.method === 'GET') {
          handleGet(req, res);
     } else if (req.method === 'POST'){
          handlePost(req, res);
     } else res.writeHead(405).end(`{"error":"${http.STATUS_CODES[405]}}`);
});

server.listen(port, () => {
     console.log(`listening on port ${port}`);
});

function handleGet(req, res){
     if(req.url == "/") req.url = "src/index.html";
     let filePath = '/' + req.url;

     console.log(filePath);

     let extension = path.extname(filePath);
     if(extension == "") filePath += ".html";
     let contentType = 'text/html';

     switch(extension){
          case '.js': 
               contentType = 'text/javascript';
               break;
          case '.css':
               contentType = 'text/css';
               break;
          case '.json':
               contentType = 'application/json';
               break;
          case '.png':
               contentType = 'image/png';
               break;      
          case '.jpg':
               contentType = 'image/jpg';
               break;
          case '.wav':
               contentType = 'audio/wav';
               break;
     }

     fs.readFile(filePath, function(error, content){
          if (error){
               if(error.code == 'ENOENT'){
                    res.writeHead(404);
                    res.end();
               } else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    res.end();
               }
          } else {
               res.writeHead(200, {'Content-Type': contentType});
               res.end(content, 'utf-8');
          }
     })
}