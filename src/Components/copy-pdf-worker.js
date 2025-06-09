const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.js');
const destPath = path.resolve(__dirname, 'public/pdf.worker.min.js');

fs.copyFile(srcPath, destPath, (err) => {
  if (err) {
    console.error('Error copying pdf.worker.min.js:', err);
  } else {
    console.log('pdf.worker.min.js copied to public folder successfully.');
  }
});
