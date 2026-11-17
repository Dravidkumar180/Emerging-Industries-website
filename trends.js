const $=id=>document.getElementById(id);
let user;
try{
 const session=JSON.parse(sessionStorage.getItem('nex-session')||localStorage.getItem('nex-session')||'null');
 user=session&&session.expires>Date.now()&&JSON.parse(localStorage.getItem('nex-accounts')||'[]').find(item=>item.email===session.email);
}catch{}
if(!user)location.replace('index.html');

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const sectorMetrics={
 ai:{projection:1300,momentum:36.8,research:28.6,risk:88,riskLabel:'Very High',signal:'High'},
 energy:{projection:980,momentum:33.8,research:18.4,risk:86,riskLabel:'High',signal:'High'},
 bio:{projection:740,momentum:29.3,research:34.2,risk:84,riskLabel:'High',signal:'High'},
 robotics:{projection:420,momentum:26.1,research:19.2,risk:79,riskLabel:'Moderate',signal:'Moderate'},
 space:{projection:580,momentum:22.7,research:23.8,risk:71,riskLabel:'Moderate',signal:'Moderate'},
 fintech:{projection:620,momentum:16.8,research:8.7,risk:62,riskLabel:'Consolidating',signal:'Consolidating'}
};
const marketShares={ai:28,energy:20,bio:18,robotics:13,space:12,fintech:9};
const regions=[
 {name:'North America',share:38.4,value:'$1.60T'},
 {name:'Asia-Pacific',share:32.4,value:'$1.35T'},
 {name:'Europe (EEA & UK)',share:18.6,value:'$780B'},
 {name:'Latin America & Middle East',share:7.5,value:'$315B'}
];
const signals=[
 {icon:'✳',tone:'blue',title:'Convergence of AI & Biotechnology (Bio-AI)',text:'AI-led computational models for novel protein folding have reduced clinical candidate phase I synthesis timelines by ~64% across key venture clusters.',impact:'High Impact',capital:'18-Mo Inflow: $14.2B',search:'AI Biotechnology Bio-AI protein folding'},
 {icon:'✚',tone:'green',title:'Green Hydrogen Storage & Membrane Breakthroughs',text:'New low-cost catalyst electrolyzers achieved a 61.5% energy-cost reduction in pilot membrane networks, triggering industrial off-take commitments.',impact:'Emerging',capital:'Capital Inflow: $6.8B TTM',search:'Green Energy Hydrogen Storage'},
 {icon:'⌁',tone:'amber',title:'Satellite Broadband Direct-to-Device Saturation',text:'Steadily expanding constellations are bringing direct-to-device service from 18M users toward an estimated 70M globally.',impact:'Near Term',capital:'Capital Inflow: $8.1B TTM',search:'Space Satellite Broadband'}
];
const recommendations=[
 {title:'Prioritize Software-Enabled Bio Over Pure Tools',text:'Target operating expenses remain weighted toward repeatable data and clinical workflow platforms. Enterprise returns have shown improved computational systems within infrastructure licensing models.'},
 {title:'Hedge Grid Transition with Long-Duration Storage',text:'Intermittent renewable supply is driving structural grid volatility. Capital should favor thermal and hybrid storage capacity paired with deployment-ready infrastructure.'},
 {title:'Filter Flexion on Autonomous Settlement',text:'Volatility from autonomous settlement pathways creates opportunity in agentic infrastructure, interoperability, and settlement assurance protocols.'}
];
let selectedPeriod=3;

