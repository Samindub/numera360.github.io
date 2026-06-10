'use strict';
/* Numera 360 — site JS */
function onReady(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();}

/* Mobile nav */
onReady(()=>{
  const t=document.querySelector('.nav-toggle'),n=document.querySelector('.site-nav');
  if(!t||!n)return;
  t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',o);});
});

/* Footer year */
onReady(()=>{const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();});

/* Smooth anchor */
onReady(()=>{
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const h=a.getAttribute('href');if(h.length<2)return;
      const el=document.querySelector(h);if(!el)return;
      e.preventDefault();el.scrollIntoView({behavior:'smooth'});
      document.querySelector('.site-nav')?.classList.remove('open');
    });
  });
});

/* Stat counters */
onReady(()=>{
  const counters=document.querySelectorAll('.stat-number');if(!counters.length)return;
  let started=false;
  const animate=()=>counters.forEach(el=>{
    const tgt=+el.getAttribute('data-target')||0,dur=1400,start=performance.now();
    const tick=now=>{const p=Math.min((now-start)/dur,1);el.textContent=Math.floor(tgt*p).toLocaleString();if(p<1)requestAnimationFrame(tick);};
    requestAnimationFrame(tick);
  });
  const s=document.querySelector('.stats');
  if('IntersectionObserver' in window && s){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting && !started){started=true;animate();io.disconnect();}}),{threshold:.3});
    io.observe(s);
  } else animate();
});
