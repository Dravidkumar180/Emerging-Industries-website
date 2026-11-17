const $=id=>document.getElementById(id);
let session;
let user;
try{
 session=JSON.parse(sessionStorage.getItem('nex-session')||localStorage.getItem('nex-session')||'null');
 user=session&&session.expires>Date.now()&&JSON.parse(localStorage.getItem('nex-accounts')||'[]').find(account=>account.email===session.email);
}catch(error){console.error('Unable to read the local demo account.',error);}
if(!user)location.replace('index.html');

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const notificationKey=`nex-settings-notifications:${user?.email||'demo'}`;
const watchlistKey=`nex-watchlists:${user?.email||'demo'}`;
const watchlistCatalog=[
 {id:'robotics',name:'Humanoid Robotics Scopes',entities:42},
 {id:'energy',name:'Solid State Battery Pilots',entities:19},
 {id:'space',name:'Sub-orbital Payload Log',entities:8},
 {id:'bio',name:'Precision Medicine Pipeline',entities:21},
 {id:'ai',name:'Enterprise AI Infrastructure',entities:35},
 {id:'fintech',name:'Real-Time Payments Watch',entities:14}
];
const notificationSettings=[
 {id:'dailyDigest',icon:'▣',title:'Daily Industry Digest email',description:'Synthesized executive intelligence bulletin distributed daily at 06:00 EST.',enabled:true},
 {id:'growthAlerts',icon:'↗',title:'Breaking growth alert threshold',description:'Instant alert when market volatility exceeds a ±15% momentum swing.',enabled:true},
 {id:'weeklyRoundup',icon:'▤',title:'Weekly market valuation roundup',description:'Aggregated valuations, funding tranches, and market multiples report.',enabled:true},
 {id:'reportReleases',icon:'▧',title:'Analytical PDF report releases',description:'Notify when new institutional whitepapers and research briefs are published.',enabled:false}
];
let notifications={};
let watchlists=['robotics','energy','space'];
try{
 const savedNotifications=JSON.parse(localStorage.getItem(notificationKey)||'{}');
 if(savedNotifications&&typeof savedNotifications==='object'&&!Array.isArray(savedNotifications))notifications=savedNotifications;
 const savedWatchlists=JSON.parse(localStorage.getItem(watchlistKey)||'null');
 if(Array.isArray(savedWatchlists))watchlists=savedWatchlists.filter(id=>watchlistCatalog.some(item=>item.id===id));
}catch(error){console.error('Unable to read saved settings preferences.',error);}

function initials(name){return name.trim().split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'NI';}
function setProfileFields(){
 const nameParts=(user.name||'NexIndustry Analyst').trim().split(/\s+/);
 $('first-name').value=user.firstName||nameParts.shift()||'';
 $('last-name').value=user.lastName||nameParts.join(' ');
 $('work-email').value=user.email||'';
 $('job-role').value=user.jobRole||'Lead Industry Analyst — Emerging Tech & Autonomous Systems';
 $('industry-focus').value=user.industryFocus||'ai';
 const currentZone=user.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone;
 $('timezone').value=[...$('timezone').options].some(option=>option.value===currentZone)?currentZone:'America/Los_Angeles';
 updateProfileSummary();
}

function updateProfileSummary(){
 const name=`${$('first-name').value.trim()} ${$('last-name').value.trim()}`.trim()||'NexIndustry Analyst';
 $('profile-name').textContent=name;
 $('profile-role').textContent=$('job-role').value.trim()||'NexIndustry Analyst';
 $('profile-email').textContent=user.email||'';
 $('profile-timezone').textContent=$('timezone').selectedOptions[0]?.textContent||'Timezone not set';
 $('profile-avatar').textContent=initials(name);
 $('avatar').textContent=initials(name);
}

function toast(message){
 clearTimeout(toast.timer);$('toast').textContent=message;$('toast').hidden=false;
 toast.timer=setTimeout(()=>$('toast').hidden=true,3500);
}