function renderMatrix(query=''){
 const rows=industries.filter(item=>`${item.name} ${item.tags.join(' ')} ${item.trend}`.toLowerCase().includes(query));
 const targetYear=selectedPeriod===1?'1 YEAR PROJECTION':selectedPeriod===3?'2028 PROJECTION':selectedPeriod===5?'2030 PROJECTION':'2035 FORECAST';
 $('projection-heading').textContent=targetYear;
 $('matrix-rows').replaceChildren();
 rows.forEach((sector,index)=>{
  const metric=sectorMetrics[sector.id];
  const projection=Math.round(metric.projection*Math.pow(1+sector.cagr/100,selectedPeriod-3));
  const tr=document.createElement('tr');tr.style.setProperty('--index',index);
  const sectorCell=document.createElement('td');const identity=document.createElement('div');identity.className='sector-cell';identity.style.setProperty('--accent',sector.accent);identity.style.setProperty('--tint',sector.tint);
  const mark=document.createElement('span');mark.className='sector-mark';mark.setAttribute('aria-hidden','true');mark.textContent=sector.name.slice(0,1);
  const open=document.createElement('button');open.type='button';open.dataset.sector=sector.id;open.textContent=sector.name;open.setAttribute('aria-label',`Open ${sector.name} industry details`);identity.append(mark,open);sectorCell.append(identity);
  const cagr=document.createElement('td');cagr.textContent=`${sector.cagr.toFixed(1)}%`;
  const forecast=document.createElement('td');forecast.className='matrix-projection';forecast.textContent=`$${projection.toLocaleString('en-US')}B`;
  const momentum=document.createElement('td');const momentumContent=document.createElement('div');momentumContent.className='momentum-cell';momentumContent.style.setProperty('--accent',sector.accent);
  const momentumValue=document.createElement('span');momentumValue.className='momentum-value';momentumValue.textContent=`${metric.momentum.toFixed(1)}%`;
  const track=document.createElement('span');track.className='momentum-track';const fill=document.createElement('span');fill.style.setProperty('--momentum',`${Math.min(metric.momentum/40*100,100)}%`);track.append(fill);momentumContent.append(momentumValue,track);momentum.append(momentumContent);
  const research=document.createElement('td');research.className=metric.research>25?'rd-high':metric.research>15?'rd-mid':'rd-low';research.textContent=`${metric.research.toFixed(1)}%`;
  const risk=document.createElement('td');risk.className='risk-cell';const score=document.createElement('span');score.className=`risk-score ${metric.risk<70?'watch':metric.risk<80?'moderate':''}`;score.textContent=`${metric.risk}/100`;const label=document.createElement('small');label.textContent=metric.riskLabel;risk.append(score,label);
  tr.append(sectorCell,cagr,forecast,momentum,research,risk);$('matrix-rows').append(tr);
 });
 $('matrix-empty').hidden=rows.length>0;
}

function renderMarketShare(){
 const chart=$('share-chart');const legend=$('share-legend');
 industries.forEach((sector,index)=>{
  const segment=document.createElement('span');segment.className='share-segment';segment.style.setProperty('--share',`${marketShares[sector.id]}%`);segment.style.setProperty('--accent',sector.accent);segment.style.animationDelay=`${index*55}ms`;segment.title=`${sector.name}: ${marketShares[sector.id]}%`;segment.setAttribute('aria-hidden','true');chart.append(segment);
  const item=document.createElement('div');item.className='share-legend-item';item.style.setProperty('--accent',sector.accent);const dot=document.createElement('i');const copy=document.createElement('span');const name=document.createElement('strong');name.textContent=sector.name;copy.append(name,document.createTextNode(`${marketShares[sector.id]}% TAM`));item.append(dot,copy);legend.append(item);
 });
}

function renderRegions(){
 regions.forEach((region,index)=>{
  const row=document.createElement('div');row.className='region-row';
  const name=document.createElement('span');name.className='region-label';name.textContent=region.name;
  const track=document.createElement('span');track.className='region-track';const fill=document.createElement('span');fill.style.setProperty('--region-share',`${region.share}%`);fill.style.animationDelay=`${index*90}ms`;track.append(fill);
  const value=document.createElement('span');value.className='region-value';const percent=document.createElement('strong');percent.textContent=`${region.share}%`;value.append(percent,document.createTextNode(` (${region.value})`));
  row.append(name,track,value);$('regional-adoption').append(row);
 });
}

function renderSignals(query=''){
 const visible=signals.filter(signal=>`${signal.title} ${signal.text} ${signal.search}`.toLowerCase().includes(query));
 $('trend-signals').replaceChildren();
 visible.forEach(signal=>{
  const item=document.createElement('article');item.className='trend-signal';
  const icon=document.createElement('span');icon.className=`signal-icon ${signal.tone}`;icon.setAttribute('aria-hidden','true');icon.textContent=signal.icon;
  const copy=document.createElement('div');copy.className='signal-copy';const title=document.createElement('h3');title.textContent=signal.title;const text=document.createElement('p');text.textContent=signal.text;copy.append(title,text);
  const meta=document.createElement('div');meta.className='signal-meta';const impact=document.createElement('span');impact.textContent=signal.impact;const capital=document.createElement('small');capital.textContent=signal.capital;meta.append(impact,capital);
  item.append(icon,copy,meta);$('trend-signals').append(item);
 });
 $('signals-empty').hidden=visible.length>0;
}

function renderRecommendations(){
 recommendations.forEach((recommendation,index)=>{
  const item=document.createElement('article');item.className='recommendation';
  const number=document.createElement('span');number.className='recommendation-number';number.textContent=String(index+1);
  const copy=document.createElement('div');copy.className='recommendation-copy';const title=document.createElement('h3');title.textContent=recommendation.title;const text=document.createElement('p');text.textContent=recommendation.text;copy.append(title,text);item.append(number,copy);$('recommendations').append(item);
 });
}

