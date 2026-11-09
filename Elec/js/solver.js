(function(){'use strict';const S=window.Sim;
function gaussian(A,b){const n=b.length;for(let k=0;k<n;k++){let p=k;for(let i=k+1;i<n;i++)if(Math.abs(A[i][k])>Math.abs(A[p][k]))p=i;if(Math.abs(A[p][k])<1e-14)continue;[A[k],A[p]]=[A[p],A[k]];[b[k],b[p]]=[b[p],b[k]];let v=A[k][k];for(let j=k;j<n;j++)A[k][j]/=v;b[k]/=v;for(let i=0;i<n;i++)if(i!==k){v=A[i][k];if(!v)continue;for(let j=k;j<n;j++)A[i][j]-=v*A[k][j];b[i]-=v*b[k]}}return b}
// Return signed conventional current for each unit section of each drawn wire.
// Positive means current follows the wire's stored point order. Ideal-wire loops
// have no unique branch-current solution; a deterministic spanning forest supplies
// one KCL-consistent solution without consulting node potentials.
S.calculateWireCurrents=function(parts=S.parts,wires=S.wires){
 const key=p=>p.x+','+p.y, edges=[], adjacency=new Map(), injections=new Map();
 const add=(a,b,wire,segment)=>{const e={a:key(a),b:key(b),wire,segment,from:{x:a.x,y:a.y},to:{x:b.x,y:b.y},current:0};const id=edges.length;edges.push(e);for(const k of [e.a,e.b]){if(!adjacency.has(k))adjacency.set(k,[]);adjacency.get(k).push(id)}};
 wires.forEach((path,wi)=>{for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],dx=Math.sign(b.x-a.x),dy=Math.sign(b.y-a.y),n=Math.max(Math.abs(b.x-a.x),Math.abs(b.y-a.y));if(!n)continue;if(dx&&dy){add(a,b,wi,i-1);continue}let prev=a;for(let j=1;j<=n;j++){const next={x:a.x+dx*j,y:a.y+dy*j};add(prev,next,wi,i-1);prev=next}}});
 const signedCurrent=c=>{if(!Number.isFinite(c.current)||!c.current)return 0;if(c.kind==='battery')return -Math.abs(c.current);if(c.kind==='led')return Math.sign(c.voltageDrop||0)*Math.abs(c.current);const r=S.spec[c.kind]?.r;return Number.isFinite(r)&&r>0?(c.voltageDrop||0)/r:0};
 const inject=(p,value)=>{const k=key(p);injections.set(k,(injections.get(k)||0)+value)};
 for(const c of parts){const i=signedCurrent(c),t0=S.term(c,0),t1=S.term(c,1);inject(t0,i);inject(t1,-i)}
 const seen=new Set();for(const start of adjacency.keys()){if(seen.has(start))continue;const parent=new Map([[start,null]]),parentEdge=new Map(),order=[start];seen.add(start);for(let q=0;q<order.length;q++){const v=order[q];for(const id of adjacency.get(v)||[]){const e=edges[id],u=e.a===v?e.b:e.a;if(seen.has(u))continue;seen.add(u);parent.set(u,v);parentEdge.set(u,id);order.push(u)}}const subtotal=new Map();for(let i=order.length-1;i>0;i--){const v=order[i],p=parent.get(v),id=parentEdge.get(v),e=edges[id],sum=(subtotal.get(v)||0)+(injections.get(v)||0);e.current=e.a===v?sum:-sum;subtotal.set(p,(subtotal.get(p)||0)+sum)}}
 return wires.map((path,wi)=>edges.filter(e=>e.wire===wi).map(e=>({from:e.from,to:e.to,current:e.current})));
};
S.solve=function(){S.parts.forEach(c=>{c.current=0;c.lit=0;if(c.kind==='led')c.burnt=false});const bats=S.parts.filter(c=>c.kind==='battery');if(!bats.length)return {voltage:0,current:0};
// Conductive wires merge into electrical nodes; crossings at grid intersections connect.
const parent=new Map(),key=p=>p.x+','+p.y,find=x=>{if(!parent.has(x))parent.set(x,x);if(parent.get(x)!==x)parent.set(x,find(parent.get(x)));return parent.get(x)},join=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent.set(a,b)};
// Expand orthogonal wires over every integer grid point so T-junctions and
// shared grid intersections connect even when they fall inside a long segment.
const segments=[];S.wires.forEach(path=>{for(let i=0;i<path.length;i++)find(key(path[i]));for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i];segments.push([a,b]);const dx=Math.sign(b.x-a.x),dy=Math.sign(b.y-a.y),steps=Math.max(Math.abs(b.x-a.x),Math.abs(b.y-a.y));if((dx===0||dy===0)&&steps>0){let prev=key(a);for(let k=1;k<=steps;k++){const here=key({x:a.x+dx*k,y:a.y+dy*k});join(prev,here);prev=here}}else join(key(a),key(b))}});
S.parts.forEach(c=>{for(let i=0;i<2;i++){const t=S.term(c,i),tk=key(t);find(tk);for(const [a,b] of segments){if(a.x===b.x&&t.x===a.x&&t.y>=Math.min(a.y,b.y)&&t.y<=Math.max(a.y,b.y))join(tk,key(t));else if(a.y===b.y&&t.y===a.y&&t.x>=Math.min(a.x,b.x)&&t.x<=Math.max(a.x,b.x))join(tk,key(t))}}});
const ed=S.parts.map(c=>({c,a:find(key(S.term(c,0))),b:find(key(S.term(c,1)))}));ed.forEach(e=>{e.c._nodes=[e.a,e.b]});
// Keep only the connected electrical island containing a battery.
const adj=new Map();ed.forEach(e=>{if(!adj.has(e.a))adj.set(e.a,[]);if(!adj.has(e.b))adj.set(e.b,[]);adj.get(e.a).push(e.b);adj.get(e.b).push(e.a)});
const seed=ed.filter(e=>e.c.kind==='battery').flatMap(e=>[e.a,e.b]),live=new Set(seed),q=seed.slice();while(q.length){for(const n of adj.get(q.shift())||[])if(!live.has(n)){live.add(n);q.push(n)}}
const ns=[...live],ref=ed.find(e=>e.c.kind==='battery').b,ids=new Map();let n=0;ns.forEach(k=>{if(k!==ref)ids.set(k,n++)});const leds=ed.filter(e=>e.c.kind==='led'&&live.has(e.a)&&live.has(e.b));let on=new Set(leds.map(e=>e.c.id));let voltage=new Map();
for(let pass=0;pass<10;pass++){const A=Array.from({length:n},()=>Array(n).fill(0)),b=Array(n).fill(0);function branch(a,z,r,offset=0){if(!Number.isFinite(r)||r<=0)return;const g=1/r,i=ids.get(a),j=ids.get(z);if(i!==undefined)A[i][i]+=g;if(j!==undefined)A[j][j]+=g;if(i!==undefined&&j!==undefined){A[i][j]-=g;A[j][i]-=g}if(i!==undefined)b[i]+=g*offset;if(j!==undefined)b[j]-=g*offset}
// Weak reference prevents singular matrices for open/isolated branches; no perceptible current.
for(let i=0;i<n;i++)A[i][i]+=1e-9;
for(const e of ed){if(!live.has(e.a)||!live.has(e.b))continue;const c=e.c;if(c.kind==='battery'){branch(e.a,e.b,S.spec.battery.r,-9);continue}if(c.kind==='led'){if(on.has(c.id))branch(e.a,e.b,1,2);continue}if(c.kind==='switch'&&!c.closed)continue;branch(e.a,e.b,S.spec[c.kind].r)}
const x=gaussian(A,b);voltage=new Map([[ref,0]]);ids.forEach((i,k)=>voltage.set(k,x[i]));let changed=false;for(const e of leds){const f=(voltage.get(e.a)||0)-(voltage.get(e.b)||0)>2;if(!f&&on.delete(e.c.id))changed=true}if(!changed)break}
let current=0;for(const e of ed){const c=e.c,va=voltage.get(e.a)||0,vb=voltage.get(e.b)||0;if(c.kind==='battery'){const i=(9+(va-vb))/S.spec.battery.r;current+=Math.abs(i);c.current=Math.abs(i)}else if(c.kind==='led'){c.current=on.has(c.id)?Math.max(0,(va-vb-2)/1):0;c.burnt=c.current>.05;c.lit=Math.min(c.current,.03)/.03}else if(c.kind==='switch'&&c.closed)c.current=Math.abs((va-vb)/S.spec.switch.r);else if(c.kind!=='switch')c.current=Math.abs((va-vb)/S.spec[c.kind].r);if(c.kind==='lamp')c.lit=Math.min(c.current/.15,1.5)}
const nodeVoltages=new Map();for(const k of parent.keys())nodeVoltages.set(k,voltage.get(find(k))||0);ed.forEach(e=>{e.c.voltageDrop=(voltage.get(e.a)||0)-(voltage.get(e.b)||0)});S.nodeVoltages=nodeVoltages;return{voltage:9,current:Math.max(0,current),nodes:voltage};};
})();