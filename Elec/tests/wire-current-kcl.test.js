'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const sandbox={window:{},document:{}};
for(const f of ['core.js','solver.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js',f),'utf8'),sandbox,{filename:f});
const S=sandbox.window.Sim;S.W=20;S.H=12;
const battery=S.add('battery',{x:2,y:6}),sw=S.add('switch',{x:5,y:6}),lampTop=S.add('lamp',{x:8,y:4}),lampBottom=S.add('lamp',{x:8,y:8});
sw.closed=false;const t=(c,i)=>S.term(c,i);
// The two lamp branches and the open switch all bridge the same pair of rails.
S.wires.push(
 [t(battery,0),t(sw,0)],
 [t(sw,1),{x:6,y:4},t(lampTop,0)],
 [t(sw,1),{x:6,y:8},t(lampBottom,0)],
 [t(lampTop,1),{x:10,y:4},{x:10,y:6},{x:10,y:8},t(lampBottom,1)],
 [{x:10,y:8},{x:11,y:9},{x:3,y:9},t(battery,1)]
);
const section=(currents,from,to)=>{for(const wire of currents)for(const s of wire)if((s.from.x===from[0]&&s.from.y===from[1]&&s.to.x===to[0]&&s.to.y===to[1])||(s.from.x===to[0]&&s.from.y===to[1]&&s.to.x===from[0]&&s.to.y===from[1]))return s.current;assert.fail(`missing wire section ${from}—${to}`)};
const open=S.solve();assert.ok(Math.abs(lampTop.current-.14516)<.00002,`upper lamp should be 145.16mA, got ${lampTop.current*1000}mA`);assert.ok(Math.abs(lampBottom.current-.14516)<.00002,`lower lamp should be 145.16mA, got ${lampBottom.current*1000}mA`);
const currents=S.calculateWireCurrents();
// Left vertical feed splits equally, the right rail merges branch currents.
assert.ok(Math.abs(section(currents,[6,4],[6,5])-.14516)<.00002,'upper left vertical wire carries +145.16mA');
assert.ok(Math.abs(section(currents,[6,7],[6,8])-.14516)<.00002,'lower left vertical wire carries +145.16mA');
assert.ok(Math.abs(section(currents,[10,4],[10,5])-.14516)<.00002,'upper right vertical wire carries −145.16mA');
assert.ok(Math.abs(section(currents,[10,7],[10,8])-.14516)<.00002,'lower right vertical wire carries −145.16mA');
assert.ok(Math.abs(section(currents,[10,5],[10,6])-.29032)<.00003,'section between branch joins carries combined current');
assert.ok(Math.abs(section(currents,[10,6],[10,7])-.14516)<.00002,'other inter-branch section carries one branch current');
// Mutating solver output is not required: the function only returns signed sections.
const openAmpCurrent=[lampTop.current,lampBottom.current];sw.closed=true;S.solve();const closed=S.calculateWireCurrents();
assert.ok(S.parts.find(c=>c===sw).current>open.current*10,'closed switch should carry a much larger short-circuit current than the open circuit');
assert.ok(lampTop.current<openAmpCurrent[0]&&lampBottom.current<openAmpCurrent[1],'closed switch shunts both lamps');
assert.ok(closed.flat().every(s=>Number.isFinite(s.current)),'closed short-circuit case yields finite signed wire currents');
console.log(`PASS KCL signed wire currents; open lamps ${(lampTop.current*1000).toFixed(2)} / ${(lampBottom.current*1000).toFixed(2)} mA before closure; closed switch ${sw.current.toFixed(3)} A`);
