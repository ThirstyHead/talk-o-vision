const fs = require('fs-extra');
const path = require('path');

if(process.argv.length <= 2){
  console.log('USAGE: npm run addlang en-us');
  process.exit(1);
}

const langDir = process.argv[2];
const rootDir = 'slides';
const srcDir = path.join(rootDir, 'en-us');
const destDir = path.join(rootDir, langDir);

fs.copy(srcDir, destDir, (err) => {
  if(err) throw err;
  console.log(`Created ${destDir}`);
});

