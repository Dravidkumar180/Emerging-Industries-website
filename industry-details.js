// Local browser demo. Financial figures and projections are illustrative.
const $=id=>document.getElementById(id);
const sector=industries.find(item=>item.id===new URLSearchParams(location.search).get('sector'))||industries[0];
let user;
try{const session=JSON.parse(sessionStorage.getItem('nex-session')||localStorage.getItem('nex-session')||'null');user=session&&session.expires>Date.now()&&JSON.parse(localStorage.getItem('nex-accounts')||'[]').find(item=>item.email===session.email);}catch{}
if(!user)location.replace('index.html');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const isAI=sector.id==='ai';
const profiles={
 ai:{title:'Artificial Intelligence & Machine Intelligence',description:'Institutional assessment covering full-stack enterprise AI compute infrastructure, frontier model training topologies, parameter-efficient fine-tuning (PEFT), and multi-modal autonomous systems scaling across regulated global verticals.',funding:84.2,maturity:'High Acceleration',stage:'Expansionary S-Curve',short:'AI',catalysts:[['⌁','Enterprise Productivity Mandates','Global Global 2000 organizations reallocating a sustained 12–18% of IT software budgets directly toward inference APIs and specialized workplace agent orchestration.'],['▣','Computing Efficiency & Silicon Scale','Hardware token throughput efficiency gains yielding a 7.4x drop in per-token generation cost over 24 months, accelerating real-time reasoning viability.'],['☷','Domain-Specific Moats & Small Language Models','Transition from generalist chatbots toward compact 7B–30B parameter architectures customized with proprietary operational telemetry and legal compliance data.']]},
 energy:{title:'Green Energy & Climate Infrastructure',funding:62.8,maturity:'Critical Transition',stage:'Infrastructure Expansion',short:'Green Energy'},
 bio:{title:'Biotechnology & Precision Medicine',funding:48.6,maturity:'Clinical Scaling',stage:'Therapeutic Expansion',short:'Biotech'},
 robotics:{title:'Robotics & Autonomous Systems',funding:32.4,maturity:'Rapid Adoption',stage:'Commercial Deployment',short:'Robotics'},
 space:{title:'Space Technology & Orbital Infrastructure',funding:21.8,maturity:'Frontier Expansion',stage:'Capital-Intensive Scale',short:'Space'},
 fintech:{title:'Fintech & Financial Infrastructure',funding:39.2,maturity:'Maturing Scale',stage:'Platform Consolidation',short:'Fintech'}
};
const profile=profiles[sector.id];
const applications=[
 {tag:'Enterprise Core',title:'Autonomous Enterprise Workflows & Agents',description:'Multi-agent coordinating swarms handling complex reconciliation, multi-tier procurement, and deterministic code remediation without human intervention.',metric:'Estimated TAM',value:'$280B by 2028',image:'assets/enterprise.svg'},
 {tag:'Life Sciences',title:'AI-Accelerated Drug & Molecular Discovery',description:'Diffusion-based de novo protein generation reducing Phase 0 candidate synthesis cycles from 4.5 years down to sub-9 months for oncology pipelines.',metric:'Pipeline ROI',value:'3.4x Cycle Speed',image:'assets/life-sciences.svg'},
 {tag:'Robotics & Mobility',title:'Vision Systems in AVs & Industrial Robotics',description:'End-to-end neural world models synthesizing high-framerate spatial sensor streams for Level 4 commercial logistics and humanoid factory line manipulation.',metric:'Active Fleets',value:'145k+ Autonomous Units',image:'assets/robotics.svg'},
 {tag:'Fintech & Banking',title:'Real-Time Fraud & Risk Modeling',description:'Sub-millisecond graph convolutional networks evaluating behavioral anomalies across payment networks, lowering false positive denial friction by 43%.',metric:'Prevented Losses',value:'$19.8B in 2024',image:'assets/fintech.svg'}
];
const sectorApplications={energy:['Grid-Scale Energy Storage','Next-Generation Solar Platforms','Green Hydrogen Infrastructure','Intelligent Grid Optimization'],bio:['Precision Therapy Platforms','Molecular Discovery Pipelines','Cellular Bio-Fabrication','Clinical Analytics Systems'],robotics:['Autonomous Enterprise Operations','Collaborative Industrial Cobots','Computer-Vision Logistics','Warehouse Automation'],space:['Low-Earth Orbital Networks','Commercial Research Platforms','Reusable Launch Systems','Satellite Connectivity Services'],fintech:['Embedded Financial Platforms','AI Underwriting Systems','Cross-Border Payment Networks','Real-Time Fraud & Risk Modeling']};
const aiOutlook={
 readiness:82,
 maturity:[
  ['mature','Agentic Tool-Use Verification Standards','High Maturity','Standardized APIs for function calling, sandbox evaluation, and deterministic output verification across enterprise databases.'],
  ['mature','Synthetic Data Compliance Protocols','In Production','Audited synthetic data pipelines preventing model collapse while ensuring GDPR/HIPAA training compliance.'],
  ['transition','Autonomous Legal Liability Alignment','Transitional','Global harmonization of liability frameworks (EU AI Act Title III and US OMB Memoranda) for autonomous agent actions.'],
  ['early','Sub-100mW Neuromorphic Edge Inference','Early Commercial','Ultra-low-power local edge processors capable of on-device LLM distillation for healthcare wearables and off-grid IoT.']
 ],
 catalysts:[
  ['Next-Gen 3nm/2nm Silicon','Packaging innovation delivering 40% memory bandwidth expansions for tensor accelerators.'],
  ['Direct Grid Co-Location','Hyperscalers acquiring SMR (Small Modular Reactor) nuclear agreements to ensure steady gigawatt uptime.']
 ],
 risks:[
  ['Data Center Power Grid Contention','High Severity','Regional energy rationing could delay scheduled tier-4 cluster commissioning in NA and Western Europe.'],
  ['IP & Training Copyright Litigation','Moderate Severity','Class action rulings may require unlearning mechanisms or licensing royalties for legacy public web scrapings.']
 ]
};
const outlook=isAI?aiOutlook:{
 readiness:Math.round(68+sector.tier*5),
 maturity:[
  ['mature',`${sector.tags[0]} Commercial Pilots`,'High Maturity','Commercial deployments are expanding across target customers with repeatable implementation pathways.'],
  ['mature',`${sector.tags[1]} Infrastructure Standards`,'In Production','Operating and interoperability standards are supporting broader sector-wide deployments.'],
  ['transition',`${sector.tags[2]} Regulatory Alignment`,'Transitional',`Industry frameworks are adapting to deployment needs and ${sector.riskProfile.toLowerCase()} risks.`],
  ['early',`Next-Generation ${profile.short} Platforms`,'Early Commercial','Early deployments are validating cost, performance, and reliability beyond controlled pilots.']
 ],
 catalysts:[
  [`${sector.tags[0]} Scale-Up`,`Commercial momentum in ${sector.tags[0].toLowerCase()} is creating new capacity and adoption opportunities.`],
  [`${sector.tags[1]} Investment`,`Continued investment in ${sector.tags[1].toLowerCase()} is strengthening the sector's deployment pipeline.`]
 ],
 risks:[
  [sector.riskProfile,'High Severity',`Delays tied to ${sector.riskProfile.toLowerCase()} could slow deployment schedules and raise operating costs.`],
  [`${sector.tags[2]} Adoption Constraints`,'Moderate Severity','Uneven standards and implementation costs may extend the path from pilot programs to scaled operations.']
 ]
};
function renderOutlook(){
 $('readiness-score').textContent=String(outlook.readiness);
 const maturityList=$('maturity-list');
 outlook.maturity.forEach(([status,title,badge,description])=>{
  const item=document.createElement('article');item.className=`maturity-item ${status}`;
  const icon=document.createElement('span');icon.className='maturity-icon';icon.setAttribute('aria-hidden','true');icon.textContent=status==='mature'?'✓':'•';
  const copy=document.createElement('div');copy.className='maturity-copy';
  const heading=document.createElement('h3');heading.textContent=title;
  const body=document.createElement('p');body.textContent=description;
  const label=document.createElement('span');label.className='maturity-badge';label.textContent=badge;
  copy.append(heading,body);item.append(icon,copy,label);maturityList.append(item);
 });
 outlook.catalysts.forEach(([title,description])=>{
  const item=document.createElement('article');item.className='outlook-point';
  const arrow=document.createElement('span');arrow.className='outlook-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='→';
  const copy=document.createElement('div');const heading=document.createElement('h3');heading.textContent=title;const body=document.createElement('p');body.textContent=description;
  copy.append(heading,body);item.append(arrow,copy);$('acceleration-catalysts').append(item);
 });
 outlook.risks.forEach(([title,severity,description])=>{
  const item=document.createElement('article');item.className='risk-item';
  const heading=document.createElement('div');heading.className='risk-heading';const name=document.createElement('h3');name.textContent=title;const level=document.createElement('span');level.textContent=severity;
  const body=document.createElement('p');body.textContent=description;heading.append(name,level);item.append(heading,body);$('downside-risks').append(item);
 });
 if(!isAI){document.querySelector('.analyst .analyst-avatar').nextElementSibling.querySelector('small').textContent=`Lead ${profile.short} Analyst`;document.querySelectorAll('.analyst')[1].querySelector('small').textContent=`${profile.short} Systems Lead`;}
}
renderOutlook();
$('breadcrumb-sector').textContent=sector.name;$('sector-title').textContent=profile.title;
$('sector-description').textContent=profile.description||`Institutional assessment of ${sector.name.toLowerCase()}, covering ${sector.tags.join(', ').toLowerCase()}, commercial deployment pathways, and enterprise capital positioning. ${sector.description}`;
$('tier-label').textContent=`TIER ${sector.tier} ${sector.tier===1?'MEGATREND':'GROWTH SECTOR'}`;$('stage-label').textContent=`ϟ Stage: ${profile.stage}`;
$('maturity').textContent=profile.maturity;document.title=`${sector.name} — Industry Details · NexIndustry`;
const marketValue=isAI?1.34:sector.size/1000;
Object.assign($('valuation').dataset,{number:String(marketValue),prefix:'$',suffix:'T',decimals:'2'});
Object.assign($('growth').dataset,{number:String(sector.cagr),suffix:'%',decimals:'1'});
Object.assign($('funding').dataset,{number:String(profile.funding),prefix:'$',suffix:'B',decimals:'1'});
const track=$('track');
const trackedKey=`nex-tracked-sectors:${user?.email||'demo'}`;
let tracked=[];try{tracked=JSON.parse(localStorage.getItem(trackedKey)||'[]');if(!Array.isArray(tracked))tracked=[];}catch{}
function updateTrack(){const active=tracked.includes(sector.id);track.querySelector('span').textContent=active?'Sector Tracked':'Track Sector';track.setAttribute('aria-pressed',String(active));}
track.onclick=()=>{const previous=[...tracked];tracked=tracked.includes(sector.id)?tracked.filter(id=>id!==sector.id):[...tracked,sector.id];try{localStorage.setItem(trackedKey,JSON.stringify(tracked));updateTrack();toast(tracked.includes(sector.id)?'Sector added to your tracked industries.':'Sector removed from your tracked industries.');}catch{tracked=previous;toast('Enable browser storage to save tracked sectors.');}};updateTrack();
const catalysts=profile.catalysts||[['⌁','Enterprise Deployment Demand',`Growing enterprise adoption of ${sector.tags[0].toLowerCase()} is expanding commercial use cases and deployment scale.`],['▣','Infrastructure & Platform Scale',`${sector.tags[1]} is a core focus area as capital investment supports more efficient platforms and commercial infrastructure.`],['☷','Sector-Specific Capabilities',`${sector.tags[2]} creates differentiated opportunities, alongside ${sector.riskProfile.toLowerCase()} risks.`]];
const catalystList=$('catalysts');
catalysts.forEach(([icon,title,text])=>{const article=document.createElement('article');article.className='catalyst';const symbol=document.createElement('span');symbol.className='catalyst-icon';symbol.setAttribute('aria-hidden','true');symbol.textContent=icon;const copy=document.createElement('div');const heading=document.createElement('h3');heading.textContent=title;const p=document.createElement('p');p.textContent=text.replace('Global Global','Global');copy.append(heading,p);article.append(symbol,copy);catalystList.append(article);});
const activeApps=applications.map((app,index)=>isAI?app:{...app,tag:sector.tags[index%sector.tags.length],title:sectorApplications[sector.id][index],description:`Explore enterprise deployment opportunities in ${sectorApplications[sector.id][index].toLowerCase()}, with a focus on ${sector.tags[index%sector.tags.length].toLowerCase()}, operational efficiency, and scalable commercial adoption.`,metric:'Sector Outlook',value:sector.trend});
function renderApps(){const query=$('search').value.trim().toLowerCase();const matches=activeApps.filter(app=>Object.values(app).join(' ').toLowerCase().includes(query));$('applications').innerHTML=matches.map((app,index)=>`<article class="application-card" style="--index:${index}"><div class="application-image"><img src="${app.image}" alt="${app.tag} technology illustration" loading="lazy" width="640" height="420"><span>${app.tag}</span></div><h3>${app.title}</h3><p>${app.description}</p><div class="application-metric"><span>${app.metric}</span><strong>${app.value}</strong></div></article>`).join('');$('applications-empty').hidden=matches.length>0;}
$('search').addEventListener('input',renderApps);renderApps();
const sampleNote=document.createElement('p');sampleNote.className='print-note';sampleNote.textContent='NexIndustry illustrative research briefing. Sample figures and projections from the design reference; not verified market research or investment advice.';document.querySelector('.detail-hero').append(sampleNote);
const years=['2022','2023','2024','2025E','2026E','2027E','2028E','2030E'];
const history=isAI?[386,538,780,1340]:[sector.size*.29,sector.size*.4,sector.size*.58,sector.size];
const forecast=isAI?[1900,2510,3380,4280]:[sector.size*1.3,sector.size*1.7,sector.size*2.2,sector.size*3.1];
const models={consensus:{factor:1,label:'Consensus Model',confidence:'88.4%'},bull:{factor:1.32,label:'Bull Case',confidence:'76.2%'},conservative:{factor:.76,label:'Conservative',confidence:'92.1%'}};
let scenario='consensus';let selectedIndex=7;
const chartStatus=$('chart-selection');
$('chart-title').textContent=`Global ${profile.short} Market Size Forecast ($B USD)`;
const bars=document.querySelector('.forecast-bars')||document.createElement('div');bars.className='forecast-bars';document.querySelector('.chart-area').append(bars);
const maximum=Math.max(...forecast)*1.32;
function values(){return [...history,...forecast.map(value=>Math.round(value*models[scenario].factor))];}
function chart(){const data=values();if(!bars.children.length){years.forEach((year,index)=>{const wrapper=document.createElement('div');wrapper.className='forecast-bar'+(index===3||index===7?' key-year':'');const button=document.createElement('button');button.type='button';button.style.setProperty('--height','1%');button.style.setProperty('--bar-color',index===3?'#2560ef':index===7?'#204bdf':'#8cc1ff');button.innerHTML='<span class="value"></span>';button.onclick=()=>{selectedIndex=index;updateChartStatus();};const label=document.createElement('span');label.textContent=year;wrapper.append(button,label);bars.append(wrapper);});}data.forEach((value,index)=>{const button=bars.children[index].querySelector('button');button.style.setProperty('--height',`${Math.max(5,value/maximum*82)}%`);button.querySelector('.value').textContent='$'+value.toLocaleString('en-US')+'B';button.setAttribute('aria-label',`${years[index]}: ${value.toLocaleString('en-US')} billion US dollars, ${models[scenario].label}`);});$('confidence').textContent=`${scenario==='bull'?'Scenario':'High'} Confidence Index (${models[scenario].confidence})`;updateChartStatus();}
function updateChartStatus(){const value=values()[selectedIndex];chartStatus.textContent=`${years[selectedIndex]} · $${value.toLocaleString('en-US')}B · ${models[scenario].label}`;[...bars.children].forEach((wrapper,index)=>wrapper.querySelector('button').setAttribute('aria-pressed',String(index===selectedIndex)));}
const scenarioButtons=[...document.querySelectorAll('[data-scenario]')];
function selectScenario(button){scenario=button.dataset.scenario;scenarioButtons.forEach(item=>{item.setAttribute('aria-selected',String(item===button));item.tabIndex=item===button?0:-1;});document.querySelector('.scenario-tabs').style.setProperty('--scenario',scenarioButtons.indexOf(button));chart();}
scenarioButtons.forEach((button,index)=>{button.onclick=()=>selectScenario(button);button.onkeydown=event=>{let next;if(event.key==='ArrowRight')next=(index+1)%3;if(event.key==='ArrowLeft')next=(index+2)%3;if(event.key==='Home')next=0;if(event.key==='End')next=2;if(next!==undefined){event.preventDefault();selectScenario(scenarioButtons[next]);scenarioButtons[next].focus();}};});
chart();
function showDialog(title,lines){$('dialog-title').textContent=title;$('dialog-content').replaceChildren();lines.forEach(text=>{const p=document.createElement('p');p.textContent=text;$('dialog-content').append(p);});$('dialog').showModal();}
let toastTimer;function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
$('export-pdf').title='Open the print dialog, then choose Save as PDF';$('export-pdf').onclick=()=>window.print();
$('download-report').title='Open the print dialog, then choose Save as PDF';$('download-report').onclick=()=>window.print();
$('close-dialog').onclick=()=>$('dialog').close();$('dialog-done').onclick=()=>$('dialog').close();$('dialog').onclick=event=>{const r=$('dialog').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$('dialog').close();};
function openSettings(){location.assign('settings.html');}
$('profile').onclick=openSettings;$('avatar').onclick=openSettings;if(user)$('avatar').textContent=user.name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase();
$('notifications').onclick=()=>showDialog('Research Notifications',[`${sector.name}: Q2 2025 consensus snapshot available.`,`Current forecast scenario: ${models[scenario].label}.`,'Research content and financial figures are illustrative. No live market service is connected.']);
document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>{const view=button.dataset.view;if(view==='details'){window.scrollTo({top:0,behavior:motion.matches?'instant':'smooth'});$('sidebar').classList.remove('open');$('menu').setAttribute('aria-expanded','false');return;}location.assign(view==='industries'?'industries.html':view==='trends'?'trends.html':'dashboard.html');});
$('menu').onclick=()=>{$('menu').setAttribute('aria-expanded',String($('sidebar').classList.toggle('open')));};
$('signout').onclick=()=>{try{localStorage.removeItem('nex-session');sessionStorage.removeItem('nex-session');location.replace('index.html');}catch{toast('Allow browser storage to end the local session.');}};
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('dialog').open){event.preventDefault();$('search').focus();}if(event.key==='Escape'){$('sidebar').classList.remove('open');$('menu').setAttribute('aria-expanded','false');}});
$('year').textContent=new Date().getFullYear();document.querySelectorAll('.detail-metrics article').forEach((article,index)=>article.style.setProperty('--index',index));
const counters=[...document.querySelectorAll('[data-number]')];let frame;
function updateCounters(progress){const eased=1-Math.pow(1-progress,4);counters.forEach(counter=>counter.textContent=(counter.dataset.prefix||'')+(Number(counter.dataset.number)*eased).toFixed(Number(counter.dataset.decimals||0))+(counter.dataset.suffix||''));}
if(motion.matches)updateCounters(1);else{const start=performance.now();function tick(time){const progress=Math.min((time-start)/1100,1);updateCounters(progress);if(progress<1)frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);}
if('IntersectionObserver' in window&&!motion.matches){document.body.classList.add('can-observe');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal-section').forEach(section=>observer.observe(section));motion.addEventListener('change',()=>{if(motion.matches){document.body.classList.remove('can-observe');observer.disconnect();cancelAnimationFrame(frame);updateCounters(1);}});}
window.addEventListener('pageshow',()=>{try{const session=JSON.parse(sessionStorage.getItem('nex-session')||localStorage.getItem('nex-session')||'null');if(!session||session.expires<=Date.now())location.replace('index.html');}catch{location.replace('index.html');}});
