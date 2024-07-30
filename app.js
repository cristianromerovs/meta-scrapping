const https = require('https');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const domain = 'www.entel.cl';

fs.readFile('rutas.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }
  const routes = data.split('\n').map(route => route.trim());

  routes.forEach((route, index) => {
    const fullUrl = `https://${domain}${route}`;
    https.get(fullUrl, (response) => {
      let rawData = '';
      response.on('data', (chunk) => {
        rawData += chunk;
      });
      response.on('end', () => {
        try {
          const dom = new JSDOM(rawData);
          const title = dom.window.document.querySelector('title') ? dom.window.document.querySelector('title').textContent : 'No title';
          const metaDescription = dom.window.document.querySelector('meta[name="description"]') ? dom.window.document.querySelector('meta[name="description"]').getAttribute('content') : 'No description';
          //console.log(`Ruta: ${fullUrl}, Title: ${title}, Description: ${metaDescription}`);
          console.log(`${title}`);
        } catch (e) {
          console.error(`Error procesando ${fullUrl}: ${e.message}`);
        }
      });
    }).on('error', (error) => {
      console.error(`Error al intentar acceder a ${fullUrl}: ${error.message}`);
    });
  });
});
