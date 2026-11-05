(function(){'use strict';const S=window.Sim={W:12,H:8,cell:48,parts:[],wires:[],tool:'wire',selected:null,drag:null,dirty:true,seq:1};
S.spec={battery:{label:'Pile',icon:'＋ −',r:.1},lamp:{label:'Ampoule',icon:'◉',r:24},led:{label:'LED',icon:'▷',r:1},resistor:{label:'Résistance',icon:'▱',r:330},switch:{label:'Interrupteur',icon:'⌁',r:.02}};
S.term=(c,i)=>{const d=[[1,0],[0,1],[-1,0],[0,-1]][((c.rot||0)%4+4)%4];return{x:c.x+(i?1:-1)*d[0],y:c.y+(i?1:-1)*d[1]}};
S.snap=p=>({x:Math.max(0,Math.min(S.W,Math.round(p.x))),y:Math.max(0,Math.min(S.H,Math.round(p.y)))});
S.add=(kind,p)=>{const c={id:S.seq++,kind,x:Math.max(1,Math.min(S.W-1,p.x)),y:Math.max(1,Math.min(S.H-1,p.y)),rot:0,closed:true,current:0,burnt:false};S.parts.push(c);S.selected=null;S.dirty=true;return c};
S.touch=()=>{S.dirty=true;window.dispatchEvent(new Event('circuit-change'))};
})();