function renderNotificationOptions(){
 notificationSettings.forEach(setting=>{
  const row=document.createElement('label');row.className='notification-option';
  const icon=document.createElement('span');icon.className='notification-symbol';icon.setAttribute('aria-hidden','true');icon.textContent=setting.icon;
  const content=document.createElement('span');const title=document.createElement('strong');title.textContent=setting.title;const description=document.createElement('p');description.textContent=setting.description;content.append(title,description);
  const switchLabel=document.createElement('span');switchLabel.className='switch';
  const input=document.createElement('input');input.type='checkbox';input.name=setting.id;input.checked=notifications[setting.id]??setting.enabled;input.setAttribute('aria-label',setting.title);
  const track=document.createElement('span');track.className='switch-track';switchLabel.append(input,track);row.append(icon,content,switchLabel);$('notification-options').append(row);
  input.onchange=()=>{
   const previous=!input.checked;notifications[setting.id]=input.checked;
   try{localStorage.setItem(notificationKey,JSON.stringify(notifications));toast(input.checked?'Preference enabled.':'Preference disabled.');}
   catch(error){console.error('Unable to save notification preference.',error);input.checked=previous;notifications[setting.id]=previous;toast('Browser storage is unavailable; this preference was not saved.');}
  };
 });
}

function persistWatchlists(next){
 try{localStorage.setItem(watchlistKey,JSON.stringify(next));watchlists=next;renderWatchlists();return true;}
 catch(error){console.error('Unable to save watchlist preferences.',error);toast('Browser storage is unavailable; watchlist changes were not saved.');return false;}
}

function renderWatchlists(){
 $('watchlist-feeds').replaceChildren();
 watchlistCatalog.filter(item=>watchlists.includes(item.id)).forEach(item=>{
  const row=document.createElement('div');row.className='watchlist-feed';
  const dot=document.createElement('i');dot.setAttribute('aria-hidden','true');
  const details=document.createElement('span');const title=document.createElement('strong');title.textContent=item.name;const meta=document.createElement('small');meta.textContent='Sample research feed';details.append(title,meta);
  const count=document.createElement('span');count.textContent=`${item.entities} entities`;row.append(dot,details,count);$('watchlist-feeds').append(row);
 });
 $('watchlist-count').textContent=String(watchlists.length);
 if(!watchlists.length){const empty=document.createElement('p');empty.className='watchlist-empty';empty.textContent='No watchlists are active. Choose feeds to follow.';$('watchlist-feeds').append(empty);}
}

function showDialog(title){
 $('dialog-title').textContent=title;$('dialog-content').replaceChildren();$('dialog').showModal();
}

function openWatchlistManager(){
 showDialog('Manage Industry Watchlists');
 const intro=document.createElement('p');intro.textContent='Choose the sector feeds to include in your active watchlists.';$('dialog-content').append(intro);
 const choices=document.createElement('div');choices.className='watchlist-choices';
 watchlistCatalog.forEach(item=>{
  const label=document.createElement('label');label.className='watchlist-choice';
  const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.value=item.id;checkbox.checked=watchlists.includes(item.id);
  label.append(checkbox,document.createTextNode(`${item.name} · ${item.entities} entities`));choices.append(label);
 });
 $('dialog-content').append(choices);
 $('dialog-cancel').textContent='Cancel';$('dialog-confirm').textContent='Save Watchlists';
 $('dialog-cancel').onclick=()=>$('dialog').close();
 $('dialog-confirm').onclick=()=>{
  const next=[...choices.querySelectorAll('input:checked')].map(input=>input.value);
  if(persistWatchlists(next)){$('dialog').close();toast('Watchlist preferences saved.');}
 };
}

function requestSignOut(){
 showDialog('Confirm Sign Out');
 const copy=document.createElement('p');copy.textContent='This will end the current NexIndustry session on this device. Your profile and saved preferences will remain in this browser.';$('dialog-content').append(copy);
 $('dialog-cancel').textContent='Stay Logged In';$('dialog-confirm').textContent='Confirm Sign Out';
 $('dialog-cancel').onclick=()=>$('dialog').close();
 $('dialog-confirm').onclick=()=>{
  try{localStorage.removeItem('nex-session');sessionStorage.removeItem('nex-session');location.replace('index.html');}
  catch(error){console.error('Unable to clear the local demo session.',error);$('dialog').close();toast('Browser storage is unavailable; the session could not be cleared.');}
 };
}

