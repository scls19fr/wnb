const wnb = require('../src/wnb');

test('adds 1 + 2 to equal 3', () => {
  expect(wnb.sum(1, 2)).toBe(3);
});