const yaml = require('js-yaml');
const fs   = require('fs');

function load_config(filename) {
  try {
    const cfg = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
    return cfg;
  } catch (e) {
    console.log(e);
  }
}

function build_settings(cfg) {
  let settings = {"loads": []};
  for(let i = 0; i < cfg.loads.length; i++) {
    if (cfg.loads[i].hasOwnProperty('mass')) {
      settings.loads.push({'mass': cfg.loads[i].mass.default})
    } else if (cfg.loads[i].hasOwnProperty('volume')) {
      settings.loads.push({'volume': cfg.loads[i].volume.default})
    } else {
      settings.loads.push({});
    }
  }
  console.log(settings);
  return settings;
}

function calculate_cg() {

}

exports.load_config = load_config;
exports.build_settings = build_settings;