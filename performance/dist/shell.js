/* Product-family application shell: sidebar search, company switcher, and profile menu. */
let pmsSidebarQuery='',pmsCompanyOpen=false,pmsProfileRoleMenu=false;
const pmsShellIcons={
  Dashboard:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  Goals:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m15 9 5-5M16 4h4v4"/></svg>',
  Reviews:'<svg viewBox="0 0 24 24"><path d="M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2Z"/><path d="m9 10 2 2 4-4"/></svg>',
  Reports:'<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  Employees:'<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  'My Team':'<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 8l2 2 4-4"/></svg>'
};
function pmsIcon(name){return `<span class="ico pms-outline-icon">${pmsShellIcons[name]||pmsShellIcons.Reviews}</span>`}
function pmsLogoMark(){return '<svg class="pms-logo-mark" viewBox="0 0 48 48" aria-hidden="true"><path d="m24 3 10 6v11l-10 6-10-6V9Z"/><path d="m14 20 10 6v11l-10 6-10-6V26ZM34 20l10 6v11l-10 6-10-6V26Z"/></svg>'}
function pmsMenuIcon(type){const icons={profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19 15a2 2 0 0 0 .4 2.2l.1.1-2.2 2.2-.1-.1A2 2 0 0 0 15 19l-.3 1H9.3L9 19a2 2 0 0 0-2.2.4l-.1.1-2.2-2.2.1-.1A2 2 0 0 0 5 15l-1-.3V9.3L5 9a2 2 0 0 0-.4-2.2l-.1-.1 2.2-2.2.1.1A2 2 0 0 0 9 5l.3-1h5.4l.3 1a2 2 0 0 0 2.2-.4l.1-.1 2.2 2.2-.1.1A2 2 0 0 0 19 9l1 .3v5.4Z"/>',preview:'<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.5"/>',logout:'<path d="M10 17l5-5-5-5M15 12H3M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/>'};return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[type]}</svg>`}

function pmsBuildShell(){
  const sidebar=document.querySelector('aside');
  sidebar.className='pms-sidebar';
  sidebar.innerHTML=`<div class="pms-brand">${pmsLogoMark()}<div><strong>PMS<span>Dot</span>Net</strong><small>performance management system</small></div></div><div class="pms-company-host"><button id="pmsCompanyButton" class="pms-company-button" type="button" aria-haspopup="true" aria-expanded="false" onclick="pmsToggleCompany()"><span class="pms-company-avatar">MC</span><span class="pms-company-copy"><b>Mayon Consolidated Inc.</b><small>Main Company</small></span><i class="pms-company-status" aria-label="Active company"></i><svg class="pms-company-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5"/></svg></button><div id="pmsCompanyMenu" class="pms-company-menu" hidden></div></div><label class="pms-sidebar-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="pmsSidebarSearch" type="search" placeholder="Search..." aria-label="Search accessible pages" autocomplete="off" oninput="pmsSidebarSearchInput(this.value)"></label><div class="navlabel">WORKSPACE</div><nav id="nav" aria-label="Workspace navigation"></nav><div class="sidefoot"></div>`;
  pmsRenderCompany();
}
function pmsAccessiblePages(){
  const pages=roleNav().filter(([name])=>name!=='Reviews').map(([name])=>({label:name,parent:'',action:`navigate('${name}')`,icon:name}));
  if(urHr())pages.splice(2,0,{label:'All Reviews',parent:'Reviews',action:"urGoTab('Reviews')",icon:'Reviews'},{label:'Templates',parent:'Reviews',action:"urGoTab('Templates')",icon:'Reviews'},{label:'Cycles',parent:'Reviews',action:"urGoTab('Cycles')",icon:'Reviews'});
  else pages.splice(viewRole==='Manager'?3:2,0,{label:'Reviews',parent:'',action:"navigate('Reviews')",icon:'Reviews'});
  return pages;
}
function pmsSidebar(){
  const term=pmsSidebarQuery.trim().toLowerCase();
  if(term){const matches=pmsAccessiblePages().filter(item=>`${item.parent} ${item.label}`.toLowerCase().includes(term));return `<div class="pms-nav-search-results">${matches.map(item=>`<button type="button" onclick="${item.action};pmsClearSidebarSearch()">${pmsIcon(item.icon)}<span>${item.parent?`<small>${esc(item.parent)}</small>`:''}${esc(item.label)}</span><b>›</b></button>`).join('')||'<p class="pms-nav-empty">No matching pages found</p>'}</div>`}
  const active=page==='Reviews';
  return roleNav().map(([name])=>{
    if(name!=='Reviews')return `<button type="button" class="${page===name?'active':''}" ${page===name?'aria-current="page"':''} onclick="navigate('${name}')">${pmsIcon(name)}<span>${esc(name)}</span></button>`;
    if(!urHr())return `<button type="button" class="${active?'active':''}" ${active?'aria-current="page"':''} onclick="navigate('Reviews')">${pmsIcon('Reviews')}<span>Reviews</span></button>`;
    const children=['Reviews','Templates','Cycles'];
    return `<div class="pms-nav-group"><button type="button" class="pms-nav-parent ${active?'pms-parent-current':''}" aria-expanded="${pmsReviewsOpen}" aria-controls="pms-review-subnav" onclick="pmsToggleReviews()">${pmsIcon('Reviews')}<span>Reviews</span><span class="pms-chevron">⌄</span></button><div id="pms-review-subnav" class="pms-subnav" ${pmsReviewsOpen?'':'hidden'}>${children.map(section=>`<button type="button" class="pms-subitem ${active&&urTab===section?'active':''}" ${active&&urTab===section?'aria-current="page"':''} onclick="urGoTab('${section}')"><span>${section==='Reviews'?'All Reviews':section}</span></button>`).join('')}</div></div>`;
  }).join('');
}
function pmsSidebarSearchInput(value){pmsSidebarQuery=value;if(urHr()&&value.trim())pmsReviewsOpen=true;$('#nav').innerHTML=pmsSidebar()}
function pmsClearSidebarSearch(){pmsSidebarQuery='';const input=$('#pmsSidebarSearch');if(input)input.value='';$('#nav').innerHTML=pmsSidebar()}
function pmsRenderCompany(){const menu=$('#pmsCompanyMenu'),button=$('#pmsCompanyButton');if(!menu||!button)return;menu.hidden=!pmsCompanyOpen;button.setAttribute('aria-expanded',String(pmsCompanyOpen));menu.innerHTML=`<div class="pms-company-menu-title">Switch Company</div><div class="pms-company-section">MAIN COMPANY</div><button class="pms-company-option selected" type="button" onclick="pmsSelectCompany()"><span class="pms-company-avatar">MC</span><span><b>Mayon Consolidated Inc.</b><small>Main Company</small></span><i>✓</i></button><div class="pms-company-section">SISTER COMPANIES</div><p class="pms-company-empty">No sister companies available</p>`}
function pmsToggleCompany(){pmsCompanyOpen=!pmsCompanyOpen;pmsHeaderMenu=null;pmsProfileRoleMenu=false;pmsRenderCompany();pmsRenderHeader()}
function pmsSelectCompany(){pmsCompanyOpen=false;pmsRenderCompany();toast('Mayon Consolidated Inc. selected')}

pmsRenderHeader=function(){
  const profile=$('#pmsProfileMenu'),notifications=$('#pmsNotificationsMenu');if(!profile||!notifications)return;
  const roles=['Employee','Manager','HR Administrator'],name=roleName();
  profile.innerHTML=`<div class="pms-profile-head"><span class="avatar">${initials(name)}</span><b>${esc(name)}</b><small>${esc(viewRole)}</small></div><div class="pms-profile-actions"><button type="button" onclick="pmsOpenProfile()">${pmsMenuIcon('profile')}<span>Profile</span></button><button type="button" onclick="pmsOpenAccountSettings()">${pmsMenuIcon('settings')}<span>Account Settings</span></button><div class="pms-preview-host"><button type="button" aria-haspopup="true" aria-expanded="${pmsProfileRoleMenu}" onclick="pmsToggleRolePreview(event)">${pmsMenuIcon('preview')}<span>Preview as User Type</span><b>›</b></button><div class="pms-role-menu" ${pmsProfileRoleMenu?'':'hidden'}><div class="pms-menu-title">PREVIEW AS USER TYPE</div>${roles.map(role=>`<button type="button" role="menuitemradio" aria-checked="${role===viewRole}" onclick="pmsSelectRole('${role}')"><span>${esc(role)}</span><span class="pms-selected-mark">${role===viewRole?'✓':''}</span></button>`).join('')}</div></div><div class="pms-profile-divider"></div><button type="button" onclick="pmsLogOut()">${pmsMenuIcon('logout')}<span>Log out</span></button></div>`;
  const due=pmsNotificationRows();
  notifications.innerHTML=`<div class="pms-menu-title">NOTIFICATIONS</div>${data.pmsNotificationsEnabled?(due.length?`<div class="pms-notice-summary">${due.length} review${due.length===1?'':'s'} need${due.length===1?'s':''} your response</div>${due.slice(0,3).map(a=>`<button type="button" class="pms-notice-item" onclick="pmsCloseHeaderMenus();navigate('Reviews')"><b>${esc(urPerson(a.subject).name)} · ${esc(a.type)}</b><small>Due ${date(a.deadline)} · ${esc(urEffective(a))}</small></button>`).join('')}`:'<p class="pms-menu-empty">You’re up to date.</p>'):'<p class="pms-menu-empty">Notifications are turned off in Settings.</p>'}`;
  profile.hidden=pmsHeaderMenu!=='profile';notifications.hidden=pmsHeaderMenu!=='notifications';
  $('#pmsProfileButton').setAttribute('aria-expanded',String(pmsHeaderMenu==='profile'));$('#pmsNotificationsButton').setAttribute('aria-expanded',String(pmsHeaderMenu==='notifications'));$('#pmsProfileButton .avatar').textContent=initials(name);
};
pmsToggleHeaderMenu=function(which){pmsCompanyOpen=false;pmsRenderCompany();if(pmsHeaderMenu===which){pmsHeaderMenu=null;pmsProfileRoleMenu=false}else{pmsHeaderMenu=which;pmsProfileRoleMenu=false}pmsRenderHeader()};
pmsCloseHeaderMenus=function(){if(pmsHeaderMenu||pmsProfileRoleMenu){pmsHeaderMenu=null;pmsProfileRoleMenu=false;pmsRenderHeader()}};
function pmsToggleRolePreview(event){event.stopPropagation();pmsProfileRoleMenu=!pmsProfileRoleMenu;pmsRenderHeader()}
pmsSelectRole=function(role){if(!['Employee','Manager','HR Administrator'].includes(role))return;pmsHeaderMenu=null;pmsProfileRoleMenu=false;pmsSidebarQuery='';setRole(role)};
function pmsOpenProfile(){pmsCloseHeaderMenus();const personRecord=data.employees.find(e=>e[1]===roleName());modal('Profile','Your PMSDotNet profile.',`<div class="modalbody"><div class="pms-modal-profile"><span class="avatar">${initials(roleName())}</span><div><h2>${esc(roleName())}</h2><p>${esc(viewRole)}</p></div></div>${personRecord?`<div class="formgrid">${[['Employee ID',personRecord[0]],['Position',personRecord[2]],['Department',personRecord[3]],['Reports to',personRecord[4]]].map(([label,value])=>`<div><small>${label}</small><h2 style="margin-top:8px">${esc(value)}</h2></div>`).join('')}</div>`:'<div class="notice">Administrator profile · Organization-wide access</div>'}</div>`,`<button class="primary" onclick="closeModal()">Done</button>`)}
function pmsOpenAccountSettings(){pmsCloseHeaderMenus();pmsOpenSettings()}
function pmsLogOut(){pmsCloseHeaderMenus();modal('Log out','End this interactive preview session?',`<div class="modalbody"><p>This prototype does not connect to a production identity provider. Ending the preview returns the demo to the Employee dashboard.</p></div>`,`<button onclick="closeModal()">Stay signed in</button><button class="primary" onclick="closeModal();setRole('Employee');toast('Preview session reset')">End preview</button>`)}
function pmsRenderSideUser(){const foot=$('.sidefoot');if(!foot)return;foot.innerHTML=`<span class="avatar">${initials(roleName())}</span><div><b>${esc(roleName())}</b><small>${esc(viewRole)}</small></div>`}

const pmsShellBaseRender=render;
render=function(){pmsShellBaseRender();const nav=$('#nav');if(nav)nav.innerHTML=pmsSidebar();const search=$('#pmsSidebarSearch');if(search&&search.value!==pmsSidebarQuery)search.value=pmsSidebarQuery;pmsRenderSideUser();pmsRenderCompany();pmsRenderHeader()};
const pmsShellBaseNavigate=navigate;
navigate=function(destination){pmsCompanyOpen=false;pmsHeaderMenu=null;pmsProfileRoleMenu=false;pmsShellBaseNavigate(destination)};
const pmsShellBaseSetRole=setRole;
setRole=function(role){pmsSidebarQuery='';pmsCompanyOpen=false;pmsHeaderMenu=null;pmsProfileRoleMenu=false;pmsShellBaseSetRole(role)};
document.addEventListener('click',event=>{if(!event.target.closest('.pms-company-host')&&pmsCompanyOpen){pmsCompanyOpen=false;pmsRenderCompany()}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&pmsCompanyOpen){pmsCompanyOpen=false;pmsRenderCompany()}});
pmsBuildShell();render();
