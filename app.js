import http from 'http';
import fs from 'fs';
import path from 'path';
import qs from 'query-string'

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
     if(req.method === 'GET') {
          handleGet(req, res);
     } else if (req.method === 'POST'){
          // console.log(req);
          handlePost(req, res);
     } else res.writeHead(405).end(`{"error":"${http.STATUS_CODES[405]}}`);
});

server.listen(port, () => {
     console.log(`listening on port ${port}`);
});

function handleGet(req, res){
     if(req.url == "/") req.url = "/index.html";
     let filePath = 'public' + req.url;

     // console.log(filePath);

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
          case '.svg':
               contentType = 'image/svg+xml';
               break
     }

     fs.readFile(filePath, function(error, content){
          if (error){
               if(error.code == 'ENOENT'){
                    res.writeHead(400);
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

function handlePost(req, res){
     let body = []
     if (req.url != '/rmo'){
         return res.writeHead(404).end();
     }
     req.on('data', (chunk) => {
         body.push(chunk);
     }).on('end', ()=>{
         body = Buffer.concat(body).toString();
         res.on('error',(err)=>{
             console.error(err);
         })
 
         res.writeHead(200,{
             'Content-Type': 'application/json',
         })
         console.log(body);
         const object = qs.parse(body, "&","=");
         console.log(object);
         console.log(Object.keys(object).length);
         if(!object.name || !object.email || !object.mes 
             || Object.keys(object).length != 3) {
             res.writeHead(406).end("Data Not Acceptable");
         }
         writeObj(object,"contact.json");
         res.writeHead(200).end("success");
     })
}

function writeObj(object, file){
     fs.readFile(file, 'utf8', (err, data) => {
         if (err) {
             console.log(err);
         } else {
             let obj = [];
             obj = JSON.parse(data);
             obj.push(object);
             let json = JSON.stringify(obj);
             fs.writeFile(file ,json, 'utf8', err => {
                 if(err)console.log(err);
             })
         }
     })
 }
//  function