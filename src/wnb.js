const yaml = require('js-yaml');
const fs   = require('fs');

function load(filename) {
  try {
    const doc = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
    return doc;
  } catch (e) {
    console.log(e);
  }
}

exports.load = load;
