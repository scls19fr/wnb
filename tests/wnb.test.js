const wnb = require('../src/wnb');

test('load sample config', () => {
    cfg = wnb.load('./data/f-bubk.yml');
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

    for(let i = 0; i < cfg.centrogram.length; i++) {
        expect(cfg.centrogram[i].designation).toBe('Pt' + (i + 1));
    }
    expect(cfg.centrogram[0].designation).toBe('Pt1');
    expect(cfg.centrogram[0].mass).toBe(250);
    expect(cfg.centrogram[0].lever_arm).toBe(0.8);
    
});
