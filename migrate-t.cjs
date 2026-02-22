const fs = require('fs');
const path = require('path');

try {
  let allFiles = [];
  const componentsDir = path.join(__dirname, 'components');
  const compFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx')).map(f => path.join(componentsDir, f));
  allFiles = allFiles.concat(compFiles);

  const appFile = path.join(__dirname, 'App.jsx');
  if (fs.existsSync(appFile)) allFiles.push(appFile);

  let updatedCount = 0;

  allFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    // Match t.something.something - must have at least one dot after the first word
    const regex = /\bt\.([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)\b/g;

    const newContent = content.replace(regex, "t('$1')");

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${path.basename(filePath)}`);
      updatedCount++;
    }
  });

  console.log(`Successfully updated ${updatedCount} files.`);
} catch (err) {
  console.error("ERROR OCCURRED:", err);
  process.exit(1);
}
