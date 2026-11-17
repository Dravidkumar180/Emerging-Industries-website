(()=>{
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
const page=document.body;

if(!reducedMotion.matches){
 const progress=document.createElement('div');
 progress.className='reading-progress';
 progress.setAttribute('aria-hidden','true');
 page.prepend(progress);
 let progressFrame=0;
 function updateProgress(){
  const maximum=document.documentElement.scrollHeight-window.innerHeight;
  const value=maximum>0?Math.min(window.scrollY/maximum,1):0;
  progress.style.transform=`scaleX(${value})`;
  progressFrame=0;
 }
 window.addEventListener('scroll',()=>{
  if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress);
 },{passive:true});
 window.addEventListener('resize',()=>{
  if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress);
 },{passive:true});
 updateProgress();

 if(finePointer.matches){
  document.querySelectorAll('main .panel,main .industry-card,main .application-card,main .trend-signal,main .recommendation').forEach(element=>{
   element.classList.add('motion-spotlight');
   let frame=0;let x=0;let y=0;
   element.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||frame)return;
    const bounds=element.getBoundingClientRect();
    x=event.clientX-bounds.left;y=event.clientY-bounds.top;
    frame=requestAnimationFrame(()=>{
     element.style.setProperty('--motion-x',`${x}px`);
     element.style.setProperty('--motion-y',`${y}px`);
     frame=0;
    });
   },{passive:true});
  });
 }

 document.addEventListener('pointerdown',event=>{
  if(event.pointerType!=='mouse')return;
  const target=event.target.closest('.button,.settings-tab,.icon-button,.card-footer button,.action,[data-period]');
  if(!target||target.disabled)return;
  const bounds=target.getBoundingClientRect();
  const size=Math.max(bounds.width,bounds.height)*1.8;
  const ripple=document.createElement('span');
  ripple.className='motion-ripple';
  ripple.setAttribute('aria-hidden','true');
  ripple.style.setProperty('--ripple-size',`${size}px`);
  ripple.style.setProperty('--ripple-x',`${event.clientX-bounds.left-size/2}px`);
  ripple.style.setProperty('--ripple-y',`${event.clientY-bounds.top-size/2}px`);
  target.classList.add('motion-ripple-host');
  target.append(ripple);
  ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});
 },{passive:true});

 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){
    entry.target.classList.add('motion-in');
    observer.unobserve(entry.target);
   }
  }),{threshold:.08});
  const revealItems=document.querySelectorAll('main .sector,main .shift,main .trend-table tbody tr,main .catalyst,main .trend-signal,main .recommendation,main .notification-option,main .watchlist-feed,main .region-row');
  revealItems.forEach((element,index)=>{
   if(element.closest('.reveal-section,.settings-reveal,.observe-reveal')||getComputedStyle(element).animationName!=='none')return;
   element.style.setProperty('--motion-index',index%6);
   element.classList.add('motion-reveal');
   observer.observe(element);
  });
 }
}
})();
