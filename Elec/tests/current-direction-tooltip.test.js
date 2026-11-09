'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),handlers={},els=new Map();
const ctx={setTransform(){},save(){},restore(){},setLineDash(){},clearRect(){},strokeRect(){},beginPath(){},closePath(){},moveTo(){},lineTo(){},stroke(){},fill(){},arc(){},translate(){},rotate(){},fillText(){},createRadialGradient(){return{addColorStop(){}}}};
const canvas={clientWidth:850,clientHeight:700,parentElement:{getBoundingClientRect:()=>({width:850,height:700})},getContext:()=>ctx,getBoundingClientRect:()=>({left:0,top:0}),addEventListener:(n,f)=>handlers[n]=f,setPointerCapture(){}};
function el(s){if(!els.has(s))els.set(s,{textContent:'',hidden:true,style:{},className:'',addEventListener(){},classList:{toggle(){},remove(){},add(){}},appendChild(){},replaceChildren(){},setAttribute(){}});return els.get(s)}
const document={querySelector:s=>s==='#board'?canvas:el(s),querySelectorAll:()=>[],createElement:()=>({style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},appendChild(){},replaceChildren(){},setAttribute(){},remove(){}})};
const window={addEventListener(){},dispatchEvent(){}};const sandbox={window,document,devicePixelRatio:1,performance:{now:()=>1000},requestAnimationFrame(){},Event:function(){}};
const load=f=>vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),sandbox,{filename:f});
// Follow the script sequence declared by the page.
const html=fs.readFileSync(path.join(root,'elec.html'),'utf8');const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(x=>x[1]);assert.deepEqual(scripts,['js/core.js','js/solver.js','js/ui.js','js/learning.js','js/main.js']);scripts.forEach(load);
const S=window.Sim;S.W=20;S.H=12;const bat=S.add('battery',{x:2,y:5}),lamp=S.add('lamp',{x:6,y:5});const t=(c,i)=>S.term(c,i);
// Both wires deliberately drawn against current direction: + terminal to lamp, lamp to − terminal.
S.wires.push([t(lamp,0),{x:5,y:3},{x:3,y:3},t(bat,1)],[t(bat,0),{x:1,y:8},{x:7,y:8},t(lamp,1)]);S.solve();
const paths=S.currentDirectedPaths();assert.ok(lamp.current>0.14&&lamp.current<0.16,`expected conducting lamp, got ${lamp.current}`);
const k=p=>`${p.x},${p.y}`, orientations=Array.from(S.wires,w=>{const path=paths.find(p=>p.some(q=>k(q)===k(w[0]))&&p.some(q=>k(q)===k(w.at(-1))));assert.ok(path,'connected wire must have animated path');return [k(path[0]),k(path.at(-1))]});
assert.deepEqual(orientations,[[k(t(bat,1)),k(t(lamp,0))],[k(t(lamp,1)),k(t(bat,0))]],'wire particle direction must follow the solved battery-to-lamp current, not draw orientation');
const tip=el('#componentTooltip'),point=(x,y)=>({clientX:35+x*39,clientY:116+y*39});handlers.pointermove(point(6,5));assert.equal(tip.hidden,false,'component hover should show tooltip');handlers.pointermove(point(15,10));assert.equal(tip.hidden,true,'moving off a component should immediately hide tooltip');handlers.pointermove(point(6,5));handlers.pointerdown({...point(6,5),button:0,pointerId:1});assert.equal(tip.hidden,true,'mousedown must hide tooltip');handlers.pointerup({});handlers.pointermove(point(6,5));handlers.pointerleave();assert.equal(tip.hidden,true,'pointerleave must hide tooltip');
console.log('PASS current direction for oppositely drawn series wires; tooltip hover/move/down/leave dismissal');