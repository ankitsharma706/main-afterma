const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'public', 'locales');
const enPath = path.join(localesDir, 'en', 'translation.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const dirs = ['hi', 'mr', 'or', 'te', 'ta', 'ml'];

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      if (typeof target[key] === 'undefined') {
        result[key] = source[key];
      }
    }
  }
  return result;
}

dirs.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const langData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const mergedData = deepMerge(langData, enData);
    fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2));
    console.log(`Successfully merged ${lang}`);
  }
});
