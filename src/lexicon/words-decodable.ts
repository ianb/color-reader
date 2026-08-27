/**
 * Common decodable words in UFLI-style phonics order.
 * Entries use the notation in ./notation.ts (see parseEntry).
 */
export const WORDS_DECODABLE: Record<string, string> = {
  // ---- CVC short a ----
  cat: 'c.a.t', hat: 'h.a.t', map: 'm.a.p', bag: 'b.a.g', ran: 'r.a.n',
  sad: 's.a.d', jam: 'j.a.m', can: 'c.a.n', pan: 'p.a.n', bat: 'b.a.t',
  van: 'v.a.n', tap: 't.a.p', wax: 'w.a.x', lap: 'l.a.p', nap: 'n.a.p',

  // ---- CVC short i ----
  sit: 's.i.t', pig: 'p.i.g', big: 'b.i.g', hid: 'h.i.d', tin: 't.i.n',
  win: 'w.i.n', lip: 'l.i.p', dig: 'd.i.g', fin: 'f.i.n', six: 's.i.x',
  kid: 'k.i.d', bit: 'b.i.t', him: 'h.i.m', zip: 'z.i.p', wig: 'w.i.g',

  // ---- CVC short o ----
  hot: 'h.o.t', dog: 'd.o.g', top: 't.o.p', mop: 'm.o.p', log: 'l.o.g',
  fox: 'f.o.x', pot: 'p.o.t', job: 'j.o.b', not: 'n.o.t', hop: 'h.o.p',
  cot: 'c.o.t', rod: 'r.o.d', box: 'b.o.x', got: 'g.o.t', nod: 'n.o.d',

  // ---- CVC short u ----
  sun: 's.u.n', cup: 'c.u.p', bug: 'b.u.g', mud: 'm.u.d', run: 'r.u.n',
  hug: 'h.u.g', tub: 't.u.b', bus: 'b.u.s', nut: 'n.u.t', cut: 'c.u.t',
  fun: 'f.u.n', gum: 'g.u.m', jug: 'j.u.g', pup: 'p.u.p', rug: 'r.u.g',

  // ---- CVC short e ----
  bed: 'b.e.d', pen: 'p.e.n', hen: 'h.e.n', red: 'r.e.d', wet: 'w.e.t',
  leg: 'l.e.g', ten: 't.e.n', net: 'n.e.t', jet: 'j.e.t', men: 'm.e.n',
  peg: 'p.e.g', web: 'w.e.b', yes: 'y.e.s', get: 'g.e.t', let: 'l.e.t',

  // ---- doubled final consonants ----
  bell: 'b.e.ll', hill: 'h.i.ll', kiss: 'k.i.ss', off: 'o.ff', buzz: 'b.u.zz',
  mess: 'm.e.ss', doll: 'd.o.ll', fizz: 'f.i.zz',

  // ---- digraph sh ----
  ship: 'sh:D.i.p', shop: 'sh:D.o.p', fish: 'f.i.sh:D', wish: 'w.i.sh:D',
  dish: 'd.i.sh:D', shut: 'sh:D.u.t', rush: 'r.u.sh:D', shed: 'sh:D.e.d',

  // ---- digraph ch ----
  chip: 'ch:D.i.p', chop: 'ch:D.o.p', chin: 'ch:D.i.n', much: 'm.u.ch:D',
  such: 's.u.ch:D', rich: 'r.i.ch:D', chat: 'ch:D.a.t', lunch: 'l.u.n.ch:D',

  // ---- digraph th ----
  thin: 'th:D.i.n', that: 'th:D.a.t', this: 'th:D.i.s', with: 'w.i.th:D',
  bath: 'b.a.th:D', math: 'm.a.th:D', then: 'th:D.e.n', moth: 'm.o.th:D',

  // ---- digraph wh ----
  when: 'wh:D.e.n', whip: 'wh:D.i.p', which: 'wh:D.i.ch:D', whiz: 'wh:D.i.z',
  whim: 'wh:D.i.m', wham: 'wh:D.a.m', whisk: 'wh:D.i.s.k', whiff: 'wh:D.i.ff',

  // ---- digraph ck ----
  duck: 'd.u.ck:D', back: 'b.a.ck:D', sock: 's.o.ck:D', kick: 'k.i.ck:D',
  pack: 'p.a.ck:D', lock: 'l.o.ck:D', neck: 'n.e.ck:D', rock: 'r.o.ck:D',

  // ---- digraph ng ----
  ring: 'r.i.ng:D', sing: 's.i.ng:D', king: 'k.i.ng:D', long: 'l.o.ng:D',
  song: 's.o.ng:D', hang: 'h.a.ng:D', wing: 'w.i.ng:D', bang: 'b.a.ng:D',

  // ---- digraph qu ----
  quit: 'qu:D.i.t', quiz: 'qu:D.i.z', quick: 'qu:D.i.ck:D', quack: 'qu:D.a.ck:D',
  quilt: 'qu:D.i.l.t', quest: 'qu:D.e.s.t', squid: 's.qu:D.i.d', quench: 'qu:D.e.n.ch:D',

  // ---- trigraph tch ----
  catch: 'c.a.tch:D', match: 'm.a.tch:D', pitch: 'p.i.tch:D', fetch: 'f.e.tch:D',
  witch: 'w.i.tch:D', hutch: 'h.u.tch:D', patch: 'p.a.tch:D', ditch: 'd.i.tch:D',

  // ---- trigraph dge ----
  bridge: 'b.r.i.dge:D', badge: 'b.a.dge:D', edge: 'e.dge:D', judge: 'j.u.dge:D',
  fudge: 'f.u.dge:D', hedge: 'h.e.dge:D', lodge: 'l.o.dge:D', ridge: 'r.i.dge:D',

  // ---- blends ----
  stop: 's.t.o.p', flag: 'f.l.a.g', frog: 'f.r.o.g', drum: 'd.r.u.m',
  clap: 'c.l.a.p', grin: 'g.r.i.n', swim: 's.w.i.m', trip: 't.r.i.p',
  snap: 's.n.a.p', slip: 's.l.i.p', spin: 's.p.i.n', crab: 'c.r.a.b',
  plan: 'p.l.a.n', glad: 'g.l.a.d', brim: 'b.r.i.m', skip: 's.k.i.p',
  jump: 'j.u.m.p', hand: 'h.a.n.d', milk: 'm.i.l.k', nest: 'n.e.s.t',
  belt: 'b.e.l.t', lamp: 'l.a.m.p', fast: 'f.a.s.t', help: 'h.e.l.p',
  pond: 'p.o.n.d', tent: 't.e.n.t', gift: 'g.i.f.t', desk: 'd.e.s.k',
  stamp: 's.t.a.m.p', blend: 'b.l.e.n.d', crisp: 'c.r.i.s.p', print: 'p.r.i.n.t',
  strap: 's.t.r.a.p', split: 's.p.l.i.t',

  // ---- magic e: a_e ----
  cake: 'c.a/A.k.e:X', make: 'm.a/A.k.e:X', game: 'g.a/A.m.e:X', name: 'n.a/A.m.e:X',
  lake: 'l.a/A.k.e:X', gate: 'g.a/A.t.e:X', safe: 's.a/A.f.e:X', wave: 'w.a/A.v.e:X',
  plate: 'p.l.a/A.t.e:X', grape: 'g.r.a/A.p.e:X', shape: 'sh:D.a/A.p.e:X', tape: 't.a/A.p.e:X',

  // ---- magic e: i_e ----
  bike: 'b.i/I.k.e:X', time: 't.i/I.m.e:X', ride: 'r.i/I.d.e:X', kite: 'k.i/I.t.e:X',
  hide: 'h.i/I.d.e:X', line: 'l.i/I.n.e:X', five: 'f.i/I.v.e:X', mile: 'm.i/I.l.e:X',
  smile: 's.m.i/I.l.e:X', white: 'wh:D.i/I.t.e:X', slide: 's.l.i/I.d.e:X', pine: 'p.i/I.n.e:X',

  // ---- magic e: o_e ----
  home: 'h.o/O.m.e:X', bone: 'b.o/O.n.e:X', rope: 'r.o/O.p.e:X', nose: 'n.o/O.s.e:X',
  hope: 'h.o/O.p.e:X', note: 'n.o/O.t.e:X', joke: 'j.o/O.k.e:X', stone: 's.t.o/O.n.e:X',
  woke: 'w.o/O.k.e:X', hole: 'h.o/O.l.e:X',

  // ---- magic e: u_e ----
  cute: 'c.u/U.t.e:X', mule: 'm.u/U.l.e:X', tube: 't.u/oo.b.e:X', cube: 'c.u/U.b.e:X',
  rule: 'r.u/oo.l.e:X', june: 'j.u/oo.n.e:X', flute: 'f.l.u/oo.t.e:X', huge: 'h.u/U.g:C.e:X',

  // ---- magic e: e_e ----
  these: 'th:D.e/E.s.e:X', theme: 'th:D.e/E.m.e:X', eve: 'e/E.v.e:X', pete: 'p.e/E.t.e:X',

  // ---- soft c / g with magic e ----
  face: 'f.a/A.c:C.e:X', race: 'r.a/A.c:C.e:X', ice: 'i/I.c:C.e:X', page: 'p.a/A.g:C.e:X',
  cage: 'c.a/A.g:C.e:X', mice: 'm.i/I.c:C.e:X',

  // ---- vowel team ai ----
  rain: 'r.ai/A.n', wait: 'w.ai/A.t', tail: 't.ai/A.l', mail: 'm.ai/A.l',
  paint: 'p.ai/A.n.t', train: 't.r.ai/A.n',

  // ---- vowel team ay ----
  day: 'd.ay/A', play: 'p.l.ay/A', say: 's.ay/A', way: 'w.ay/A',
  stay: 's.t.ay/A', gray: 'g.r.ay/A',

  // ---- vowel team ee ----
  see: 's.ee/E', tree: 't.r.ee/E', feet: 'f.ee/E.t', keep: 'k.ee/E.p',
  green: 'g.r.ee/E.n', sleep: 's.l.ee/E.p',

  // ---- vowel team ea ----
  eat: 'ea/E.t', read: 'r.ea/E.d', seat: 's.ea/E.t', beach: 'b.ea/E.ch:D',
  team: 't.ea/E.m', leaf: 'l.ea/E.f',

  // ---- vowel team oa ----
  boat: 'b.oa/O.t', road: 'r.oa/O.d', coat: 'c.oa/O.t', soap: 's.oa/O.p',
  goat: 'g.oa/O.t', toast: 't.oa/O.s.t',

  // ---- ow as long o ----
  snow: 's.n.ow/O', grow: 'g.r.ow/O', show: 'sh:D.ow/O', slow: 's.l.ow/O',
  blow: 'b.l.ow/O', yellow: 'y.e.l-l.ow/O',

  // ---- ow as /ow/ (cow) ----
  cow: 'c.ow/ow', how: 'h.ow/ow', now: 'n.ow/ow', down: 'd.ow/ow.n',
  town: 't.ow/ow.n', brown: 'b.r.ow/ow.n',

  // ---- igh ----
  night: 'n.igh/I.t', light: 'l.igh/I.t', high: 'h.igh/I', right: 'r.igh/I.t',
  bright: 'b.r.igh/I.t', fight: 'f.igh/I.t',

  // ---- oo (moon) ----
  moon: 'm.oo/oo.n', food: 'f.oo/oo.d', zoo: 'z.oo/oo', room: 'r.oo/oo.m',
  soon: 's.oo/oo.n', tooth: 't.oo/oo.th:D',

  // ---- oo (book) ----
  book: 'b.oo/uu.k', look: 'l.oo/uu.k', good: 'g.oo/uu.d', foot: 'f.oo/uu.t',
  wood: 'w.oo/uu.d', cook: 'c.oo/uu.k',

  // ---- ou ----
  out: 'ou/ow.t', loud: 'l.ou/ow.d', house: 'h.ou/ow.s.e:X', cloud: 'c.l.ou/ow.d',
  shout: 'sh:D.ou/ow.t', round: 'r.ou/ow.n.d',

  // ---- oi ----
  oil: 'oi/oy.l', coin: 'c.oi/oy.n', boil: 'b.oi/oy.l', join: 'j.oi/oy.n',
  point: 'p.oi/oy.n.t', soil: 's.oi/oy.l',

  // ---- oy ----
  boy: 'b.oy/oy', toy: 't.oy/oy', joy: 'j.oy/oy', enjoy: 'e.n-j.oy/oy',
  royal: 'r.oy/oy-a/uh.l', soy: 's.oy/oy',

  // ---- au ----
  haul: 'h.au/aw.l', fault: 'f.au/aw.l.t', launch: 'l.au/aw.n.ch:D', sauce: 's.au/aw.c:C.e:X',
  pause: 'p.au/aw.s.e:X', august: 'au/aw-g.u.s.t',

  // ---- aw ----
  saw: 's.aw/aw', draw: 'd.r.aw/aw', paw: 'p.aw/aw', lawn: 'l.aw/aw.n',
  yawn: 'y.aw/aw.n', crawl: 'c.r.aw/aw.l',

  // ---- ew ----
  new: 'n.ew/oo', few: 'f.ew/U', grew: 'g.r.ew/oo', chew: 'ch:D.ew/oo',
  flew: 'f.l.ew/oo', stew: 's.t.ew/oo',

  // ---- ue ----
  blue: 'b.l.ue/oo', glue: 'g.l.ue/oo', true: 't.r.ue/oo', clue: 'c.l.ue/oo',
  rescue: 'r.e.s-c.ue/U', due: 'd.ue/oo',

  // ---- r-controlled ar ----
  car: 'c.ar/ar', far: 'f.ar/ar', star: 's.t.ar/ar', farm: 'f.ar/ar.m',
  park: 'p.ar/ar.k', dark: 'd.ar/ar.k',

  // ---- r-controlled or ----
  for: 'f.or/or', corn: 'c.or/or.n', fork: 'f.or/or.k', horn: 'h.or/or.n',
  storm: 's.t.or/or.m', short: 'sh:D.or/or.t',

  // ---- r-controlled er ----
  her: 'h.er/er', fern: 'f.er/er.n', herd: 'h.er/er.d', perch: 'p.er/er.ch:D',
  sister: 's.i.s-t.er/er', letter: 'l.e.t-t.er/er',

  // ---- r-controlled ir ----
  bird: 'b.ir/er.d', girl: 'g.ir/er.l', first: 'f.ir/er.s.t', dirt: 'd.ir/er.t',
  shirt: 'sh:D.ir/er.t', stir: 's.t.ir/er',

  // ---- r-controlled ur ----
  fur: 'f.ur/er', turn: 't.ur/er.n', hurt: 'h.ur/er.t', burn: 'b.ur/er.n',
  curl: 'c.ur/er.l', nurse: 'n.ur/er.s.e:X',

  // ---- all / other ----
  ball: 'b.a/aw.ll', call: 'c.a/aw.ll', fall: 'f.a/aw.ll', tall: 't.a/aw.ll',

  // ---- consonant-le ----
  table: 't.a/A-b.l.e:X', little: 'l.i.t-t.l.e:X', puddle: 'p.u.d-d.l.e:X',
  apple: 'a.p-p.l.e:X', bottle: 'b.o.t-t.l.e:X', middle: 'm.i.d-d.l.e:X',
  candle: 'c.a.n-d.l.e:X', turtle: 't.ur/er-t.l.e:X', purple: 'p.ur/er-p.l.e:X',
  simple: 's.i.m-p.l.e:X', bubble: 'b.u.b-b.l.e:X', giggle: 'g.i.g-g.l.e:X',
  jungle: 'j.u.n-g.l.e:X', title: 't.i/I-t.l.e:X',

  // ---- two-syllable: compounds ----
  sunset: 's.u.n-s.e.t', bathtub: 'b.a.th:D-t.u.b', catnip: 'c.a.t-n.i.p',
  hotdog: 'h.o.t-d.o.g', backpack: 'b.a.ck:D-p.a.ck:D', cupcake: 'c.u.p-c.a/A.k.e:X',
  sandbox: 's.a.n.d-b.o.x', laptop: 'l.a.p-t.o.p', inside: 'i.n-s.i/I.d.e:X',
  pancake: 'p.a.n-c.a/A.k.e:X',

  // ---- two-syllable: VC/CV ----
  rabbit: 'r.a.b-b.i.t', napkin: 'n.a.p-k.i.n', basket: 'b.a.s-k.e.t',
  picnic: 'p.i.c-n.i.c', muffin: 'm.u.f-f.i.n', kitten: 'k.i.t-t.e.n',
  happen: 'h.a.p-p.e.n', pocket: 'p.o.ck:D-e.t', magnet: 'm.a.g-n.e.t',
  velvet: 'v.e.l-v.e.t', insect: 'i.n-s.e.c.t', problem: 'p.r.o.b-l.e.m',
  chicken: 'ch:D.i.ck:D-e.n', button: 'b.u.t-t.o/uh.n',

  // ---- two-syllable: V/CV open syllable ----
  tiger: 't.i/I-g.er/er', baby: 'b.a/A-b.y/E', paper: 'p.a/A-p.er/er',
  robot: 'r.o/O-b.o.t', music: 'm.u/U-s.i.c', open: 'o/O-p.e.n',
  even: 'e/E-v.e.n', bacon: 'b.a/A-c.o.n', spider: 's.p.i/I-d.er/er',
  hotel: 'h.o/O-t.e.l', pilot: 'p.i/I-l.o.t', silent: 's.i/I-l.e.n.t',

  // ---- final y ----
  my: 'm.y/I', fly: 'f.l.y/I', sky: 's.k.y/I', happy: 'h.a.p-p.y/E',
  funny: 'f.u.n-n.y/E', puppy: 'p.u.p-p.y/E',

  // ---- -ing ----
  jumping: 'j.u.m.p-i.ng:D', running: 'r.u.n-n.i.ng:D', singing: 's.i.ng:D-i.ng:D',
  fishing: 'f.i.sh:D-i.ng:D', playing: 'p.l.ay/A-i.ng:D', reading: 'r.ea/E-d.i.ng:D',
  sleeping: 's.l.ee/E-p.i.ng:D', hopping: 'h.o.p-p.i.ng:D', helping: 'h.e.l.p-i.ng:D',
  sitting: 's.i.t-t.i.ng:D',

  // ---- -ed ----
  wanted: 'w.a/o.n.t-e.d', landed: 'l.a.n.d-e.d', jumped: 'j.u.m.p.e:X.d',
  hopped: 'h.o.p.p.e:X.d', played: 'p.l.ay/A.e:X.d', rained: 'r.ai/A.n.e:X.d',
  filled: 'f.i.ll.e:X.d', ended: 'e.n.d-e.d', packed: 'p.a.ck:D.e:X.d',
  fixed: 'f.i.x.e:X.d',
};
