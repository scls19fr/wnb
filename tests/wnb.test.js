const wnb = require('../src/wnb');

test('load sample config', () => {
    cfg = wnb.load_config('./data/f-bubk.yml');
    console.log(cfg);
    expect(cfg.file_format_version).toBe('0.0.1');

    expect(cfg.weight_and_balance.version).toBe('1');
    expect(cfg.weight_and_balance.date).toBe('21/03/2006');

    expect(cfg.aircraft.designation).toBe('Cessna 150');
    expect(cfg.aircraft.type).toBe('C150');
    expect(cfg.aircraft.immat).toBe('F-BUBK');
    expect(cfg.aircraft.owner).toBe('');
    expect(cfg.aircraft.picture).toBe('f-bubk.png');
    expect(cfg.aircraft.comment).toBe('');
    expect(cfg.aircraft.constants.fuel_density).toBe(0.72);

    expect(cfg.centrogram.length).toBe(5);
    for(let i = 0; i < cfg.centrogram.length; i++) {
        expect(cfg.centrogram[i].designation).toBe('Pt' + (i + 1));
    }
    expect(cfg.centrogram[0].designation).toBe('Pt1');
    expect(cfg.centrogram[0].mass).toBe(250);
    expect(cfg.centrogram[0].lever_arm).toBe(0.8);

    expect(cfg.loads.length).toBe(5);
    expect(cfg.loads[0].designation).toBe('Empty aircraft');
    expect(cfg.loads[0].lever_arm).toBe(0.862);
    expect(cfg.loads[0].mass).toStrictEqual({'default': 520});
    expect(cfg.loads[0].comment).toBe('');
    expect(cfg.loads[1].designation).toBe('Pilot');
    expect(cfg.loads[1].lever_arm).toBe(0.993);
    expect(cfg.loads[1].mass).toStrictEqual({'default': 70, 'min': 0, 'max': 150, 'step': 1});
    expect(cfg.loads[1].comment).toBe('');
});

test('build settings', () => {
    cfg = wnb.load_config('./data/f-bubk.yml');
    settings = wnb.build_settings(cfg);
    console.log(settings);
    for(let i = 0; i < cfg.loads.length; i++) {
        if (cfg.loads[i].hasOwnProperty('mass')) {
            expect(settings.loads[i].mass).toBe(cfg.loads[i].mass.default);
        } else if (cfg.loads[i].hasOwnProperty('volume')) {
            expect(settings.loads[i].volume).toBe(cfg.loads[i].volume.default);
        }
    }
});