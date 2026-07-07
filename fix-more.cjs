const fs = require('fs');
const path = require('path');

const uiFile = path.join(__dirname, 'src', 'components', 'ui.tsx');
let uiContent = fs.readFileSync(uiFile, 'utf8');
if (!uiContent.includes('import React')) {
  uiContent = 'import React from "react";\n' + uiContent;
}
fs.writeFileSync(uiFile, uiContent);

const scFile = path.join(__dirname, 'src', 'components', 'SchoolSelector.tsx');
let scContent = fs.readFileSync(scFile, 'utf8');
scContent = scContent.replace(/,\s*School\s*}/, '}');
fs.writeFileSync(scFile, scContent);

const cFile = path.join(__dirname, 'src', 'lib', 'calculations.ts');
let cContent = fs.readFileSync(cFile, 'utf8');
cContent = cContent.replace(/,\s*StudentRow\s*}/, '}');
fs.writeFileSync(cFile, cContent);

const tFile = path.join(__dirname, 'src', 'tests', 'calculations.test.ts');
let tContent = fs.readFileSync(tFile, 'utf8');
tContent = tContent.replace(/,\s*SubjectAttempt\s*}/, '}');
fs.writeFileSync(tFile, tContent);

console.log('Fixed stuff');
