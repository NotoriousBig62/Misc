(function(){'use strict';const S=window.S;
function gaussian(A,b){const n=b.length;for(let k=0;k<n;k++){let p=k;for(let i=k+1;i<n;i++)if(Math.abs(A[i][k])>Math.abs(A[p][k]))p=i;if(Math.abs(A[p][k])<1e-14)continue;[A[k],A[p]]=[A[p],A[k]];[b[k],b[p]]=[b[p],b[k]];let v=A[k][k];for(let j=k;j<n;j++)A[k][j]/=v;b[k]/=v;for(let i=0;i<n;i++)if(i!==k){v=A[i][k];if(!v)continue;for(let j=k;j<n;j++)A[i][j]-=v*A[k][j];b[i]-=v*b[k]}}return b}
S.solve=function(){S.parts.forEach(c=>{c.current=0;c.lit=0});const bats=S.parts.filter(c=>c.kind==='battery');if(!bats.length)return {voltage:0,current:0};
// Conductive wires merge into electrical nodes; crossings at grid intersections connect.
const parent=new Map(),key=p=>p.x+','+p.y,find=x=>{if(!parent.has(x))parent.set(x,x);if(parent.get(x)!==x)parent.set(x,find(parent.get(x)));return parent.get(x)},join=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent.set(a,b)};
S.wires.forEach(path=>{for(let i=0;i<path.length;i++)find(key(path[i]));for(let i=1;i<path.length;i++)join(key(path[i-1]),key(path[i]))});S.parts.forEach(c=>{find(key(S.term(c,0)));find(key(S.term(c,1)))});
const ed=S.parts.map(c=>({c,a:find(key(S.term(c,0))),b:find(key(S.term(c,1)))}));
// Keep only the connected electrical island containing a battery.
const adj=new Map();ed.forEach(e=>{if(!adj.has(e.a))adj.set(e.a,[]);if(!adj.has(e.b))adj.set(e.b,[]);adj.get(e.a).push(e.b);adj.get(e.b).push(e.a)});
const seed=ed.filter(e=>e.c.kind==='battery').flatMap(e=>[e.a,e.b]),live=new Set(seed),q=seed.slice();while(q.length){for(const n of adj.get(q.shift())||[])if(!live.has(n)){live.add(n);q.push(n)}}
const ns=[...live],ref=ed.find(e=>e.c.kind==='battery').b,ids=new Map();let n=0;ns.forEach(k=>{if(k!==ref)ids.set(k,n++)});const leds=ed.filter(e=>e.c.kind==='led'&&live.has(e.a)&&live.has(e.b));let on=new Set();let voltage=new Map();
for(let pass=0;pass<leds.length+3;pass++){const A=Array.from({length:n},()=>Array(n).fill(0)),b=Array(n).fill(0);function branch(a,z,r,offset=0){if(!Number.isFinite(r)||r<=0)return;const g=1/r,i=ids.get(a),j=ids.get(z);if(i!==undefined)A[i][i]+=g;if(j!==undefined)A[j][j]+=g;if(i!==undefined&&j!==undefined){A[i][j]-=g;A[j][i]-=g}if(i!==undefined)b[i]+=g*offset;if(j!==undefined)b[j]-=g*offset}
// Weak reference prevents singular matrices for open/isolated branches; no perceptible current.
for(let i=0;i<n;i++)A[i][i]+=1e-9;
for(const e of ed){if(!live.has(e.a)||!live.has(e.b))continue;const c=e.c;if(c.kind==='battery'){branch(e.a,e.b,S.spec.battery.r,9);continue}if(c.kind==='led'){if(on.has(c.id))branch(e.a,e.b,1,2);continue}if(c.kind==='switch'&&!c.closed)continue;branch(e.a,e.b,S.spec[c.kind].r)}
const x=gaussian(A,b);voltage=new Map([[ref,0]]);ids.forEach((i,k)=>voltage.set(k,x[i]));let changed=false;for(const e of leds){const f=(voltage.get(e.a)||0)-(voltage.get(e.b)||0)>2;if(f!==on.has(e.c.id)){f?on.add(e.c.id):on.delete(e.c.id);changed=true}}if(!changed)break}
let current=0;for(const e of ed){const c=e.c,va=voltage.get(e.a)||0,vb=voltage.get(e.b)||0;if(c.kind==='battery'){const i=(9-(va-vb))/S.spec.battery.r;current+=Math.abs(i);c.current=Math.abs(i)}else if(c.kind==='led'){c.current=on.has(c.id)?Math.max(0,(va-vb-2)/1):0;c.burnt=c.current>.03;c.lit=c.burnt?0:c.current}else if(c.kind==='switch'&&c.closed)c.current=Math.abs((va-vb)/S.spec.switch.r);else if(c.kind!=='switch')c.current=Math.abs((va-vb)/S.spec[c.kind].r);if(c.kind==='lamp')c.lit=c.current}
return{voltage:9,current:Math.max(0,current),nodes:voltage};};
})();