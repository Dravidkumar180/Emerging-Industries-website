// Illustrative market data supplied by the design reference, not a live data service.
const sectors=[
 {name:'Artificial Intelligence',growth:34,momentum:'Exponential',potential:'$1.4T',width:91,description:'Compute infrastructure, foundational models, and purpose-built enterprise intelligence.'},
 {name:'Green Energy',growth:28,momentum:'Accelerated',potential:'$980B',width:78,description:'Energy storage, grid modernization, and the transition to low-carbon infrastructure.'},
 {name:'Robotics',label:'Robotics & Automation',growth:25,momentum:'Strong',potential:'$620B',width:70,description:'Autonomous industrial systems and next-generation robotics platforms.'},
 {name:'Biotechnology',growth:22,momentum:'Steady Inflow',potential:'$710B',width:62,description:'Precision therapies, gene editing, and emerging clinical platforms.'},
 {name:'Space Tech',label:'Space Technology',growth:19,momentum:'Capital Intensive',potential:'$430B',width:53,description:'Orbital services, launch infrastructure, and satellite networks.'},
 {name:'Fintech',label:'Emerging Fintech',growth:17,momentum:'Consolidating',potential:'$590B',width:47,description:'Next-generation financial infrastructure and embedded payment networks.'}
];
const opportunities=[
 {name:'Neuromorphic Silicon',description:'Ultra-low power wattage edge processing',sector:'Artificial Intelligence',value:'$148.5 Billion',velocity:'High Priority',type:'high',action:'Overweight / Direct PE'},
 {name:'Solid-State Cathodes',description:'High-density automotive cells',sector:'Green Energy',value:'$92.4 Billion',velocity:'Expanding',type:'expanding',action:'Strategic JV / Scale'},
 {name:'In-Vivo Epigenetic Editing',description:'Targeted single-dose therapeutics',sector:'Biotechnology',value:'$64.0 Billion',velocity:'Monitoring',type:'monitoring',action:'Series B Syndicate'},
 {name:'Autonomous Cargo Fleet',description:'L4 intermodal container units',sector:'Robotics',value:'$112.8 Billion',velocity:'Expanding',type:'expanding',action:'Commercial Rollout'},
 {name:'Low-Earth Orbital Relays',description:'Direct-to-cell phased arrays',sector:'Space Tech',value:'$78.2 Billion',velocity:'High Priority',type:'high',action:'Infrastructure Equity'}
];
const shifts=[{name:'Foundational LLM Capex',meta:'24 mins ago · Venture Syndicate',change:'+31.4%'},{name:'Lithium Refinement Index',meta:'2 hrs ago · Global Commodity',change:'-4.2%'},{name:'Sovereign Space Contracts',meta:'5 hrs ago · Public Procurement',change:'+19.8%'},{name:'Quantum Simulation Rounds',meta:'12 hrs ago · Early Stage VC',change:'+12.1%'}];
const $=id=>document.getElementById(id);
let currentUser;
try{
 const session=JSON.parse(sessionStorage.getItem('nex-session')||localStorage.getItem('nex-session')||'null');
 const accounts=JSON.parse(localStorage.getItem('nex-accounts')||'[]');
 currentUser=session&&session.expires>Date.now()&&accounts.find(account=>account.email===session.email);
}catch{}
if(!currentUser)location.replace('index.html');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function showDialog(title,paragraphs){
 $('dialog-title').textContent=title;$('dialog-content').replaceChildren();
 paragraphs.forEach(text=>{const p=document.createElement('p');p.textContent=text;$('dialog-content').append(p);});
 $('dialog').showModal();
}
function closeDialog(){$('dialog').close();}
$('close-dialog').onclick=closeDialog;$('dialog-done').onclick=closeDialog;
$('dialog').onclick=event=>{const rect=$('dialog').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeDialog();};
let toastTimer;
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
function matches(item){const query=$('search').value.trim().toLowerCase();return($('sector').value==='all'||item.sector===$('sector').value||item.name===$('sector').value)&&Object.values(item).join(' ').toLowerCase().includes(query);}
function render(){
 const selectedSectors=sectors.filter(matches);const selectedOpportunities=opportunities.filter(matches);
 $('sectors').innerHTML=selectedSectors.map(sector=>`<article class="sector"><div class="sector-title"><button data-sector="${sector.name}">${sector.label||sector.name}</button><strong>${sector.growth}% CAGR</strong></div><div class="bar" style="--bar:${sector.width}%"><span></span></div><div class="sector-meta"><span>Momentum: ${sector.momentum}</span><span>${sector.potential} Potential</span></div></article>`).join('');
 $('opportunities').innerHTML=selectedOpportunities.map(item=>`<tr><td><strong>${item.name}</strong><small>${item.description}</small></td><td><span class="sector-tag">${item.sector}</span></td><td><strong>${item.value.replace(' ','<br>')}</strong></td><td><span class="velocity ${item.type}">${item.type==='high'?'⌁':item.type==='expanding'?'↗':'◉'} ${item.velocity}</span></td><td><button class="action" data-opportunity="${item.name}">${item.action}</button></td></tr>`).join('');
 $('sector-empty').hidden=selectedSectors.length>0;$('opportunity-empty').hidden=selectedOpportunities.length>0;
 $('result-count').textContent=`${selectedSectors.length} sectors · ${selectedOpportunities.length} opportunities`;
 const visible=shifts.filter(item=>!$('search').value.trim()||Object.values(item).join(' ').toLowerCase().includes($('search').value.trim().toLowerCase()));
 $('shifts').innerHTML=visible.length?visible.map(item=>`<div class="shift"><div><strong>${item.name}</strong><small>${item.meta}</small></div><span class="badge ${item.change.startsWith('-')?'negative':'positive'}">${item.change}</span></div>`).join(''):'<p class="empty">No matching market shifts.</p>';
}
$('sectors').onclick=event=>{const button=event.target.closest('[data-sector]');if(!button)return;const sector=sectors.find(item=>item.name===button.dataset.sector);showDialog(sector.label||sector.name,[sector.description,`${sector.growth}% CAGR · ${sector.potential} potential · ${sector.momentum} momentum`,'These figures are illustrative sample data from the dashboard design.']);};
$('opportunities').onclick=event=>{const button=event.target.closest('[data-opportunity]');if(!button)return;const item=opportunities.find(item=>item.name===button.dataset.opportunity);showDialog(item.name,[item.description,`${item.sector} · ${item.value} estimated 2026 value`,`${item.velocity} · Strategic action: ${item.action}`,'Illustrative research scenario. This demonstration does not provide investment advice.']);};
$('search').addEventListener('input',render);$('sector').onchange=render;
$('filter-button').onclick=()=>{$('filter-panel').hidden=!$('filter-panel').hidden;$('filter-button').setAttribute('aria-expanded',String(!$('filter-panel').hidden));if(!$('filter-panel').hidden)$('sector').focus();};
$('clear').onclick=()=>{$('sector').value='all';$('search').value='';render();};
$('matrix').onclick=()=>showDialog('Opportunity comparison matrix',opportunities.filter(matches).map(item=>`${item.name}: ${item.value} · ${item.velocity} · ${item.action}`).concat(['Sample estimates for interface demonstration.']));
$('export').onclick=()=>{
 const lines=['NEXINDUSTRY — EXECUTIVE BRIEF','Q3 Market Intelligence Update','Illustrative sample data; not live market information.','',`Sector: ${$('sector').value}`,`Search: ${$('search').value||'All'}`,'','MARKET OVERVIEW','$4.82 Trillion total capitalization | 24.6% CAGR | $312 Billion capital inflows | 88/100 opportunity index','','SECTOR TRAJECTORIES',...sectors.filter(matches).map(item=>`${item.label||item.name}: ${item.growth}% CAGR | ${item.potential} potential | ${item.momentum}`),'','KEY MARKET OPPORTUNITIES',...opportunities.filter(matches).map(item=>`${item.name} | ${item.sector} | ${item.value} | ${item.velocity} | ${item.action}`)];
 const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='NexIndustry-Executive-Brief.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Executive brief exported successfully.');
};
function openSettings(){location.assign('settings.html');}
$('profile').onclick=openSettings;$('avatar').onclick=openSettings;
if(currentUser)$('avatar').textContent=currentUser.name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase();
$('notifications').onclick=()=>showDialog('Intelligence notifications',['Q3 Market Intelligence Update is ready to explore.','Six sector trajectories and five market opportunities are included in this sample dashboard.','Use Filter by Sector to narrow your research or export an executive brief.']);
document.querySelectorAll('[data-highlight]').forEach(button=>button.onclick=()=>showDialog(button.dataset.highlight,[button.querySelector('span').textContent,'This milestone is sample content reproduced from the supplied dashboard reference. A verified research feed has not been connected.']));
$('dossiers').onclick=()=>showDialog('Sector research dossiers',sectors.filter(matches).map(item=>`${item.label||item.name} — ${item.description}`).concat(['Full research documents are not included in this interface demonstration.']));
document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>{
 document.querySelectorAll('[data-view]').forEach(item=>item.classList.toggle('active',item===button));
 const view=button.dataset.view;
 if(view==='industries'){location.assign('industries.html');return;}
 if(view==='details'){location.assign('industry-details.html?sector=ai');return;}
 if(view==='trends'){location.assign('trends.html');return;}
 $('page-title').textContent={dashboard:'Emerging Industries Dashboard',industries:'Emerging Industries',details:'Industry Details',trends:'Trends & Analytics'}[view];
 $('page-subtitle').textContent={dashboard:'Real-time valuation models, trajectory analytics, and strategic venture positioning.',industries:'Explore six emerging sectors and their growth trajectories.',details:'Select a sector to explore its market potential and strategic opportunities.',trends:'Compare sector momentum, capital inflows, and market opportunities.'}[view];
 if(view==='dashboard'){$('sector').value='all';$('search').value='';render();}
 if(view==='details'){$('filter-panel').hidden=false;$('filter-button').setAttribute('aria-expanded','true');$('sector').focus();}
 if(view==='industries'||view==='trends')$('sector-section').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});
 $('sidebar').classList.remove('open');$('menu').setAttribute('aria-expanded','false');
});
$('menu').onclick=()=>{const open=$('sidebar').classList.toggle('open');$('menu').setAttribute('aria-expanded',String(open));};
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName)&&!$('dialog').open){event.preventDefault();$('search').focus();}if(event.key==='Escape'){$('sidebar').classList.remove('open');$('menu').setAttribute('aria-expanded','false');}});
$('signout').onclick=()=>{try{localStorage.removeItem('nex-session');sessionStorage.removeItem('nex-session');location.replace('index.html');}catch{toast('Browser storage is unavailable. Please enable it to sign out.');}};
$('year').textContent=new Date().getFullYear();
render();
document.querySelectorAll('.metric').forEach((metric,index)=>metric.style.setProperty('--index',index));
if(!reducedMotion.matches){
 const start=performance.now();const counters=[...document.querySelectorAll('[data-count]')];
 function tick(time){const progress=Math.min((time-start)/1100,1);const eased=1-Math.pow(1-progress,4);counters.forEach(counter=>counter.textContent=(Number(counter.dataset.count)*eased).toFixed(Number(counter.dataset.decimals||0)));if(progress<1)requestAnimationFrame(tick);}
 requestAnimationFrame(tick);
}
window.addEventListener('pageshow',()=>{try{const session=JSON.parse(sessionStorage.getItem('nex-session')||localStorage.getItem('nex-session')||'null');if(!session||session.expires<=Date.now())location.replace('index.html');}catch{location.replace('index.html');}});