function detectDevice(){
 const agent=navigator.userAgent;
 const browser=agent.includes('Edg/')?'Microsoft Edge':agent.includes('Chrome/')?'Chrome':agent.includes('Firefox/')?'Firefox':agent.includes('Safari/')?'Safari':'Browser';
 const platform=/Windows/i.test(agent)?'Windows':/Macintosh|Mac OS/i.test(agent)?'macOS':/Android/i.test(agent)?'Android':/iPhone|iPad/i.test(agent)?'iOS':/Linux/i.test(agent)?'Linux':'this device';
 $('device-name').textContent=`${browser} on ${platform}`;
 $('session-expiry').textContent=session?.expires?new Date(session.expires).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'}):'Session status unavailable';
}

industries.forEach(item=>{const option=document.createElement('option');option.value=item.id;option.textContent=item.name;$('industry-focus').append(option);});
setProfileFields();detectDevice();renderNotificationOptions();renderWatchlists();

$('profile-form').addEventListener('input',updateProfileSummary);
$('profile-form').addEventListener('change',updateProfileSummary);
$('profile-form').onsubmit=event=>{
 event.preventDefault();
 const firstName=$('first-name').value.trim();const lastName=$('last-name').value.trim();
 if(!firstName||!lastName){toast('Enter both a first and last name.');return;}
 try{
  const accounts=JSON.parse(localStorage.getItem('nex-accounts')||'[]');
  const index=accounts.findIndex(account=>account.email===user.email);
  if(index<0)throw new Error('The active demo account could not be found.');
  user={...accounts[index],firstName,lastName,name:`${firstName} ${lastName}`,jobRole:$('job-role').value.trim(),industryFocus:$('industry-focus').value,timezone:$('timezone').value};
  accounts[index]=user;localStorage.setItem('nex-accounts',JSON.stringify(accounts));updateProfileSummary();toast('Profile settings saved.');
 }catch(error){console.error('Unable to save profile settings.',error);toast(error.message||'Profile settings could not be saved.');}
};
$('discard-profile').onclick=()=>{setProfileFields();toast('Unsaved profile changes discarded.');};
$('manage-watchlists').onclick=openWatchlistManager;
$('signout-all').onclick=requestSignOut;$('confirm-signout').onclick=requestSignOut;$('signout').onclick=requestSignOut;
$('stay-signed-in').onclick=()=>{window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});};
$('notifications').onclick=()=>{document.querySelector('[data-scroll="#notifications-section"]').click();toast('Manage your research alerts and digests here.');};
$('avatar').onclick=()=>window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});
$('close-dialog').onclick=()=>$('dialog').close();
$('dialog').onclick=event=>{const rect=$('dialog').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)$('dialog').close();};
$('menu').onclick=()=>{$('menu').setAttribute('aria-expanded',String($('sidebar').classList.toggle('open')));};

document.querySelectorAll('.settings-tab').forEach(button=>{
 button.onclick=()=>{
  const target=document.querySelector(button.dataset.scroll);if(!target)return;
  document.querySelectorAll('.settings-tab').forEach(item=>{item.classList.toggle('active',item===button);if(item===button)item.setAttribute('aria-current','location');else item.removeAttribute('aria-current');});
  target.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});
  if(button.dataset.scroll==='#signout-section')$('confirm-signout').focus({preventScroll:true});
 };
});
$('portal-signout').onclick=()=>document.querySelector('[data-scroll="#signout-section"]').click();

document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>{
 const view=button.dataset.view;
 if(view==='settings'){window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});$('sidebar').classList.remove('open');$('menu').setAttribute('aria-expanded','false');return;}
 location.assign(view==='industries'?'industries.html':view==='details'?'industry-details.html?sector=ai':view==='trends'?'trends.html':'dashboard.html');
});

document.addEventListener('keydown',event=>{
 if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('dialog').open){event.preventDefault();$('search').focus();}
 if(event.key==='Escape'){$('sidebar').classList.remove('open');$('menu').setAttribute('aria-expanded','false');}
});
$('year').textContent=new Date().getFullYear();

if('IntersectionObserver' in window&&!reducedMotion.matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll('.settings-section,.signout-panel').forEach(section=>{section.classList.add('settings-reveal');observer.observe(section);});
}
window.addEventListener('pageshow',()=>{
 try{const current=JSON.parse(sessionStorage.getItem('nex-session')||localStorage.getItem('nex-session')||'null');if(!current||current.expires<=Date.now())location.replace('index.html');}
 catch(error){console.error('Unable to validate the local demo session.',error);location.replace('index.html');}
});
