'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

function makeCircuit(rotation) {
  const gradients = [];
  const context2d = {
    setTransform() {}, save() {}, restore() {}, setLineDash() {}, clearRect() {},
    strokeRect() {}, beginPath() {}, closePath() {}, moveTo() {}, lineTo() {},
    stroke() {}, fill() {}, arc() {}, translate() {}, rotate() {}, fillText() {},
    createRadialGradient() {
      const gradient = { addColorStop() {} };
      gradients.push(gradient);
      return gradient;
    }
  };
  const canvas = {
    width: 0, height: 0, clientWidth: 850, clientHeight: 700,
    parentElement: { getBoundingClientRect: () => ({ width: 850, height: 700 }) },
    getContext: () => context2d,
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
    addEventListener() {}, setPointerCapture() {}
  };
  const elements = new Map();
  const element = (selector) => {
    if (!elements.has(selector)) elements.set(selector, {
      textContent: '', className: '', addEventListener() {},
      classList: { toggle() {}, remove() {} }
    });
    return elements.get(selector);
  };
  const document = {
    querySelector: (selector) => selector === '#board' ? canvas : element(selector),
    querySelectorAll: () => [], createElement: () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, addEventListener() {}, appendChild() {}, remove() {} })
  };
  const window = { addEventListener() {}, dispatchEvent() {} };
  const sandbox = { window, document, devicePixelRatio: 1, Event: function Event() {} };
  const load = (file) => vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox, { filename: file });
  load('js/core.js');
  load('js/solver.js');
  const S = window.Sim;
  S.W = 20; S.H = 12;
  const battery = S.add('battery', { x: 2, y: 6 });
  const resistor = S.add('resistor', { x: 6, y: 6 });
  const led = S.add('led', { x: 10, y: 6 });
  led.rot = rotation;
  const term = (component, index) => S.term(component, index);
  const batNeg = term(battery, 0), batPos = term(battery, 1);
  const resIn = term(resistor, 0), resOut = term(resistor, 1);
  const anode = term(led, 0), cathode = term(led, 1);
  S.wires.push([batPos, resIn]);
  const positiveRoute = [
    [resOut, anode],
    [resOut, { x: 7, y: 4 }, { x: 10, y: 4 }, anode],
    [resOut, { x: 7, y: 4 }, { x: 11, y: 4 }, anode],
    [resOut, { x: 8, y: 6 }, { x: 8, y: 8 }, { x: 10, y: 8 }, anode]
  ][rotation];
  const negativeRoute = [
    [cathode, { x: 12, y: 6 }, { x: 12, y: 9 }, { x: 1, y: 9 }, batNeg],
    [cathode, { x: 12, y: 7 }, { x: 12, y: 9 }, { x: 1, y: 9 }, batNeg],
    [cathode, { x: 9, y: 8 }, { x: 1, y: 8 }, batNeg],
    [cathode, { x: 10, y: 4 }, { x: 12, y: 4 }, { x: 12, y: 9 }, { x: 1, y: 9 }, batNeg]
  ][rotation];
  S.wires.push(positiveRoute, negativeRoute);
  return { S, led, gradients, load };
}

for (let rotation = 0; rotation < 4; rotation++) {
  const { S, led, gradients, load } = makeCircuit(rotation);
  const anode = S.term(led, 0), cathode = S.term(led, 1);
  const result = S.solve();
  assert.ok(led.current > 0, `LED rotation ${rotation * 90}° should carry forward current`);
  assert.ok(led.lit > 0, `LED rotation ${rotation * 90}° should be lit`);
  assert.ok(result.current > 0, `series circuit rotation ${rotation * 90}° should carry current`);
  assert.deepEqual([anode.x, anode.y], [10 - [1, 0, -1, 0][rotation], 6 - [0, 1, 0, -1][rotation]], 'terminal 0 (anode) follows component rotation');
  assert.deepEqual([cathode.x, cathode.y], [10 + [1, 0, -1, 0][rotation], 6 + [0, 1, 0, -1][rotation]], 'terminal 1 (cathode) follows component rotation');
  load('js/ui.js');
  assert.ok(gradients.length > 0, `LED rotation ${rotation * 90}° should draw a halo gradient`);
  console.log(`PASS LED ${rotation * 90}°: terminals ${anode.x},${anode.y}→${cathode.x},${cathode.y}; current ${ (led.current * 1000).toFixed(2) } mA; halo drawn`);
}

// Regression for the reported failure: rotate an already-wired LED and keep both wire endpoints attached.
const { S, led } = makeCircuit(0);
S.solve();
const oldCurrent = led.current;
S.rotate(led);
assert.deepEqual([S.wires[1].at(-1).x, S.wires[1].at(-1).y], [S.term(led, 0).x, S.term(led, 0).y], 'positive wire endpoint remains on LED anode after rotation');
assert.deepEqual([S.wires[2][0].x, S.wires[2][0].y], [S.term(led, 1).x, S.term(led, 1).y], 'return wire endpoint remains on LED cathode after rotation');
assert.ok(S.solve().current > 0 && led.current > 0, 'rotating a wired LED preserves the conducting circuit');
console.log(`PASS wired LED rotation: ${oldCurrent.toFixed(5)} A → ${led.current.toFixed(5)} A`);