function render(){
 const query=$('search').value.trim().toLowerCase();
 renderMatrix(query);
 renderSignals(query);
}

function showDialog(title,paragraphs){
 $('dialog-title').textContent=title;$('dialog-content').replaceChildren();
 paragraphs.forEach(text=>{const p=document.createElement('p');p.textContent=text;$('dialog-content').append(p);});
 $('dialog').showModal();
}

let toastTimer;
function toast(message){
 clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;
 toastTimer=setTimeout(()=>$('toast').hidden=true,3500);
}

function exportCsv(){
 const rows=[...$('matrix-rows').querySelectorAll('tr')].map(row=>[...row.cells].map(cell=>cell.innerText.replace(/\s+/g,' ').trim()));
 if(!rows.length){toast('There are no sector rows to export.');return;}
 const content=[['Sector','2024 CAGR','Projection','CAGR Momentum','R&D % Revenue','Risk / Reward'],...rows];
 const csv='\uFEFF'+content.map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download=`NexIndustry-Trends-${selectedPeriod}Y.csv`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 toast('Trends data exported as CSV.');
}

document.querySelectorAll('[data-period]').forEach((button,index,buttons)=>{
 button.onclick=()=>{selectedPeriod=Number(button.dataset.period);buttons.forEach(item=>{const active=item===button;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;});render();};
 button.onkeydown=event=>{let next;if(event.key==='ArrowRight')next=(index+1)%buttons.length;if(event.key==='ArrowLeft')next=(index+buttons.length-1)%buttons.length;if(event.key==='Home')next=0;if(event.key==='End')next=buttons.length-1;if(next!==undefined){event.preventDefault();buttons[next].focus();buttons[next].click();}};
});
$('search').addEventListener('input',render);
$('export-data').onclick=exportCsv;
$('matrix-rows').onclick=event=>{const button=event.target.closest('[data-sector]');if(button)location.assign(`industry-details.html?sector=${encodeURIComponent(button.dataset.sector)}`);};

$('close-dialog').onclick=()=>$('dialog').close();
$('dialog-done').onclick=()=>$('dialog').close();
$('dialog').onclick=event=>{const rect=$('dialog').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)$('dialog').close();};
$('profile').onclick=()=>location.assign('settings.html');
if(user){$('avatar').textContent=user.name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase();$('avatar').onclick=()=>$('profile').click();}
$('notifications').onclick=()=>showDialog('Analytics Update',['The sector benchmark includes six emerging industries and a set of illustrative forward-looking indicators.','Use the forecast period controls to compare projections or export the current matrix as CSV.','No live market feed is connected.']);
$('menu').onclick=()=>{$('menu').setAttribute('aria-expanded',String($('sidebar').classList.toggle('open')));};
$('signout').onclick=()=>{try{localStorage.removeItem('nex-session');sessionStorage.removeItem('nex-session');location.replace('index.html');}catch{toast('Allow browser storage to end the local session.');}};
document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>{
 const view=button.dataset.view;
 if(view==='trends'){window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});$('sidebar').classList.remove('open');$('menu').setAttribute('aria-expanded','false');return;}
 location.assign(view==='industries'?'industries.html':view==='details'?'industry-details.html?sector=ai':'dashboard.html');
});
document.addEventListener('keydown',event=>{
 if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('dialog').open){event.preventDefault();$('search').focus();}
 if(event.key==='Escape'){$('sidebar').classList.remove('open');$('menu').setAttribute('aria-expanded','false');}
});
$('year').textContent=new Date().getFullYear();
document.querySelectorAll('.trend-metric').forEach((metric,index)=>metric.style.setProperty('--index',index));
renderMarketShare();renderRegions();renderRecommendations();render();

const counters=[...document.querySelectorAll('[data-count]')];
function updateCounters(progress){const eased=1-Math.pow(1-progress,4);counters.forEach(counter=>counter.textContent=(Number(counter.dataset.count)*eased).toFixed(Number(counter.dataset.decimals||0)));}
if(reducedMotion.matches)updateCounters(1);
else{const start=performance.now();function tick(time){const progress=Math.min((time-start)/900,1);updateCounters(progress);if(progress<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);}

if('IntersectionObserver' in window&&!reducedMotion.matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll('.matrix-panel,.visualization-card,.radar-panel,.recommendations-panel').forEach(section=>{section.classList.add('observe-reveal');observer.observe(section);});
}
window.addEventListener('pageshow',()=>{
 try{const session=JSON.parse(sessionStorage.getItem('nex-session')||localStorage.getItem('nex-session')||'null');if(!session||session.expires<=Date.now())location.replace('index.html');}
 catch{location.replace('index.html');}
});
