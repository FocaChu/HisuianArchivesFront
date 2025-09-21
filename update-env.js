const fs = require('fs');
const http = require('http');

const environmentFilePath = './src/environments/environment.ts';
const ngrokApiUrl = 'http://localhost:4040/api/tunnels';

function getNgrokUrl() {
  return new Promise((resolve, reject) => {
    http.get(ngrokApiUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(`Error: ngrok does not seem to be running or its API failed. Status: ${res.statusCode}`);
      }
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const httpsTunnel = JSON.parse(rawData).tunnels.find(t => t.proto === 'https');
          if (httpsTunnel) {
            resolve(httpsTunnel.public_url);
          } else {
            reject('Error: No ngrok HTTPS tunnel was found.');
          }
        } catch (e) {
          reject('Error: Failed to parse ngrok response.');
        }
      });
    }).on('error', (err) => {
      reject(`Connection error with ngrok. Make sure it is running. Details: ${err.message}`);
    });
  });
}

async function main() {
  console.log('Starting ngrok URL update...');
  try {
    const publicUrl = await getNgrokUrl();
    console.log(`Public URL found: ${publicUrl}`);

    console.log(`Reading environment file: ${environmentFilePath}`);
    let fileContent = fs.readFileSync(environmentFilePath, 'utf8');

    const apiUrlRegex = /apiUrl: '.*'/g;
    const baseUrlRegex = /baseUrl: '.*'/g;

    const newApiUrlLine = `apiUrl: '${publicUrl}/api'`;
    const newBaseUrlLine = `baseUrl: '${publicUrl}'`;

    console.log('🔄 Replacing URLs in the file...');
    fileContent = fileContent.replace(apiUrlRegex, newApiUrlLine);
    fileContent = fileContent.replace(baseUrlRegex, newBaseUrlLine);

    fs.writeFileSync(environmentFilePath, fileContent, 'utf8');
    console.log('Environment file updated successfully!');
    console.log('All set for deploy!');

  } catch (error) {
    console.error('ERROR DURING SCRIPT EXECUTION:');
    console.error(error);
    process.exit(1);
  }
}

main();