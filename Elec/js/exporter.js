(function(){
  'use strict';
  const S=window.Sim;
  if(!S)return;
  const labels={battery:'Pile',lamp:'Ampoule',led:'LED',resistor:'Résistance',switch:'Interrupteur'};
  const resistanceOf=c=>c.kind==='battery'?1:(S.spec[c.kind]?S.spec[c.kind].r:null);
  const terminalAt=point=>{
    for(const c of S.parts)for(let i=0;i<2;i++){
      const t=S.term(c,i);
      if(t.x===point.x&&t.y===point.y)return{componentId:c.id,terminal:i===0?'borne1':'borne2'};
    }
    return null;
  };
  window.serializeCircuit=function(){return{
    composants:S.parts.map(c=>({id:c.id,type:labels[c.kind]||c.kind,position:{x:c.x,y:c.y},rotation:((c.rot||0)%4)*90,valeurs:{tensionV:Math.abs(c.voltageDrop||0),courantA:c.current||0,resistanceOhm:resistanceOf(c)},...(c.kind==='switch'?{interrupteur:{ferme:!!c.closed}}:{})})),
    fils:S.wires.map((wire,index)=>({id:index+1,points:wire.map(p=>({x:p.x,y:p.y})),bornes:[wire.length?terminalAt(wire[0]):null,wire.length?terminalAt(wire[wire.length-1]):null],sections:wire.slice(1).map((to,i)=>({de:{x:wire[i].x,y:wire[i].y},vers:{x:to.x,y:to.y}}))})),
    interrupteurPresent:S.parts.some(c=>c.kind==='switch')?S.parts.filter(c=>c.kind==='switch').map(c=>({id:c.id,ferme:!!c.closed})):null
  }};
  const style=document.createElement('style');
  style.textContent='.export-json-trigger{width:100%;margin-top:8px;padding:10px 12px;border:1px solid #83a95f;border-radius:9px;background:#b7e67d;color:#142019;font:700 12px system-ui;cursor:pointer}.export-json-trigger:hover,.export-json-copy:hover{background:#c9f29a}.export-json-overlay{position:fixed;inset:0;z-index:20;display:grid;place-items:center;padding:20px;background:#07100ed9;backdrop-filter:blur(7px)}.export-json-overlay[hidden]{display:none}.export-json-panel{width:min(720px,100%);padding:22px;border:1px solid #40544a;border-radius:16px;background:linear-gradient(150deg,#1d2b2b,#111b1c);box-shadow:0 28px 80px #0009;color:#e9eee6;font:15px/1.5 system-ui}.export-json-heading,.export-json-footer{display:flex;align-items:center;justify-content:space-between;gap:12px}.export-json-heading small,.export-json-footer{color:#9eafa8;font:10px ui-monospace,monospace}.export-json-heading small{color:#b7e67d;letter-spacing:.14em}.export-json-heading h2{margin:5px 0 0;font-size:22px}.export-json-panel>p{color:#9eafa8;font-size:12px;margin:9px 0 13px}.export-json-panel textarea{display:block;width:100%;height:min(52vh,410px);resize:vertical;padding:14px;border:1px solid #30443b;border-radius:10px;background:#0d1616;color:#cde5d1;font:12px/1.6 ui-monospace,monospace}.export-json-close,.export-json-copy{padding:9px 18px;border:1px solid #9bc96b;border-radius:8px;background:#b7e67d;color:#142019;font-weight:700;cursor:pointer}.export-json-close{padding:3px 10px;font-size:22px}.export-json-footer{margin-top:13px}.export-json-trigger:focus-visible,.export-json-copy:focus-visible,.export-json-close:focus-visible{outline:2px solid #83d4d0;outline-offset:3px}@media(max-width:700px){.export-json-panel{padding:17px}.export-json-panel textarea{height:55vh}}';
  document.head.appendChild(style);
  const palette=document.querySelector('.palette');
  if(!palette)return;
  palette.insertAdjacentHTML('beforeend','<button id="exportJsonBtn" class="export-json-trigger" type="button">⇩ Exporter JSON</button>');
  document.body.insertAdjacentHTML('beforeend','<div id="exportJsonPanel" class="export-json-overlay" hidden role="dialog" aria-modal="true" aria-labelledby="exportJsonTitle"><section class="export-json-panel"><div class="export-json-heading"><div><small>ÉTAT DU MONTAGE</small><h2 id="exportJsonTitle">Exporter en JSON</h2></div><button id="closeExportJson" class="export-json-close" type="button" aria-label="Fermer">×</button></div><p>Instantané du circuit actuel, sans historique d’actions.</p><textarea id="exportJsonText" readonly spellcheck="false" aria-label="Export JSON du circuit"></textarea><div class="export-json-footer"><span>Lecture seule · JSON formaté</span><button id="copyExportJson" class="export-json-copy" type="button">Copier</button></div></section></div>');
  const button=document.querySelector('#exportJsonBtn'),panel=document.querySelector('#exportJsonPanel'),textarea=document.querySelector('#exportJsonText'),close=document.querySelector('#closeExportJson'),copy=document.querySelector('#copyExportJson');
  button.addEventListener('click',()=>{textarea.value=JSON.stringify(window.serializeCircuit(),null,2);panel.hidden=false;textarea.focus();textarea.select()});
  close.addEventListener('click',()=>{panel.hidden=true;button.focus()});
  panel.addEventListener('click',e=>{if(e.target===panel)panel.hidden=true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){panel.hidden=true;button.focus()}});
  copy.addEventListener('click',async()=>{textarea.select();try{await navigator.clipboard.writeText(textarea.value)}catch(_){document.execCommand('copy')}copy.textContent='Copié !';window.setTimeout(()=>{copy.textContent='Copier'},1400)});
})();