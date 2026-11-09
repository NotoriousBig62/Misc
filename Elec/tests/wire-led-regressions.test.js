'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
function setup() {
  const drawnText = [], arcs = [], handlers = {};
  const ctx = { setTransform(){}, save(){}, restore(){}, setLineDash(){}, clearRect(){}, strokeRect(){}, beginPath(){}, closePath(){}, moveTo(){}, lineTo(){}, stroke(){}, fill(){}, translate(){}, rotate(){}, fillText(t){drawnText.push(t)}, arc(x,y,r){arcs.push({x,y,r})}, createRadialGradient(){return {addColorStop(){}}} };
  const canvas={clientWidth:850,clientHeight:700,parentElement:{getBoundingClientRect:()=>({width:850,height:700})},getContext:()=>ctx,getBoundingClientRect:()=>({left:0,top:0}),addEventListener:(n,f)=>handlers[n]=f,setPointerCapture(){}};
  const els=new Map(); const element=s=>{if(!els.has(s))els.set(s,{textContent:'',className:'',addEventListener(){},classList:{toggle(){},remove(){}}});return els.get(s)};
  const document={querySelector:s=>s==='#board'?canvas:element(s),querySelectorAll:()=>[],createElement:()=>({style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},appendChild(){},remove(){}})}; const window={addEventListener(){},dispatchEvent(){}};
  const sandbox={window,document,devicePixelRatio:1,performance:{now:()=>1000},requestAnimationFrame:()=>{},Event:function(){}}; const load=file=>vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox,{filename:file});
  load('js/core.js');load('js/solver.js');const S=window.Sim;S.W=20;S.H=12;load('js/ui.js');
  // UI geometry: 39px grid with (35,116) offset.
  const click=(x,y,button=0)=>handlers.pointerdown({clientX:35+x*39,clientY:116+y*39,button,pointerId:1,preventDefault(){}});
  return {S,drawnText,arcs,click,redraw:()=>{drawnText.length=0;arcs.length=0;handlers.pointermove({clientX:35,clientY:116});}};
}
{
  const {S,drawnText,redraw,click}=setup();
  const led=S.add('led',{x:10,y:6});click(9,6);redraw();
  assert.equal(drawnText.includes('↗'),false,'zero-current LED should not show a radiation arrow');
  led.current=.020;redraw();
  assert.equal(drawnText.includes('↗'),true,'current-carrying LED should show a radiation arrow');
  led.current=0;redraw();
  assert.equal(drawnText.includes('↗'),false,'arrow should disappear again at zero current');
  console.log('PASS LED radiation arrow visibility: off at 0 A; on with current');
}
{
  const {S,drawnText,arcs,click,redraw}=setup();
  const battery=S.add('battery',{x:2,y:5}), resistor=S.add('resistor',{x:6,y:5}), led=S.add('led',{x:10,y:5});
  // Start at a terminal, chain from intermediate grid points, and terminate at component terminals.
  click(3,5);click(4,5);click(5,5);
  click(7,5);click(8,5);click(9,5);
  click(11,5);click(12,6);click(12,8);click(1,8);click(1,5);
  assert.equal(S.wires.length,8,'each off-terminal click should end a section and immediately begin the next');
  assert.deepEqual([S.wires[0][0].x,S.wires[0][0].y],[3,5]);
  assert.deepEqual([S.wires[0][1].x,S.wires[0][1].y],[4,5]);
  assert.ok(S.wires.some(w=>w[0].x===4&&w[0].y===5&&w[1].x===5&&w[1].y===5),'grid chaining must retain intermediate point');
  assert.equal(S.wires.at(-1).at(-1).x,1);assert.equal(S.wires.at(-1).at(-1).y,5);
  const result=S.solve();
  assert.ok(led.current>.018&&led.current<.024,`multi-section circuit should conduct about 21mA; got ${led.current*1000}mA`);
  assert.ok(result.current>0,'completed multi-section circuit should conduct');
  // Confirm the shared intermediate grid point is rendered as a junction dot.
  assert.ok(S.wires.some(w=>w[0].x===4&&w[0].y===5)&&S.wires.some(w=>w[1].x===4&&w[1].y===5),'intermediate junction exists across sections');
  click(6,10); // leave a pending section so pointer movement requests a canvas redraw
  redraw();
  const junctionArc=arcs.some(a=>Math.abs(a.x-(35+4*39))<1&&Math.abs(a.y-(116+5*39))<1&&a.r>=6);
  assert.ok(junctionArc,'shared intermediate point should be rendered with a visible junction marker');
  console.log(`PASS chained wires: ${S.wires.length} sections; LED current ${(led.current*1000).toFixed(2)} mA`);
}
