(function(){
const D = window.DATA;
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const el = (t,c,h)=>{const e=document.createElement(t); if(c)e.className=c; if(h!==undefined)e.innerHTML=h; return e;};
const store = {
  get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};

/* ---------- NAV ---------- */
$('#burger').onclick=()=>$('#menu').classList.toggle('open');
$$('#menu a').forEach(a=>a.onclick=()=>$('#menu').classList.remove('open'));

/* ---------- HERO: yantra petals + embers ---------- */
(function(){
  const g=$('#petals'); let s='';
  for(let i=0;i<16;i++){
    s+=`<ellipse cx="0" cy="-148" rx="16" ry="30" transform="rotate(${i*22.5})"/>`;
  }
  g.innerHTML=s;

  const c=$('#embers'), ctx=c.getContext('2d'); let W,H,P=[];
  const size=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight};
  size(); addEventListener('resize',size);
  const mk=()=>({x:Math.random()*W,y:H+10,r:Math.random()*2.2+.5,v:Math.random()*.9+.3,d:Math.random()*2-1,a:Math.random()*.7+.3});
  for(let i=0;i<90;i++){const p=mk();p.y=Math.random()*H;P.push(p)}
  (function loop(){
    ctx.clearRect(0,0,W,H);
    P.forEach((p,i)=>{
      p.y-=p.v; p.x+=Math.sin(p.y/40)*.4+p.d*.1; p.a-=.0015;
      if(p.y<-10||p.a<=0) P[i]=mk();
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7);
      ctx.fillStyle=`rgba(255,${150+Math.random()*80|0},60,${p.a})`;
      ctx.shadowColor='#ff8a00'; ctx.shadowBlur=8; ctx.fill();
    });
    requestAnimationFrame(loop);
  })();
})();

/* ---------- CARDS ---------- */
function card(o){
  const c=el('div','card reveal');
  c.style.setProperty('--c',o.color);
  c.innerHTML=o.html;
  c.onclick=()=>c.classList.toggle('open');
  return c;
}
D.navadurga.forEach(n=>{
  $('#navaGrid').append(card({color:n.color,html:
   `<div class="n">दिवस ${n.day}</div><h3><span class="dot"></span>${n.name}</h3><div class="en">${n.en}</div>
    <p>${n.form}</p>
    <div class="more"><b>भोग:</b> ${n.bhog}<br><span style="white-space:pre-line">${n.mantra}</span></div>`}));
});
D.mahavidya.forEach(n=>{
  $('#vidyaGrid').append(card({color:n.color,html:
   `<div class="n">महाविद्या ${n.n}</div><h3><span class="dot"></span>${n.name}</h3><div class="en">${n.en}</div>
    <p>${n.about}</p><div class="more">${n.mantra}</div>`}));
});

/* ---------- TABS helper ---------- */
function tabs(host,keys,cb){
  host.innerHTML='';
  keys.forEach((k,i)=>{
    const b=el('button',i===0?'on':'',k.label);
    b.onclick=()=>{$$('button',host).forEach(x=>x.classList.remove('on'));b.classList.add('on');cb(k.key)};
    host.append(b);
  });
  cb(keys[0].key);
}

/* ---------- PEETHAS ---------- */
const PT=D.peethas;
tabs($('#peethaTabs'),[
  {key:'four',label:'4'},{key:'seven',label:'7'},{key:'eighteen',label:'18'},{key:'fortytwo',label:'42'},{key:'fiftyone',label:'51'}
],k=>{
  const p=PT[k], b=$('#peethaBody'); b.innerHTML='';
  b.append(el('h3','',p.title));
  b.lastChild.style.cssText='text-align:center;margin-bottom:.4rem';
  b.append(el('p','desc',p.desc));
  if(k==='four'){
    const g=el('div','grid');
    p.items.forEach(i=>g.append(card({color:'#c1121f',html:`<h3>${i[0]}</h3><div class="en">${i[1]}</div><p>${i[2]}</p>`})));
    b.append(g); b.append(el('p','desc','<br>'+p.extra));
  }else if(p.rows){
    const w=el('div','table-wrap');
    w.innerHTML='<table><tr><th>#</th><th>शक्तिपीठ</th><th>देवी</th></tr>'+p.rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')+'</table>';
    b.append(w);
  }else{
    const w=el('div','chips');
    p.chips.forEach((c,i)=>w.append(el('span','chip',`<b>${i+1}.</b> ${c}`)));
    b.append(w);
    if(p.note) b.append(el('p','desc','<br>'+p.note));
  }
});

/* ---------- MANTRAS ---------- */
function mcard(t,s,n){
  const c=el('div','mcard'+(s?'':' empty'));
  c.innerHTML=`<h4>${t}</h4><div class="skt">${s||'पाठ शीघ्र जोड़ा जाएगा (js/data.js में s: "..." भरें)।'}</div><small>${n||''}</small>`;
  if(s){
    const b=el('button','','📋 कॉपी');
    b.onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(s);b.textContent='✔ कॉपी हुआ';setTimeout(()=>b.textContent='📋 कॉपी',1500)};
    c.append(document.createElement('br'),b);
  }
  return c;
}
tabs($('#mantraTabs'),Object.keys(D.mantras).map(k=>({key:k,label:k})),k=>{
  const host=$('#mantraBody'); host.innerHTML='';
  const v=D.mantras[k];
  if(v==='MAHAVIDYA') D.mahavidya.forEach(m=>host.append(mcard(`${m.name} (${m.en})`,m.mantra,'दशमहाविद्या')));
  else if(v==='NAVADURGA') D.navadurga.forEach(m=>host.append(mcard(`${m.name} – दिवस ${m.day}`,m.mantra,'ध्यान मंत्र')));
  else v.forEach(m=>host.append(mcard(m.t,m.s,m.n)));
});

