(function () {
  'use strict';
  const S = window.Sim, $ = s => document.querySelector(s);
  const steps = [
    { title: 'Mon premier circuit', instruction: 'Relie une ampoule à la pile et ferme la boucle.', hint: 'Chaque borne de la pile doit rejoindre une borne différente de l’ampoule.', learn: 'Le courant ne circule que si le circuit est fermé : il faut une boucle ininterrompue qui part de la borne + de la pile, traverse l’ampoule et revient à la borne −.', check: c => c.lamps.some(x => x.lit > 0) },
    { title: 'Plus de courant', instruction: 'Fais passer le courant délivré à plus de 200 mA.', hint: 'Chaque ampoule ajoutée sur sa propre branche (en parallèle) demande son propre courant : les courants s’additionnent.', learn: 'Le courant total délivré par la pile est la somme des courants de chaque branche. Plus il y a de chemins en parallèle, plus la pile débite.', check: c => c.lamps.some(x => x.lit > 0) && c.mA > 200 },
    { title: 'Deux ampoules en série', instruction: 'Ajoute une deuxième ampoule dans la même boucle.', hint: 'En série, le même courant traverse les deux ampoules : il baisse sous 100 mA.', learn: 'Dans un circuit en série, le même courant traverse chaque composant. Les résistances s’ajoutent, donc la résistance totale augmente et le courant baisse.', check: c => c.lamps.length === 2 && c.lamps.every(x => x.lit > 0) && c.seriesLamps && c.mA < 100 },
    { title: 'Deux ampoules en parallèle', instruction: 'Crée deux branches, avec une ampoule sur chaque branche.', hint: 'En parallèle, chacune garde sa luminosité et le courant total augmente.', learn: 'En parallèle, chaque branche est un chemin indépendant et reçoit le courant. Les courants des branches s’additionnent pour donner le courant total.', check: c => c.parallelLampCount >= 2 },
    { title: 'Lire le courant', instruction: 'Fais passer le courant délivré entre 150 et 250 mA.', hint: 'Ajoute ou retire une branche en parallèle pour ajuster le courant total.', learn: 'Le courant délivré est le courant total fourni par la pile. Ajouter ou retirer une branche parallèle permet de le faire varier.', check: c => c.lamps.some(x => x.lit > 0) && c.mA >= 150 && c.mA <= 250 },
    { title: 'Défi précis', instruction: 'Règle le courant entre 400 et 450 mA.', hint: 'Trois ampoules en parallèle approchent 442 mA.', learn: 'Chaque branche parallèle apporte son courant au total. Trois ampoules sur des branches distinctes peuvent rapprocher le courant de la cible.', check: c => c.parallelLampCount >= 3 && c.mA >= 400 && c.mA <= 450 },
    { title: 'Interrupteur', instruction: 'Insère un interrupteur, allume le circuit, ouvre-le puis referme-le.', hint: 'Le courant tombe à zéro quand la boucle est ouverte.', learn: 'Un interrupteur ouvert coupe la boucle, donc le courant ne circule plus. En le refermant, le courant peut de nouveau passer.', check: c => c.switchDone },
    { title: 'Résistance en série', instruction: 'Ajoute une résistance à l’ampoule en série.', hint: 'La résistance réduit le courant et la luminosité.', learn: 'Une résistance limite le courant dans le circuit. À tension donnée, la loi d’Ohm I = U/R indique qu’une plus grande résistance donne un courant plus faible.', check: c => c.lamps.some(x => x.lit > 0) && c.resistors.length > 0 && c.mA < 100 && c.seriesLoad },
    { title: 'Plus de résistance, moins de courant', instruction: 'Observe le courant avec une résistance seule en série avec la pile.', hint: 'Plus R est grande, plus I est faible. Une résistance de 330 Ω donne environ 27 mA.', message: 'Plus R est grande, plus I est faible', learn: 'La loi d’Ohm relie tension, courant et résistance : I = U/R. Avec la même pile, augmenter R diminue le courant.', check: c => c.resistors.length === 1 && c.lamps.length === 0 && c.leds.length === 0 && c.switches.length === 0 && c.mA >= 20 && c.mA <= 35 },
    { title: 'Résistances en parallèle', instruction: 'Place deux résistances en parallèle, chacune sur sa branche.', hint: 'Le courant total doit dépasser 1,5 fois le courant d’une seule branche.', learn: 'Des résistances en parallèle créent plusieurs chemins pour le courant. Le courant de chaque branche s’ajoute, ce qui augmente le courant total.', check: c => c.parallelResistorCount >= 2 && c.sumParallelResistorMA > 1.5 * c.minParallelResistorMA },
    { title: 'LED', instruction: 'Protège la LED avec une résistance en série et respecte son sens.', hint: 'Relie la borne positive vers l’anode de la LED, puis reviens à la borne négative.', learn: 'Une LED ne laisse passer le courant que dans son sens : l’anode va vers le + et la cathode vers le −. Une résistance en série protège la LED en limitant le courant.', check: c => c.leds.some(x => x.lit > 0 && !x.burnt) && c.resistors.length > 0 && c.seriesLoad },
    { title: 'Circuit libre', instruction: 'Bravo ! Le parcours est terminé : explore librement.', hint: 'Tu peux continuer à modifier ton circuit.', learn: 'Tu as découvert les boucles fermées, les branches, le courant et les résistances. Essaie maintenant de combiner les composants pour explorer d’autres circuits.', check: () => true }
  ];
  let current = 0;
  const opened = new Set(), litWithSwitch = new Set(), completed = new Set();

  function topology() {
    const parent = new Map(), key = p => p.x + ',' + p.y;
    const find = k => { if (!parent.has(k)) parent.set(k, k); if (parent.get(k) !== k) parent.set(k, find(parent.get(k))); return parent.get(k); };
    const join = (a, b) => { a = find(a); b = find(b); if (a !== b) parent.set(a, b); };
    const segments = [];
    S.wires.forEach(path => { for (const p of path) find(key(p)); for (let i = 1; i < path.length; i++) { const a = path[i - 1], b = path[i]; segments.push([a, b]); const dx = Math.sign(b.x - a.x), dy = Math.sign(b.y - a.y), n = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)); if ((dx === 0 || dy === 0) && n) { let last = key(a); for (let j = 1; j <= n; j++) { const next = key({ x: a.x + dx * j, y: a.y + dy * j }); join(last, next); last = next; } } else join(key(a), key(b)); } });
    S.parts.forEach(c => { for (let i = 0; i < 2; i++) { const t = S.term(c, i), tk = key(t); find(tk); for (const [a, b] of segments) if ((a.x === b.x && t.x === a.x && t.y >= Math.min(a.y, b.y) && t.y <= Math.max(a.y, b.y)) || (a.y === b.y && t.y === a.y && t.x >= Math.min(a.x, b.x) && t.x <= Math.max(a.x, b.x))) join(tk, tk); } });
    const edges = S.parts.map(c => ({ c, a: find(key(S.term(c, 0))), b: find(key(S.term(c, 1))) })), adjacency = new Map();
    edges.forEach(e => { if (e.c.kind === 'switch' && !e.c.closed) return; if (!adjacency.has(e.a)) adjacency.set(e.a, []); if (!adjacency.has(e.b)) adjacency.set(e.b, []); adjacency.get(e.a).push(e.b); adjacency.get(e.b).push(e.a); });
    const batteries = edges.filter(e => e.c.kind === 'battery'), live = new Set(), queue = [];
    batteries.forEach(e => { live.add(e.a); live.add(e.b); queue.push(e.a, e.b); });
    while (queue.length) for (const n of adjacency.get(queue.shift()) || []) if (!live.has(n)) { live.add(n); queue.push(n); }
    const liveEdges = edges.filter(e => live.has(e.a) && live.has(e.b));
    const grouped = kind => { const groups = new Map(); liveEdges.filter(e => e.c.kind === kind && e.c.current > 1e-6 && (kind !== 'lamp' || e.c.lit > 0)).forEach(e => { const pair = [e.a, e.b].sort().join('|'); if (!groups.has(pair)) groups.set(pair, []); groups.get(pair).push(e.c); }); return [...groups.values()].filter(group => group.length >= 2); };
    const lampGroups = grouped('lamp'), resistorGroups = grouped('resistor');
    const lamps = liveEdges.filter(e => e.c.kind === 'lamp' && e.c.lit > 0).map(e => e.c);
    const resistors = liveEdges.filter(e => e.c.kind === 'resistor' && e.c.current > 1e-6).map(e => e.c);
    const leds = liveEdges.filter(e => e.c.kind === 'led').map(e => e.c), switches = S.parts.filter(c => c.kind === 'switch');
    const degree = new Map(); liveEdges.forEach(e => { if (e.c.kind === 'switch' && !e.c.closed) return; degree.set(e.a, (degree.get(e.a) || 0) + 1); degree.set(e.b, (degree.get(e.b) || 0) + 1); });
    const simpleSeries = items => items.length > 0 && liveEdges.length === items.length + 1 && [...degree.values()].every(n => n <= 2);
    const seriesLoad = resistors.some(r => liveEdges.some(e => e.c === r) && (lamps.some(l => l.current > 0 && Math.abs(l.current - r.current) < .002) || leds.some(l => l.current > 0 && Math.abs(l.current - r.current) < .002)));
    return { lamps, resistors, leds, switches, seriesLamps: lamps.length === 2 && simpleSeries(lamps), parallelLampCount: lampGroups.length ? Math.max(...lampGroups.map(g => g.length)) : 0, parallelResistorCount: resistorGroups.length ? Math.max(...resistorGroups.map(g => g.length)) : 0, minParallelResistorMA: resistorGroups.length ? Math.min(...resistorGroups.flat().map(r => r.current * 1000)) : 0, sumParallelResistorMA: resistorGroups.length ? Math.max(...resistorGroups.map(g => g.reduce((sum, r) => sum + r.current * 1000, 0))) : 0, seriesLoad };
  }

  function diagnose(c) {
    switch (current) {
      case 0: return c.lamps.length ? '' : 'Il te faut une ampoule allumée dans une boucle fermée avec la pile.';
      case 1: return !c.lamps.some(x => x.lit > 0) ? 'Allume au moins une ampoule.' : c.mA <= 200 ? 'Augmente le courant total au-dessus de 200 mA, par exemple avec plusieurs branches en parallèle.' : '';
      case 2: if (c.lamps.length < 2) return 'Il te faut 2 ampoules allumées dans la même boucle.'; if (!c.seriesLamps) return 'Place les 2 ampoules sur un seul trajet, sans dérivation.'; return c.mA >= 100 ? 'En série, le courant doit rester sous 100 mA.' : '';
      case 3: return c.parallelLampCount < 2 ? 'Il te faut 2 ampoules allumées sur des branches parallèles (entre les mêmes deux nœuds).' : '';
      case 4: return !c.lamps.some(x => x.lit > 0) ? 'Allume au moins une ampoule.' : c.mA < 150 || c.mA > 250 ? 'Ajuste le courant délivré pour le placer entre 150 et 250 mA.' : '';
      case 5: if (c.parallelLampCount < 3) return 'Il te faut 3 ampoules allumées en parallèle.'; return c.mA < 400 || c.mA > 450 ? 'Ajuste le courant total entre 400 et 450 mA.' : '';
      case 6: return c.switchDone ? '' : 'Fais circuler le courant, ouvre l’interrupteur, puis referme-le.';
      case 7: if (!c.lamps.length || !c.resistors.length) return 'Ajoute une résistance et une ampoule allumée.'; if (!c.seriesLoad) return 'La résistance doit être en série avec l’ampoule (même courant dans les deux).'; return c.mA >= 100 ? 'La résistance doit réduire le courant sous 100 mA.' : '';
      case 8: return c.resistors.length !== 1 || c.lamps.length || c.leds.length || c.switches.length || c.mA < 20 || c.mA > 35 ? 'Garde une seule résistance de 330 Ω en série avec la pile (20–35 mA).' : '';
      case 9: if (c.parallelResistorCount < 2) return 'Il te faut 2 résistances sur des branches parallèles.'; return c.sumParallelResistorMA <= 1.5 * c.minParallelResistorMA ? 'Le courant combiné des branches doit dépasser 1,5 fois celui d’une branche.' : '';
      case 10: if (!c.leds.some(x => x.lit > 0 && !x.burnt)) return 'Allume une LED sans la griller et respecte sa polarité.'; return !c.resistors.length || !c.seriesLoad ? 'Ajoute une résistance en série avec la LED.' : '';
      default: return '';
    }
  }

  function render() {
    const count = $('#pathCount'), currentBox = $('#pathCurrent'), list = $('#pathList'), next = $('#nextStep'); if (!count || !currentBox || !list) return;
    count.textContent = String(current + 1).padStart(2, '0') + ' / 12'; const step = steps[current];
    currentBox.innerHTML = '<div class="step-kicker">ÉTAPE ' + String(current + 1).padStart(2, '0') + '</div><h2>' + step.title + '</h2><p>' + step.instruction + '</p><p class="step-learn"><strong>Ce que tu apprends :</strong> ' + step.learn + '</p><p class="step-hint">Indice : ' + step.hint + '</p>' + (step.message ? '<p class="step-hint"><strong>' + step.message + '</strong></p>' : '') + '<p id="stepDiagnostic" class="step-diagnostic" role="status" aria-live="polite"></p>';
    list.replaceChildren(); steps.forEach((s, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'pathline ' + (i === current ? 'current' : completed.has(i) ? 'done' : 'locked'); b.disabled = i > current && !completed.has(i); b.setAttribute('aria-current', i === current ? 'step' : 'false'); b.innerHTML = '<b>' + (completed.has(i) ? '✓' : String(i + 1).padStart(2, '0')) + '</b><span><strong>' + s.title + '</strong><small>' + (completed.has(i) ? 'Étape validée' : i === current ? 'Étape en cours' : 'À débloquer') + '</small></span>'; if (i <= current || completed.has(i)) b.addEventListener('click', () => { current = i; render(); }); list.appendChild(b); });
    next.hidden = !(completed.has(current) && current < steps.length - 1); next.onclick = () => { if (current < steps.length - 1 && completed.has(current)) { current++; render(); } };
    const badge = $('#pathBadge'); if (badge) badge.innerHTML = String(current + 1).padStart(2, '0') + ' <span>/ ' + (current === 11 ? 'CIRCUIT LIBRE' : step.title.toLocaleUpperCase('fr')) + '</span>';
  }
  function update(result) {
    const c = topology(), switches = c.switches;
    switches.forEach(sw => { if (sw.closed && sw.current > .00001) litWithSwitch.add(sw.id); if (!sw.closed && litWithSwitch.has(sw.id)) opened.add(sw.id); if (sw.closed && opened.has(sw.id) && sw.current > .00001) completed.add(6); });
    c.switchDone = completed.has(6) && switches.some(sw => opened.has(sw.id) && litWithSwitch.has(sw.id)); c.mA = result.current * 1000;
    const diagnostic = $('#stepDiagnostic'); if (diagnostic) diagnostic.textContent = diagnose(c);
    if (steps[current].check(c)) { completed.add(current); if (current < steps.length - 1) { current++; render(); } else render(); }
  }
  $('#nextStep')?.addEventListener('click', () => { if (current < steps.length - 1 && completed.has(current)) { current++; render(); } });
  render(); window.updateLearningPath = update;
})();
