const yaml = require('js-yaml');
const fs   = require('fs');
var inside = require('point-in-polygon');

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
    load = cfg.loads[i]
    if (load.hasOwnProperty('mass')) {
      new_load = load;
      new_load.mass.current_value = new_load.mass.default;
      settings.loads.push(new_load);
    } else if (load.hasOwnProperty('volume')) {
      new_load = load;
      new_load.volume.current_value = new_load.volume.default;
      settings.loads.push(new_load);
    } else {
      settings.loads.push({});
    }
  }
  return settings;
}

function calculate_cg(settings) {
  total_mass = 0.0;
  total_moment = 0.0;

  for(let i = 0; i < settings.loads.length; i++) {
    load = cfg.loads[i]
    if (load.hasOwnProperty('mass')) {
      mass = load.mass.current_value;
    } else if (load.hasOwnProperty('volume')) {
      mass = load.volume.current_value * settings.constants.liquids[load.liquid].density;
    }
    total_mass += mass;
    moment = mass * load.lever_arm;
    total_moment += moment;
  }
  lever_arm = total_moment / total_mass;
  return {'mass': total_mass, 'lever_arm': lever_arm, 'moment': total_moment};
}

function inside_centrogram(G, centrogram) {
  polygon = []
  centrogram.forEach(function(pt) {
    polygon.push([pt.lever_arm, pt.mass]); 
  });
  return inside([G.lever_arm, G.mass], polygon);
}

exports.load_config = load_config;
exports.build_settings = build_settings;
exports.calculate_cg = calculate_cg;
exports.inside_centrogram = inside_centrogram;
