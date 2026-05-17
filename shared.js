/* ── NBA Numetric — Shared JS ── */

/* ─── DNA / PARTICLE HELIX ─── */
(function(){
  const c=document.getElementById('dna');
  if(!c)return;
  const ctx=c.getContext('2d');
  let W,H,pts=[];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight}

  function Pt(){this.reset()}
  Pt.prototype.reset=function(){
    this.strand=Math.floor(Math.random()*3);
    this.t=Math.random()*Math.PI*2;
    this.speed=.004+Math.random()*.006;
    this.y=Math.random()*(H+200)-100;
    this.vy=.18+Math.random()*.28;
    this.amp=55+Math.random()*110;
    this.cx=(W/4)*(this.strand+.5)+(Math.random()-.5)*W*.14;
    this.r=1.4+Math.random()*3.2;
    this.alpha=.1+Math.random()*.3;
    this.isOrange=Math.random()<.13;
    this.z=.35+Math.random()*.65;
  };
  Pt.prototype.update=function(){
    this.t+=this.speed;
    this.y+=this.vy*this.z;
    this.cx+=Math.sin(this.t*.3)*.14;
    if(this.y>H+80){this.reset();this.y=-20}
  };
  Pt.prototype.draw=function(){
    const x=this.cx+Math.sin(this.t)*this.amp*this.z;
    const r=this.r*this.z;
    const a=this.alpha*this.z;
    const g=ctx.createRadialGradient(x,this.y,0,x,this.y,r*3.5);
    if(this.isOrange){
      g.addColorStop(0,`rgba(249,115,22,${a*1.5})`);
      g.addColorStop(1,'rgba(249,115,22,0)');
    }else{
      g.addColorStop(0,`rgba(255,255,255,${a})`);
      g.addColorStop(1,'rgba(255,255,255,0)');
    }
    ctx.beginPath();ctx.arc(x,this.y,r*3.5,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
    ctx.beginPath();ctx.arc(x,this.y,r,0,Math.PI*2);
    ctx.fillStyle=this.isOrange?`rgba(249,115,22,${Math.min(a*2.5,.7)})`:`rgba(255,255,255,${Math.min(a*2,.55)})`;
    ctx.fill();
  };

  function drawLines(){
    for(let i=0;i<pts.length;i++){
      const pi=pts[i];
      const xi=pi.cx+Math.sin(pi.t)*pi.amp*pi.z;
      for(let j=i+1;j<pts.length;j++){
        const pj=pts[j];
        if(pi.strand!==pj.strand)continue;
        const xj=pj.cx+Math.sin(pj.t)*pj.amp*pj.z;
        const dx=xi-xj,dy=pi.y-pj.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<80){
          ctx.beginPath();ctx.moveTo(xi,pi.y);ctx.lineTo(xj,pj.y);
          ctx.strokeStyle=`rgba(255,255,255,${(1-dist/80)*.055})`;
          ctx.lineWidth=.5;ctx.stroke();
        }
      }
    }
  }

  function init(){
    resize();pts=[];
    const n=Math.min(Math.floor(W/7),150);
    for(let i=0;i<n;i++)pts.push(new Pt());
  }
  function loop(){
    ctx.clearRect(0,0,W,H);
    drawLines();
    pts.forEach(p=>{p.update();p.draw()});
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize',resize,{passive:true});
  init();loop();
})();

/* ─── NAV MOBILE ─── */
const hbg=document.getElementById('hbg');
const mob=document.getElementById('mob');
const mobX=document.getElementById('mob-x');
if(hbg&&mob){
  hbg.addEventListener('click',()=>{mob.style.display='flex';requestAnimationFrame(()=>mob.classList.add('open'))});
}
function closeMob(){if(mob){mob.classList.remove('open');setTimeout(()=>mob.style.display='none',320)}}
if(mobX)mobX.addEventListener('click',closeMob);

/* ─── SCROLL REVEAL ─── */
const srEls=document.querySelectorAll('.sr,.sr-l,.sr-r');
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}});
},{threshold:.07,rootMargin:'0px 0px -28px 0px'});
srEls.forEach(el=>obs.observe(el));

/* ─── KPI BAR ANIMATION ─── */
const barEls=document.querySelectorAll('.kbar');
if(barEls.length){
  const bObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.style.width=e.target.dataset.w;bObs.unobserve(e.target)}
    });
  },{threshold:.3});
  barEls.forEach(el=>bObs.observe(el));
}

/* ─── COUNTER ANIMATION ─── */
function animCount(el,target,suf=''){
  let v=0;const dur=1800;const step=16;const inc=target/(dur/step);
  const t=setInterval(()=>{v+=inc;if(v>=target){v=target;clearInterval(t)}el.textContent=Math.floor(v)+suf},step);
}
const counterEls=document.querySelectorAll('[data-count]');
if(counterEls.length){
  const cObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el=e.target;
        animCount(el,parseInt(el.dataset.count),el.dataset.suf||'');
        cObs.unobserve(el);
      }
    });
  },{threshold:.5});
  counterEls.forEach(el=>cObs.observe(el));
}

/* ─── FAQ ─── */
function toggleFaq(btn){
  const item=btn.parentElement;
  const wasOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!wasOpen)item.classList.add('open');
}

/* ─── DINING / SERVICE TABS ─── */
function switchTab(btn,id){
  document.querySelectorAll('.dtab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.dpanel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const el=document.getElementById(id);
  if(el)el.classList.add('active');
}

/* ─── FORM SUBMIT ─── */
function handleForm(e){
  const btn=e.target;
  btn.textContent='Request Sent ✓';
  btn.style.background='#16a34a';
  setTimeout(()=>{btn.textContent='Book Free Consultation';btn.style.background=''},3500);
}
