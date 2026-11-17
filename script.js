const $=id=>document.getElementById(id);
let mode='signin';
const token=null;
if(token)history.replaceState(null,'',location.pathname);
function feedback(message,success=false){$('feedback').textContent=message;$('feedback').className=success?'success':'';$('feedback').hidden=!message;}
function render(){const signup=mode==='signup',forgot=mode==='forgot',reset=mode==='reset';$('heading').textContent=signup?'Join NexIndustry':forgot?'Reset your password':reset?'Choose a new password':'Welcome back to NexIndustry';$('subtitle').textContent=signup?'Your edge in the industries shaping tomorrow.':forgot?'We’ll help you get back to your industry insights.':reset?'Create a strong password to secure your account.':'Access deep data and market trends across global emerging sectors.';$('signin').setAttribute('aria-selected',String(!signup));$('signup').setAttribute('aria-selected',String(signup));$('name-field').hidden=!signup;$('email-field').hidden=reset;$('password-field').hidden=forgot;$('password-help').hidden=!(signup||reset);$('options').hidden=forgot||reset;$('forgot').hidden=signup||reset;$('alternatives').hidden=forgot||reset;$('password').autocomplete=signup||reset?'new-password':'current-password';$('submit').firstElementChild.textContent=signup?'Create Your Account':forgot?'Send Reset Link':reset?'Update Password':'Sign In to Dashboard';$('password').value='';$('password').type='password';$('toggle-password').setAttribute('aria-label','Show password');$('confirm-field').hidden=!signup;$('confirm-password').value='';$('strength').hidden=!signup;$('strength').dataset.level='0';$('password-help').textContent='Use at least 10 characters for a strong password.';document.querySelector('.tabs').classList.toggle('is-signup',signup);$('signin').tabIndex=signup?-1:0;$('signup').tabIndex=signup?0:-1;feedback('');document.title=`${signup?'Sign up':forgot||reset?'Reset password':'Sign in'} · NexIndustry`;}
const motionAllowed = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
let cardAnimation;
let transitionAnimations=[];
function setMode(next){
 if(next===mode||$('submit').disabled)return;
 const card=document.querySelector('.card');
 const previousHeight=card.getBoundingClientRect().height;
 cardAnimation?.cancel();
 transitionAnimations.forEach(animation=>animation.cancel());
 transitionAnimations=[];
 const direction=next==='signup'?1:-1;
 mode=next;render();
 if(motionAllowed()){
  cardAnimation=card.animate([{height:previousHeight+'px'},{height:card.getBoundingClientRect().height+'px'}],{duration:480,easing:'cubic-bezier(.22,1,.36,1)'});
  const elements=[document.querySelector('header'),...document.querySelectorAll('#auth .field:not([hidden])'),$('options'),$('submit')].filter(element=>!element.hidden);
  elements.forEach((element,index)=>transitionAnimations.push(element.animate([
   {opacity:0,transform:`translate(${direction*12}px, 8px)`,filter:'blur(2px)'},
   {opacity:1,transform:'translate(0, 0)',filter:'blur(0)'}
  ],{duration:420,delay:40+index*35,fill:'backwards',easing:'cubic-bezier(.22,1,.36,1)'})));
 }
}
$('signin').onclick=()=>setMode('signin');$('signup').onclick=()=>setMode('signup');$('forgot').onclick=()=>setMode('forgot');
document.querySelector('.tabs').onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setMode(mode==='signup'?'signin':'signup');$(mode).focus();}};
$('toggle-password').onclick=()=>{const show=$('password').type==='password';$('password').type=show?'text':'password';$('toggle-password').setAttribute('aria-label',show?'Hide password':'Show password');};
// Local demo only: browser storage cannot protect real accounts.
async function passwordHash(password,salt){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},key,256);
 return Array.from(new Uint8Array(bits),b=>b.toString(16).padStart(2,'0')).join('');
}
async function api(path,data){
 const accounts=JSON.parse(localStorage.getItem('nex-accounts')||'[]');
 if(path==='me'){
  const session=JSON.parse(sessionStorage.getItem('nex-session')||localStorage.getItem('nex-session')||'null');
  const user=session&&session.expires>Date.now()&&accounts.find(a=>a.email===session.email);
  if(!user)throw Error('Please sign in.');return {user};
 }
 if(path==='logout'){localStorage.removeItem('nex-session');sessionStorage.removeItem('nex-session');return {};}
 if(path==='forgot')throw Error('This frontend demo cannot send reset emails or verify account ownership. Password recovery requires a backend service.');
 const email=data.email.trim().toLowerCase();let account=accounts.find(a=>a.email===email);
 if(path==='signup'){
  if(account)throw Error('This email already has a demo account. Please sign in.');
  const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
  account={email,name:data.name.trim(),salt,hash:await passwordHash(data.password,salt)};
  accounts.push(account);localStorage.setItem('nex-accounts',JSON.stringify(accounts));
 }else if(path==='login'){
  if(!account||await passwordHash(data.password,account.salt)!==account.hash)throw Error('The email or password is incorrect.');
 }else throw Error('Unsupported demo action.');
 localStorage.removeItem('nex-session');sessionStorage.removeItem('nex-session');
 (data.remember?localStorage:sessionStorage).setItem('nex-session',JSON.stringify({email,expires:Date.now()+(data.remember?30:1)*86400000}));
 return {ok:true};
}
function dashboard(user){location.assign('dashboard.html');}
$('auth').onsubmit=async e=>{e.preventDefault();feedback('');const email=$('email').value.trim(),password=$('password').value;if(mode!=='reset'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){feedback('Please enter a valid corporate email address.');$('email').focus();return;}if(mode==='signup'&&!$('name').value.trim()){feedback('Please enter your full name.');$('name').focus();return;}if(mode!=='forgot'&&(!password||((mode==='signup'||mode==='reset')&&password.length<10))){feedback('Please enter '+(mode==='signin'?'your password.':'a password of at least 10 characters.'));$('password').focus();return;}if(mode==='signup'&&password!==$('confirm-password').value){feedback('Your passwords do not match.');$('confirm-password').focus();return;}$('submit').disabled=true;$('submit').setAttribute('aria-busy','true');try{const result=await api({signin:'login',signup:'signup',forgot:'forgot',reset:'reset'}[mode],{email,password,name:$('name').value,remember:$('remember').checked,token});if(mode==='forgot')feedback(result.message,true);else if(mode==='reset'){setMode('signin');feedback('Password updated. Sign in with your new password.',true);}else dashboard((await api('me')).user);}catch(error){feedback(error.message||'Unable to connect. Please try again.');}finally{$('submit').disabled=false;$('submit').removeAttribute('aria-busy');}};
$('logout').onclick=async()=>{try{await api('logout',{});location.reload();}catch(error){dialog('Unable to sign out',error.message);}};
function dialog(title,body){$('dialog-title').textContent=title;$('dialog-body').textContent=body;$('dialog').showModal();}
$('close-dialog').onclick=()=>$('dialog').close();
$('google').onclick=()=>dialog('Google Workspace','Google Workspace sign-in requires your organization’s OAuth credentials. Email and password sign-in is available now.');
$('sso').onclick=()=>dialog('Enterprise single sign-on','Enterprise SSO requires your organization’s identity provider configuration. Contact your administrator for access.');
$('admin').onclick=()=>dialog('Enterprise team access','Team provisioning has not been configured for this installation. Contact your organization’s IT administrator to request access. You can create an individual account using Sign Up.');
$('privacy').onclick=()=>dialog('Privacy','Demo accounts are stored in this browser only. Clearing browser storage removes them. Use a sample password for this demonstration.');
$('terms').onclick=()=>dialog('Account security','This is a frontend demo. Passwords are hashed with PBKDF2, but browser storage and demo sessions can be modified locally. Secure authentication requires a backend.');
document.querySelector('.secure').lastChild.textContent=' Local demo';$('dashboard').querySelector('p').textContent='Your demo account is ready.';render();if(!token)api('me').then(result=>dashboard(result.user)).catch(()=>{});

