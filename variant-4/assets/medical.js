'use strict';
const ICONS={
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',back:'<path d="M19 12H5m6-6-6 6 6 6"/>',down:'<path d="m6 9 6 6 6-6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',compare:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M12 4v16m-5-9-2 1 2 1m10-2 2 1-2 1"/>',
 medal:'<circle cx="12" cy="9" r="5.5"/><path d="m9.6 9.2 1.7 1.7 3.2-3.4M8.7 13.8 7.2 21l4.8-2.5 4.8 2.5-1.5-7.2"/>',person:'<circle cx="9.5" cy="8" r="3.6"/><path d="M3 20c.5-3.9 3.1-6.2 6.5-6.2 1.3 0 2.4.3 3.4.9"/><circle cx="17.5" cy="16.8" r="4"/><path d="m15.8 16.9 1.3 1.3 2.3-2.5"/>',
 phone:'<path d="M21 16.5v2.8a2 2 0 0 1-2.2 2 18.5 18.5 0 0 1-8-2.9 18 18 0 0 1-5.6-5.6A18.5 18.5 0 0 1 2.4 4.7 2 2 0 0 1 4.4 2.5h2.8a2 2 0 0 1 2 1.7l.5 2.7a2 2 0 0 1-.6 1.8L8 10a14 14 0 0 0 6 6l1.3-1.1a2 2 0 0 1 1.8-.6l2.7.5a2 2 0 0 1 1.7 2z"/>',
 tg:'<path d="M21.5 3 2.5 10.4l6.3 2.3 2.3 6.8 3.2-3.7 5.2 3.8zM8.8 12.7 21.5 3"/>',wa:'<path d="m3.2 20.8 1.3-4.6A8.7 8.7 0 1 1 7.9 19.6z"/><path d="M9 8.3c-.3.9 0 2.2 1.6 3.8s2.9 1.9 3.8 1.6l.9-1.1-1.9-1-.7.7c-.6-.3-1.3-.9-1.6-1.6l.7-.7-1-1.9z"/>',max:'<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2.8-.3 3.9-.9l4.1 1-1-4A9 9 0 0 0 12 3z"/><path d="M8 15.2V9.6l4 3.6 4-3.6v5.6"/>'
};
const svg=name=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]||ICONS.arrow}</svg>`;
const escapeText=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const services=[
 {id:'face',label:'Пластика лица',photo:'menu-face-reference.png',items:['Блефаропластика','Эндоскопическая подтяжка','SMAS-подтяжка','Визаж-лифт','Ринопластика','Отопластика'],anesthesia:'Анестезия при операции на лице'},
 {id:'breast',label:'Пластика груди',photo:'menu-bust-reference.png',items:['Увеличение груди','Подтяжка груди','Уменьшение груди','Удаление и замена имплантов','Устранение гинекомастии'],anesthesia:'Анестезия при операции на груди'},
 {id:'body',label:'Пластика тела',photo:'menu-body-reference.png',items:['Полная абдоминопластика','Миниабдоминопластика','Эндоскопическая абдоминопластика','Удаление грыжи','Бодилифт','BodyTite','Другие виды липосакции'],anesthesia:'Анестезия при операции на животе'}
];
const patients=['Цены','Акции','Подготовка и реабилитация','Для иногородних','Вопросы и ответы','Все услуги'];
const topicButton=(name,extra='')=>`<button type="button" class="${extra}" data-topic="${escapeText(name)}">${escapeText(name)}${svg('arrow')}</button>`;
const linksHTML=s=>`<div class="menu-links">${s.items.map(n=>topicButton(n)).join('')}${topicButton(s.anesthesia,'anesthesia-link')}</div>`;
document.getElementById('services-nav').innerHTML=services.map(s=>`<div class="nav-group" data-nav-group="${s.id}"><button class="service-trigger nav-toggle" aria-expanded="false" aria-controls="panel-${s.id}">${s.label}${svg('down')}</button><div class="nav-panel service-panel" id="panel-${s.id}" hidden>${linksHTML(s)}<figure class="category-photo"><img src="assets/${s.photo}" alt="" loading="lazy"><figcaption>${s.label}</figcaption></figure></div></div>`).join('');
document.getElementById('panel-patients').innerHTML=`<div class="menu-links">${patients.map(n=>topicButton(n)).join('')}</div>`;
document.getElementById('mobile-services').innerHTML=services.map(s=>`<details class="mobile-group"><summary><img src="assets/${s.photo}" alt="" loading="lazy"><span>${s.label}</span>${svg('down')}</summary>${linksHTML(s)}</details>`).join('');
document.getElementById('mobile-patients').innerHTML=`<div class="menu-links">${patients.map(n=>topicButton(n)).join('')}</div>`;
document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=svg(el.dataset.icon)});

let activeNav=null,closeTimer;
function closeNav(restore=false){clearTimeout(closeTimer);if(!activeNav)return;const previous=activeNav;delete previous.dataset.pinned;previous.querySelector('.nav-toggle').setAttribute('aria-expanded','false');previous.querySelector('.nav-panel').hidden=true;activeNav=null;if(restore)previous.querySelector('.nav-toggle').focus();}
function positionNav(group){
 const panel=group.querySelector('.nav-panel'),trigger=group.querySelector('.nav-toggle');
 const header=document.querySelector('.site-header').getBoundingClientRect(),anchor=trigger.getBoundingClientRect();
 const left=Math.max(12,Math.min(anchor.left-header.left,header.width-panel.offsetWidth-12));
 const top=anchor.bottom-header.top+12;
 panel.style.left=`${left}px`;panel.style.top=`${top}px`;
 panel.style.setProperty('--anchor-x',`${anchor.left+anchor.width/2-header.left-left}px`);
 panel.style.maxHeight=`${Math.max(180,innerHeight-header.top-top-20)}px`;
}
function openNav(group){clearTimeout(closeTimer);if(activeNav===group){positionNav(group);return}closeNav();activeNav=group;group.querySelector('.nav-toggle').setAttribute('aria-expanded','true');group.querySelector('.nav-panel').hidden=false;positionNav(group);}
addEventListener('resize',()=>{if(activeNav)positionNav(activeNav)});
document.querySelectorAll('[data-nav-group]').forEach(group=>{
 const trigger=group.querySelector('.nav-toggle');
 trigger.addEventListener('click',()=>{if(activeNav===group&&group.dataset.pinned){closeNav()}else{openNav(group);group.dataset.pinned='true'}});
 trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();openNav(group);group.querySelector('.nav-panel button').focus()}});
 group.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&matchMedia('(hover:hover)').matches)openNav(group)});
 group.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse')closeTimer=setTimeout(()=>{if(activeNav===group&&!group.dataset.pinned&&!group.contains(document.activeElement)&&!group.matches(':hover'))closeNav()},180)});
 group.querySelector('.nav-panel').addEventListener('pointerenter',()=>clearTimeout(closeTimer));
 group.addEventListener('focusout',()=>{setTimeout(()=>{if(activeNav===group&&!group.contains(document.activeElement)&&!group.matches(':hover'))closeNav()},0)});
});
document.addEventListener('pointerdown',event=>{if(activeNav&&!activeNav.contains(event.target))closeNav()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&activeNav){event.preventDefault();closeNav(true)}});

const mobileMenu=document.getElementById('mobile-menu'),menuButton=document.querySelector('.menu-toggle');
const dialogFocus=new WeakMap();
function openDialog(id,source){
 const dialog=document.getElementById(id);
 const parent=source?.closest('dialog');
 const originalSource=parent?dialogFocus.get(parent):source;
 if(parent?.open)parent.close();
 closeNav();dialogFocus.set(dialog,originalSource||source||document.activeElement);dialog.showModal();
 if(dialog===mobileMenu)menuButton.setAttribute('aria-expanded','true');
 const focusTarget=dialog.querySelector('[data-close]');if(focusTarget)focusTarget.focus();
}
document.querySelectorAll('dialog').forEach(dialog=>{
 dialog.addEventListener('close',()=>{if(dialog===mobileMenu)menuButton.setAttribute('aria-expanded','false');const trigger=dialogFocus.get(dialog);if(trigger&&trigger.isConnected&&!document.querySelector('dialog[open]'))trigger.focus()});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close()});
});
menuButton.addEventListener('click',()=>openDialog('mobile-menu',menuButton));
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-contact],[data-results],[data-topic],[data-close]');if(!button)return;
 if(button.hasAttribute('data-close')){button.closest('dialog').close();return}
 if(button.hasAttribute('data-contact')){openDialog('contact-dialog',button);return}
 if(button.hasAttribute('data-results')){openDialog('results-dialog',button);return}
 const topic=button.dataset.topic;
 document.getElementById('section-title').textContent=topic;
 document.getElementById('section-kicker').textContent=topic.startsWith('Анестезия')?'Подготовка к операции':topic==='Блог'?'Статьи':topic==='Отзывы'?'Мнение пациентов':'Информация';
 const descriptions={
  'О враче':'Светлана Юрьевна Пшонкина — пластический хирург, кандидат медицинских наук. Более 25 лет практического опыта в хирургии.',
  'Блог':'Здесь будут статьи о пластической хирургии, подготовке и восстановлении. Материалы добавим после согласования макета.',
  'Отзывы':'Раздел для письменных и видеоотзывов пациентов. Финальную подборку с источниками добавим после согласования макета.'
 };
 document.getElementById('section-description').textContent=descriptions[topic]||'Подробное содержание этого раздела добавим после согласования макета. Вопросы об операции можно обсудить на личной консультации.';
 openDialog('section-dialog',button);
});
matchMedia('(min-width:720px)').addEventListener('change',event=>{if(event.matches&&mobileMenu.open)mobileMenu.close();closeNav()});
