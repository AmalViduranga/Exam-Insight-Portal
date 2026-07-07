const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace type imports for our types
  content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]([^'"]*types)['"]/g, (match, p1, p2) => {
    return `import type { ${p1.trim()} } from "${p2}"`;
  });

  // Remove unused React import if present
  content = content.replace(/import\s+React(,\s*{[^}]+})?\s+from\s+['"]react['"];?/g, (match, p1) => {
    if (p1) {
      return `import ${p1.replace(/^,\s*/, '')} from "react";`;
    }
    return '';
  });

  fs.writeFileSync(file, content);
});
console.log('Fixed imports');