/* ---------- MIRACLES ---------- */
D.miracles.forEach(m=>{
  const s=el('div','story reveal');
  s.innerHTML=`<div class="ic">${m.ic}</div><div><h3>${m.t}</h3><div class="where">${m.w}</div><p>${m.s}</p></div>`;
  $('#stories').append(s);
});

/* ---------- DHARMA ---------- */
D.teachings.forEach(t=>{
  $('#teachGrid').append(card({color:'#c1121f',html:`<div style="font-size:2rem">${t.i}</div><h3>${t.t}</h3><p>${t.d}</p>`}));
});
(function(){
  const saved=store.get('pledges',[]), box=$('#pledges');
  const upd=()=>{
    const n=$$('input',box).filter(i=>i.checked).length;
    $('#pledgeMsg').textContent = n===D.pledges.length ? '🔱 माँ आपका संकल्प पूर्ण करें। जय माता दी!' : n? `${n}/${D.pledges.length} संकल्प लिए गए` : '';
  };
  D.pledges.forEach((p,i)=>{
    const l=el('label','',`<input type="checkbox" ${saved.includes(i)?'checked':''}><span>${p}</span>`);
    $('input',l).onchange=()=>{store.set('pledges',$$('input',box).map((x,j)=>x.checked?j:-1).filter(j=>j>=0));upd()};
    box.append(l);
  });
  upd();
})();

/* ---------- REVEAL ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal,.sec .title,.lead').forEach(e=>{e.classList.add('reveal');io.observe(e)});

/* ---------- VIRTUAL MANDIR ---------- */
const temple=$('#temple'), fx=$('#fx'), sel=$('#deitySel');
D.deities.forEach((d,i)=>sel.append(new Option(d.name,i)));
function setDeity(i){
  const d=D.deities[i]; $('#deityName').textContent=d.name; $('#deityMantra').textContent=d.mantra;
  store.set('deity',i);
}
sel.onchange=()=>setDeity(sel.value);
sel.value=store.get('deity',0); setDeity(sel.value);

// lotus in murti
(function(){let s='';for(let i=0;i<12;i++)s+=`<ellipse cx="0" cy="-62" rx="14" ry="30" transform="rotate(${i*30})"/>`;$('#lotus').innerHTML=s})();

$('#upl').onchange=e=>{
  const f=e.target.files[0]; if(!f) return;
  const url=URL.createObjectURL(f);
  $('#murtiImg').src=url; $('#murtiImg').hidden=false; $('#murtiSvg').style.display='none';
};

// audio
let ac;
function bell(){
  ac=ac||new (window.AudioContext||window.webkitAudioContext)();
  const t=ac.currentTime;
  [[523,.5],[1318,.3],[2093,.18],[3136,.1]].forEach(([f,v])=>{
    const o=ac.createOscillator(), g=ac.createGain();
    o.type='sine'; o.frequency.value=f*(1+Math.random()*.004);
    g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+4);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t+4);
  });
}
function petals(){
  for(let i=0;i<26;i++){
    const p=el('span','petal',['🌺','🌸','🏵️','🌼'][i%4]);
    p.style.left=Math.random()*100+'%'; p.style.animationDuration=(3+Math.random()*3)+'s'; p.style.animationDelay=Math.random()*1.2+'s';
    fx.append(p); setTimeout(()=>p.remove(),7500);
  }
}
let smokeTimer;
function incense(){
  clearInterval(smokeTimer); let n=0;
  smokeTimer=setInterval(()=>{
    const s=el('span','smoke'); s.style.left=(40+Math.random()*20)+'%'; s.style.setProperty('--dx',(Math.random()*80-40)+'px');
    fx.append(s); setTimeout(()=>s.remove(),5200);
    if(++n>30) clearInterval(smokeTimer);
  },200);
}
function toggleAarti(){
  const th=$('#thali'), on=th.classList.toggle('aarti');
  temple.classList.add('lit'); $('#murti').classList.toggle('ring',on);
  if(on){bell();const r=setInterval(()=>{if(!th.classList.contains('aarti'))return clearInterval(r);bell()},3500)}
}
$$('.acts button').forEach(b=>b.onclick=()=>{
  const a=b.dataset.act;
  if(a==='diya') temple.classList.toggle('lit');
  if(a==='flower') petals();
  if(a==='incense') incense();
  if(a==='bell') bell();
  if(a==='aarti') toggleAarti();
});

// japa mala
let cnt=0, rounds=store.get('rounds',0);
const beads=$('#beads'); for(let i=0;i<108;i++)beads.append(document.createElement('i'));
$('#malaRounds').textContent=rounds;
$('#japaBtn').onclick=()=>{
  if(cnt===0) temple.classList.add('lit');
  cnt++;
  if(cnt>108){cnt=1;$$('i',beads).forEach(i=>i.classList.remove('on'))}
  $$('i',beads)[cnt-1].classList.add('on');
  $('#malaCount').textContent=cnt;
  if(cnt===108){rounds++;store.set('rounds',rounds);$('#malaRounds').textContent=rounds;bell();petals()}
};
$('#japaReset').onclick=()=>{cnt=0;$('#malaCount').textContent=0;$$('i',beads).forEach(i=>i.classList.remove('on'))};
})();