$('password').addEventListener('input',()=>{
 if(mode!=='signup')return;
 const value=$('password').value;
 const level=value.length===0?0:value.length<10?1:Math.min(4,2+Number(/[A-Z]/.test(value)&&/[a-z]/.test(value))+Number(/[0-9]/.test(value)&&/[^a-zA-Z0-9]/.test(value)));
 $('strength').dataset.level=String(level);
 $('password-help').textContent=['Use at least 10 characters for a strong password.','Keep going ? use at least 10 characters.','Good length. Mix letter cases, numbers, and symbols.','Strong password. Add numbers and symbols for more strength.','Excellent ? your password is strong.'][level];
});
$('dialog').addEventListener('click',event=>{
 const bounds=$('dialog').getBoundingClientRect();
 if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)$('dialog').close();
});

// Restrained, pointer-aware light and click feedback; no tracking loop while idle.
const card=document.querySelector('.card');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
let pointerFrame=0;
card.addEventListener('pointermove',event=>{
 if(!motionAllowed()||!finePointer.matches||pointerFrame)return;
 pointerFrame=requestAnimationFrame(()=>{
  const rect=card.getBoundingClientRect();
  card.style.setProperty('--light-x',`${event.clientX-rect.left}px`);
  card.style.setProperty('--light-y',`${event.clientY-rect.top}px`);
  pointerFrame=0;
 });
});
document.querySelectorAll('.primary,.providers button').forEach(button=>{
 button.addEventListener('pointerdown',event=>{
  if(!motionAllowed()||button.disabled)return;
  const rect=button.getBoundingClientRect();
  const ripple=document.createElement('span');
  ripple.className='click-wave';ripple.setAttribute('aria-hidden','true');
  const size=Math.max(rect.width,rect.height)*2;
  Object.assign(ripple.style,{width:size+'px',height:size+'px',left:event.clientX-rect.left-size/2+'px',top:event.clientY-rect.top-size/2+'px'});
  button.append(ripple);
  const animation=ripple.animate([{transform:'scale(0)',opacity:.25},{transform:'scale(1)',opacity:0}],{duration:650,easing:'cubic-bezier(.2,.7,.3,1)'});
  animation.finished.then(()=>ripple.remove(),()=>ripple.remove());
 });
});
// Pause decorative motion in background tabs and react immediately to motion settings.
function syncMotion(){
 document.body.classList.toggle('motion-paused',document.hidden||!motionAllowed());
 if(!motionAllowed()){
  cardAnimation?.cancel();transitionAnimations.forEach(animation=>animation.cancel());
  document.getAnimations().forEach(animation=>animation.cancel());
 }
}
document.addEventListener('visibilitychange',syncMotion);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',syncMotion);
syncMotion();
