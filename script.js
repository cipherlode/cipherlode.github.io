/* --- Menu behavior --- */
const menuBtn = document.getElementById('menuBtn');
const dropdown = document.getElementById('dropdown');
menuBtn.addEventListener('click', e=>{
  e.stopPropagation();
  dropdown.classList.toggle('show');
  menuBtn.classList.toggle('open');
});
document.querySelectorAll('.dropdown a').forEach(a=>{
  a.addEventListener('click', ()=>{
    dropdown.classList.remove('show');
    menuBtn.classList.remove('open');
  });
});
document.addEventListener('click', e=>{
  if(!dropdown.contains(e.target) && !menuBtn.contains(e.target)){
    dropdown.classList.remove('show');
    menuBtn.classList.remove('open');
  }
});

/* --- Theme toggle --- */
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark-theme');
  themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
});

/* --- Loader blocks -> text -> morph into logo --- */
const loader = document.getElementById('loader');
const blocksContainer = document.getElementById('blocksContainer');
const loaderText = document.getElementById('loaderText');
const logoEl = document.querySelector('#logo .logo-text');
const STR = 'CIPHERLODE';
for(let i=0;i<STR.length;i++){
  const b = document.createElement('div'); b.className='block';
  blocksContainer.appendChild(b);
}
const blocks = document.querySelectorAll('.block');
const revealDelay = 0.06;
blocks.forEach((b, i)=>{
  gsap.fromTo(b, {opacity:0, y:6}, {opacity:1, y:0, duration:0.35, delay:i*revealDelay, ease:'sine.out'});
});
const textRevealStart = (STR.length * revealDelay) + 0.28;
gsap.to(loaderText, {opacity:1, duration:0.6, delay:textRevealStart, ease:'power2.out'});
const morphDelay = textRevealStart + 0.8;
gsap.delayedCall(morphDelay, ()=>{
  const loaderTextRect = loaderText.getBoundingClientRect();
  const logoRect = logoEl.getBoundingClientRect();
  const dx = (logoRect.left + logoRect.width/2) - (loaderTextRect.left + loaderTextRect.width/2);
  const dy = (logoRect.top + logoRect.height/2) - (loaderTextRect.top + loaderTextRect.height/2);
  gsap.to(loaderText, {
    x: dx,
    y: dy,
    scale: 0.7,
    duration: 0.9,
    ease: 'power3.inOut',
    onComplete: ()=> {
      document.getElementById('logo').style.opacity = '1';
      gsap.to(loader, {opacity:0, duration:0.35, onComplete: ()=> { loader.style.display='none'; loaderText.style.transform='none'; loaderText.style.opacity='0'; }} );
    }
  });
});

/* --- Hero animations --- */
setTimeout(()=> {
  gsap.from('.hero h2', {opacity:0, y:18, duration:0.9, delay:0.2, ease:'power2.out'});
  gsap.from('.hero p', {opacity:0, y:18, duration:0.9, delay:0.35, ease:'power2.out'});
}, 2600);

/* --- Scroll animations --- */
const scrollElems = document.querySelectorAll('.card, .step, .testimonial-card, .tip-card, .section h3, .section p');
const io = new IntersectionObserver((entries, obs)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      gsap.fromTo(en.target, {opacity:0, y:18}, {opacity:1, y:0, duration:0.7, ease:'power2.out'});
      obs.unobserve(en.target);
    }
  });
},{threshold:0.12});
scrollElems.forEach(el=>{
  el.style.opacity = '0';
  io.observe(el);
});

/* --- Formspree handling --- */
const form = document.getElementById('reportForm');
if(form){
  const checkmark = document.getElementById('checkmark');
  const confirmation = document.getElementById('confirmation');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(form);
    fetch(form.action, {method:'POST', body:data, headers:{'Accept':'application/json'}})
    .then(resp=>{
      if(resp.ok){
        form.style.display='none';
        checkmark.style.display='flex';
        confirmation.style.display='block';
        gsap.fromTo(checkmark,{scale:0},{scale:1.2,duration:0.6,ease:'back.out(1.7)'});
      } else {
        alert('Error submitting your report. Please try again.');
      }
    }).catch(()=>{ alert('Error submitting your report.'); });
  });
}
