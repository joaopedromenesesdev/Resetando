(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`resetando_data`,t=`3pilares_data`;function n(){return Date.now().toString(36)+Math.random().toString(36).substring(2,9)}function r(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function i(e){let[t,n,r]=e.split(`-`).map(Number);return`${r} ${[`JAN`,`FEV`,`MAR`,`ABR`,`MAI`,`JUN`,`JUL`,`AGO`,`SET`,`OUT`,`NOV`,`DEZ`][new Date(t,n-1,r).getMonth()]}`}function a(e){let[t,n,r]=e.split(`-`).map(Number);return[`DOM`,`SEG`,`TER`,`QUA`,`QUI`,`SEX`,`SÁB`][new Date(t,n-1,r).getDay()]}function o(e){let[t,n,r]=e.split(`-`).map(Number),i=new Date(t,n-1,r);return`${[`Dom`,`Seg`,`Ter`,`Qua`,`Qui`,`Sex`,`Sáb`][i.getDay()]}, ${r} ${[`Jan`,`Fev`,`Mar`,`Abr`,`Mai`,`Jun`,`Jul`,`Ago`,`Set`,`Out`,`Nov`,`Dez`][i.getMonth()]}`}function s(){return{onboardingComplete:!1,habits:[],dailyHabits:[],alterEgo:null,goals:[],userName:``,createdAt:new Date().toISOString()}}var c=new Set([`estudar programação`,`ler 20 páginas`,`praticar foco diário`,`treinar`,`beber 2l de água`,`dormir antes das 23h`,`orar / meditar`,`escrever no diário`,`tempo com a família`]);function l(){try{let n=localStorage.getItem(e)||localStorage.getItem(t);if(!n)return s();let r=JSON.parse(n);r.goals||=[],r.alterEgo===void 0&&(r.alterEgo=null);let i=!1;if(Array.isArray(r.habits)){let e=r.habits.filter(e=>!c.has(e.name.trim().toLowerCase()));e.length!==r.habits.length&&(r.habits=e,i=!0)}if(Array.isArray(r.dailyHabits)){let e=r.dailyHabits.filter(e=>!c.has(e.habitName.trim().toLowerCase()));e.length!==r.dailyHabits.length&&(r.dailyHabits=e,i=!0)}return i&&u(r),r}catch{return s()}}function u(n){let r=JSON.stringify(n);localStorage.setItem(e,r),localStorage.setItem(t,r)}function d(e,t,i){let a=e.habits.filter(e=>e.pillarId===t&&e.active),o={id:n(),pillarId:t,name:i.trim(),order:a.length,active:!0,createdAt:new Date().toISOString(),retiredAt:null},s=r(),c={id:n(),habitId:o.id,pillarId:o.pillarId,habitName:o.name,date:s,completed:!1,completedAt:null,order:o.order},l={...e,habits:[...e.habits,o],dailyHabits:[...e.dailyHabits,c]};return u(l),l}function f(e,t){let n=e.habits.map(e=>e.id===t?{...e,active:!1,retiredAt:new Date().toISOString()}:e),i=r(),a=e.dailyHabits.filter(e=>e.habitId!==t||e.date!==i),o={...e,habits:n,dailyHabits:a};return u(o),o}function p(e,t,r){let i=e.habits.find(e=>e.id===t);if(!i)return e;let a=f(e,t),o={id:n(),pillarId:i.pillarId,name:r.trim(),order:i.order,active:!0,createdAt:new Date().toISOString(),retiredAt:null};return a={...a,habits:[...a.habits,o]},u(a),a}function m(e){return e.habits.filter(e=>e.active).sort((e,t)=>e.order-t.order)}function h(e,t){return m(e).filter(e=>e.pillarId===t)}function g(e,t){let r=m(e),i=e.dailyHabits.filter(e=>e.date===t),a=new Set(r.map(e=>e.id)),o=i.filter(e=>a.has(e.habitId)),s=r.filter(e=>!i.some(t=>t.habitId===e.id));if(s.length===0&&o.length===i.length)return e;let c=s.map(e=>({id:n(),habitId:e.id,pillarId:e.pillarId,habitName:e.name,date:t,completed:!1,completedAt:null,order:e.order})),l=e.dailyHabits.filter(e=>e.date!==t),d={...e,dailyHabits:[...l,...o,...c]};return u(d),d}function _(e,t){return e.dailyHabits.filter(e=>e.date===t).sort((e,t)=>e.order-t.order)}function v(e,t,n){return _(e,t).filter(e=>e.pillarId===n)}function y(e,t){let n=e.dailyHabits.map(e=>e.id===t?{...e,completed:!e.completed,completedAt:e.completed?null:new Date().toISOString()}:e),r={...e,dailyHabits:n};return u(r),r}function b(e,t){let n=_(e,t),r=n.length,i=n.filter(e=>e.completed).length;return{completed:i,total:r,percent:r>0?Math.round(i/r*100):0}}function x(e,t,n){let r=v(e,t,n);return{completed:r.filter(e=>e.completed).length,total:r.length}}var S=7;function C(e){let t=0,n=r(),i=new Date(n+`T12:00:00`),a=b(e,n);a.total>0&&a.completed>=S&&(t=1);for(let n=1;n<=365;n++){let r=new Date(i);r.setDate(r.getDate()-n);let a=r.toISOString().split(`T`)[0],o=b(e,a);if(o.total===0)break;if(o.completed>=S)t++;else break}if(a.total>0&&a.completed<S){t=0;for(let n=1;n<=365;n++){let r=new Date(i);r.setDate(r.getDate()-n);let a=r.toISOString().split(`T`)[0],o=b(e,a);if(o.total===0)break;if(o.completed>=S)t++;else break}}return t}function w(e){let t=new Set;return e.dailyHabits.forEach(e=>t.add(e.date)),Array.from(t).sort((e,t)=>t.localeCompare(e))}function T(){let e=[],t=new Date(r()+`T12:00:00`);for(let n=6;n>=0;n--){let r=new Date(t);r.setDate(r.getDate()-n),e.push(r.toISOString().split(`T`)[0])}return e}function E(e){let t={...e,onboardingComplete:!0};return u(t),t}function D(e,t){let n={...e,alterEgo:t};return u(n),n}function O(e,t,r,i){let a=Math.max(0,Math.min(100,Math.round(i))),o={id:n(),pillarId:t,title:r.trim(),progress:a,completed:a>=100,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},s=e.goals||[],c={...e,goals:[...s,o]};return u(c),c}function k(e,t,n){let r=Math.max(0,Math.min(100,Math.round(n))),i=(e.goals||[]).map(e=>e.id===t?{...e,progress:r,completed:r>=100,updatedAt:new Date().toISOString()}:e),a={...e,goals:i};return u(a),a}function A(e,t,n){let r=(e.goals||[]).map(e=>{if(e.id!==t)return e;let r=n.progress===void 0?e.progress:Math.max(0,Math.min(100,Math.round(n.progress)));return{...e,title:n.title===void 0?e.title:n.title.trim(),pillarId:n.pillarId||e.pillarId,progress:r,completed:r>=100,updatedAt:new Date().toISOString()}}),i={...e,goals:r};return u(i),i}function j(e,t){let n=(e.goals||[]).filter(e=>e.id!==t),r={...e,goals:n};return u(r),r}function M(e,t){return(e.goals||[]).filter(e=>e.pillarId===t)}function N(e,t){let n=M(e,t);if(n.length===0)return{progress:0,goalCount:0,hasGoals:!1};let r=n.reduce((e,t)=>e+t.progress,0);return{progress:Math.round(r/n.length),goalCount:n.length,hasGoals:!0}}function P(e,t,n){e.innerHTML=`
    <div class="onboarding">
      <div class="onboarding-slide">
        <div class="onboarding-video-wrap">
          <video
            id="onboarding-video"
            class="onboarding-video"
            src="./animacao_entrada.mp4"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
          ></video>
        </div>
        <h1 class="onboarding-title onboarding-brand">
          <span class="gold">RESET</span>ANDO
        </h1>
        <p class="onboarding-subtitle">
          Uma nova versão de você começa com pequenas ações diárias.
        </p>
      </div>

      <div style="width: 100%; display: flex; flex-direction: column; gap: var(--spacing-sm); padding-bottom: var(--spacing-lg);">
        <button class="btn-primary" id="onboarding-start-btn">Continuar</button>
      </div>
    </div>
  `;let r=document.getElementById(`onboarding-video`);r&&(r.muted=!0,r.play().catch(()=>{})),document.getElementById(`onboarding-start-btn`)?.addEventListener(`click`,()=>{let e=E(t);u(e),n.onComplete(e)})}var F=[{id:`mente`,name:`Mente`,iconKey:`bookOpen`},{id:`corpo`,name:`Corpo`,iconKey:`dumbbell`},{id:`alma`,name:`Alma`,iconKey:`heart`}],I=`width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`,L={brain:`<svg ${I}><path d="M12 2a6 6 0 0 0-6 6c0 1.6.6 3 1.7 4.1L12 16l4.3-3.9A6 6 0 0 0 18 8a6 6 0 0 0-6-6z"/><path d="M9 22v-4"/><path d="M15 22v-4"/><path d="M12 16v6"/><path d="M9 2.5c-.3.8-.5 1.6-.5 2.5"/><path d="M15 2.5c.3.8.5 1.6.5 2.5"/></svg>`,mind:`<svg ${I}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,bookOpen:`<svg ${I}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,dumbbell:`<svg ${I}><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>`,heart:`<svg ${I}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,sun:`<svg ${I}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,calendar:`<svg ${I}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,listChecks:`<svg ${I}><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>`,user:`<svg ${I}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,check:`<svg ${I}><polyline points="20 6 9 17 4 12"/></svg>`,chevronRight:`<svg ${I}><path d="m9 18 6-6-6-6"/></svg>`,edit:`<svg ${I}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,plus:`<svg ${I}><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,trash:`<svg ${I}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,alertTriangle:`<svg ${I}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,download:`<svg ${I}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,upload:`<svg ${I}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,flame:`<svg ${I}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,target:`<svg ${I}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,scale:`<svg ${I}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,sparkles:`<svg ${I}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,barChart:`<svg ${I}><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,arrowUp:`<svg ${I}><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`,rotateCcw:`<svg ${I}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`};function R(e,t=20){return L[e].replace(`width="20"`,`width="${t}"`).replace(`height="20"`,`height="${t}"`)}function z(e,t=20){switch(e){case`mente`:return R(`bookOpen`,t);case`corpo`:return R(`dumbbell`,t);case`alma`:return R(`heart`,t);default:return R(`target`,t)}}function ee(e,t){let n=e.alterEgo||{name:`Minha melhor versão`,mente:{target:90,traits:[`disciplinado`,`focado`,`intelectualmente desenvolvido`]},corpo:{target:75,traits:[`saudável`,`ativo`,`consistente`]},alma:{target:85,traits:[`equilibrado`,`presente`,`conectado com seus valores`]},createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},r=`
    <div class="modal-backdrop" id="alter-ego-modal-backdrop">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="modal-badge">Direção & Destino</span>
            <h2 class="modal-title">Configurar Alter Ego</h2>
          </div>
          <button class="modal-close" id="alter-ego-close-btn" aria-label="Fechar">&times;</button>
        </div>

        <p class="modal-description">
          O Alter Ego representa quem você deseja se tornar. Defina os alvos de evolução (0 a 100) para cada pilar.
        </p>

        <form id="alter-ego-form" class="modal-form">
          <div class="form-group">
            <label class="form-label" for="ae-name">Nome do seu Alter Ego</label>
            <input
              type="text"
              id="ae-name"
              class="form-input"
              value="${n.name}"
              placeholder="Ex: Minha melhor versão, Eu 2.0"
              required
            />
          </div>

          <!-- MENTE -->
          <div class="alter-ego-pillar-block">
            <div class="ae-pillar-header">
              <span class="ae-pillar-name">MENTE</span>
              <span class="ae-pillar-val" id="ae-mente-val">${n.mente.target}%</span>
            </div>
            <input
              type="range"
              id="ae-mente-target"
              class="form-range"
              min="10"
              max="100"
              step="5"
              value="${n.mente.target}"
            />
            <input
              type="text"
              id="ae-mente-traits"
              class="form-input-subtle"
              value="${n.mente.traits.join(`, `)}"
              placeholder="Características (separadas por vírgula)"
            />
          </div>

          <!-- CORPO -->
          <div class="alter-ego-pillar-block">
            <div class="ae-pillar-header">
              <span class="ae-pillar-name">CORPO</span>
              <span class="ae-pillar-val" id="ae-corpo-val">${n.corpo.target}%</span>
            </div>
            <input
              type="range"
              id="ae-corpo-target"
              class="form-range"
              min="10"
              max="100"
              step="5"
              value="${n.corpo.target}"
            />
            <input
              type="text"
              id="ae-corpo-traits"
              class="form-input-subtle"
              value="${n.corpo.traits.join(`, `)}"
              placeholder="Características (separadas por vírgula)"
            />
          </div>

          <!-- ALMA -->
          <div class="alter-ego-pillar-block">
            <div class="ae-pillar-header">
              <span class="ae-pillar-name">ALMA</span>
              <span class="ae-pillar-val" id="ae-alma-val">${n.alma.target}%</span>
            </div>
            <input
              type="range"
              id="ae-alma-target"
              class="form-range"
              min="10"
              max="100"
              step="5"
              value="${n.alma.target}"
            />
            <input
              type="text"
              id="ae-alma-traits"
              class="form-input-subtle"
              value="${n.alma.traits.join(`, `)}"
              placeholder="Características (separadas por vírgula)"
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" id="alter-ego-cancel-btn">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="alter-ego-save-btn">Salvar Alter Ego</button>
          </div>
        </form>
      </div>
    </div>
  `;document.getElementById(`alter-ego-modal-backdrop`)?.remove();let i=document.createElement(`div`);i.innerHTML=r,document.body.appendChild(i.firstElementChild);let a=document.getElementById(`alter-ego-modal-backdrop`),o=()=>a.remove();document.getElementById(`alter-ego-close-btn`)?.addEventListener(`click`,o),document.getElementById(`alter-ego-cancel-btn`)?.addEventListener(`click`,o),a.addEventListener(`click`,e=>{e.target===a&&o()});let s=(e,t)=>{let n=document.getElementById(e),r=document.getElementById(t);n&&r&&n.addEventListener(`input`,()=>{r.textContent=`${n.value}%`})};s(`ae-mente-target`,`ae-mente-val`),s(`ae-corpo-target`,`ae-corpo-val`),s(`ae-alma-target`,`ae-alma-val`),document.getElementById(`alter-ego-form`).addEventListener(`submit`,n=>{n.preventDefault();let r=document.getElementById(`ae-name`),i=Number(document.getElementById(`ae-mente-target`).value),a=Number(document.getElementById(`ae-corpo-target`).value),s=Number(document.getElementById(`ae-alma-target`).value),c=document.getElementById(`ae-mente-traits`).value.split(`,`).map(e=>e.trim()).filter(Boolean),l=document.getElementById(`ae-corpo-traits`).value.split(`,`).map(e=>e.trim()).filter(Boolean),u=document.getElementById(`ae-alma-traits`).value.split(`,`).map(e=>e.trim()).filter(Boolean),d={name:r.value.trim()||`Minha melhor versão`,mente:{target:i,traits:c},corpo:{target:a,traits:l},alma:{target:s,traits:u},createdAt:e.alterEgo?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};o(),t(D(e,d))})}function B(e,t){let n=t.goalId?e.goals?.find(e=>e.id===t.goalId):void 0,r=n?.pillarId||t.defaultPillar||`mente`,i=n?.title||``,a=n?.progress===void 0?50:n.progress,o=`
    <div class="modal-backdrop" id="goal-modal-backdrop">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="modal-badge">Construção & Evolução</span>
            <h2 class="modal-title">${n?`Editar Meta`:`Nova Meta de Evolução`}</h2>
          </div>
          <button class="modal-close" id="goal-close-btn" aria-label="Fechar">&times;</button>
        </div>

        <form id="goal-form" class="modal-form">
          <div class="form-group">
            <label class="form-label" for="goal-title">Título da Meta</label>
            <input
              type="text"
              id="goal-title"
              class="form-input"
              value="${i}"
              placeholder="Ex: Aprender Python avançado, Ler 12 livros no ano"
              required
              autofocus
            />
          </div>

          <div class="form-group">
            <label class="form-label">Pilar Fundamental</label>
            <div class="pillar-selector">
              ${F.map(e=>`
                <label class="pillar-choice ${r===e.id?`active`:``}">
                  <input
                    type="radio"
                    name="goal-pillar"
                    value="${e.id}"
                    ${r===e.id?`checked`:``}
                  />
                  <span>${e.name}</span>
                </label>
              `).join(``)}
            </div>
          </div>

          <div class="form-group">
            <div class="goal-slider-header">
              <label class="form-label" for="goal-progress">Progresso Atual</label>
              <span class="goal-slider-value" id="goal-progress-display">${a}%</span>
            </div>
            <input
              type="range"
              id="goal-progress"
              class="form-range"
              min="0"
              max="100"
              step="5"
              value="${a}"
            />
          </div>

          <div class="modal-actions">
            ${n?`
              <button type="button" class="btn btn-danger-subtle" id="goal-delete-btn">
                ${R(`trash`,14)} Excluir
              </button>
            `:``}
            <button type="button" class="btn btn-secondary" id="goal-cancel-btn">Cancelar</button>
            <button type="submit" class="btn btn-primary" id="goal-save-btn">
              ${n?`Salvar Alterações`:`Criar Meta`}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;document.getElementById(`goal-modal-backdrop`)?.remove();let s=document.createElement(`div`);s.innerHTML=o,document.body.appendChild(s.firstElementChild);let c=document.getElementById(`goal-modal-backdrop`),l=()=>c.remove();document.getElementById(`goal-close-btn`)?.addEventListener(`click`,l),document.getElementById(`goal-cancel-btn`)?.addEventListener(`click`,l),c.addEventListener(`click`,e=>{e.target===c&&l()});let u=document.getElementById(`goal-progress`),d=document.getElementById(`goal-progress-display`);u&&d&&u.addEventListener(`input`,()=>{d.textContent=`${u.value}%`}),document.querySelectorAll(`input[name="goal-pillar"]`).forEach(e=>{e.addEventListener(`change`,()=>{document.querySelectorAll(`.pillar-choice`).forEach(e=>e.classList.remove(`active`)),e.closest(`.pillar-choice`)?.classList.add(`active`)})}),n&&document.getElementById(`goal-delete-btn`)?.addEventListener(`click`,()=>{if(confirm(`Deseja excluir a meta "${n.title}"?`)){l();let r=j(e,n.id);t.onSave(r)}}),document.getElementById(`goal-form`).addEventListener(`submit`,r=>{r.preventDefault();let i=document.getElementById(`goal-title`),a=document.querySelector(`input[name="goal-pillar"]:checked`)?.value||`mente`,o=Number(u.value);l();let s=e;s=n?A(e,n.id,{title:i.value.trim(),pillarId:a,progress:o}):O(e,a,i.value.trim(),o),t.onSave(s)})}var V=null,H=400,U=300,W=200,G=176,K=144,q={x:W,y:32},J={x:W-K*Math.cos(Math.PI/6),y:G+K*Math.sin(Math.PI/6)},Y={x:W+K*Math.cos(Math.PI/6),y:G+K*Math.sin(Math.PI/6)};function X(e){let t={x:W,y:G-K*e},n={x:W-K*e*Math.cos(Math.PI/6),y:G+K*e*Math.sin(Math.PI/6)},r={x:W+K*e*Math.cos(Math.PI/6),y:G+K*e*Math.sin(Math.PI/6)};return`${t.x.toFixed(1)},${t.y.toFixed(1)} ${n.x.toFixed(1)},${n.y.toFixed(1)} ${r.x.toFixed(1)},${r.y.toFixed(1)}`}function te(e){let t=e.alterEgo,n=!!t,r=N(e,`mente`),i=N(e,`corpo`),a=N(e,`alma`),o=(e.goals||[]).length>0,s=t?t.mente.target:0,c=t?t.corpo.target:0,l=t?t.alma.target:0,u=s/100,d=c/100,f=l/100,p={x:W+(q.x-W)*u,y:G+(q.y-G)*u},m={x:W+(J.x-W)*d,y:G+(J.y-G)*d},h={x:W+(Y.x-W)*f,y:G+(Y.y-G)*f},g=`${p.x.toFixed(1)},${p.y.toFixed(1)} ${m.x.toFixed(1)},${m.y.toFixed(1)} ${h.x.toFixed(1)},${h.y.toFixed(1)}`,_=r.hasGoals?r.progress/100:0,v=i.hasGoals?i.progress/100:0,y=a.hasGoals?a.progress/100:0,b={x:W+(q.x-W)*_,y:G+(q.y-G)*_},x={x:W+(J.x-W)*v,y:G+(J.y-G)*v},S={x:W+(Y.x-W)*y,y:G+(Y.y-G)*y},C=`${b.x.toFixed(1)},${b.y.toFixed(1)} ${x.x.toFixed(1)},${x.y.toFixed(1)} ${S.x.toFixed(1)},${S.y.toFixed(1)}`,w=X(1),T=X(.75),E=X(.5),D=X(.25),O=V?ne(V,e):null;return`
    <section class="evolution-triangle-card" id="evolution-triangle-card">
      <div class="triangle-header">
        <div class="triangle-header-left">
          <span class="triangle-badge">Longo Prazo</span>
          <h2 class="triangle-title">TRIÂNGULO DE EVOLUÇÃO</h2>
        </div>
        <button class="btn-config-alter-ego" id="btn-open-alter-ego" title="Configurar Alter Ego">
          ${R(`target`,14)} <span>${n?t.name:`Criar Alter Ego`}</span>
        </button>
      </div>

      <!-- State 1: No Alter Ego -->
      ${n?``:`
        <div class="triangle-empty-banner">
          <p class="empty-banner-title">Defina seu Alter Ego para descobrir sua direção.</p>
          <p class="empty-banner-desc">Quem você quer se tornar? Estabeleça seus alvos para Mente, Corpo e Alma.</p>
          <button class="btn btn-primary btn-sm" id="btn-empty-alter-ego">
            Definir Alter Ego
          </button>
        </div>
      `}

      <!-- SVG Graph Section -->
      <div class="triangle-svg-wrapper">
        <svg
          class="triangle-svg"
          viewBox="0 0 ${H} ${U}"
          width="100%"
          height="auto"
          role="img"
          aria-label="Triângulo de Evolução: Alter Ego vs Metas"
        >
          <!-- Spokes -->
          <line x1="${W}" y1="${G}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" class="triangle-spoke" />
          <line x1="${W}" y1="${G}" x2="${J.x.toFixed(1)}" y2="${J.y.toFixed(1)}" class="triangle-spoke" />
          <line x1="${W}" y1="${G}" x2="${Y.x.toFixed(1)}" y2="${Y.y.toFixed(1)}" class="triangle-spoke" />

          <!-- Concentric Guides -->
          <polygon points="${D}" class="triangle-guide guide-25" />
          <polygon points="${E}" class="triangle-guide guide-50" />
          <polygon points="${T}" class="triangle-guide guide-75" />
          <polygon points="${w}" class="triangle-outer" />
          <circle cx="${W}" cy="${G}" r="2" class="triangle-center-point" />

          <!-- Alter Ego Triangle (Destino / Linha Dourada Discreta) -->
          ${n?`
            <polygon
              id="alter-ego-polygon"
              points="${g}"
              class="triangle-alter-ego-area"
            />
            <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" class="triangle-target-dot" />
            <circle cx="${m.x.toFixed(1)}" cy="${m.y.toFixed(1)}" r="3" class="triangle-target-dot" />
            <circle cx="${h.x.toFixed(1)}" cy="${h.y.toFixed(1)}" r="3" class="triangle-target-dot" />
          `:``}

          <!-- Evolution Triangle (Onde estou / Preenchimento Dourado Forte) -->
          ${n&&o?`
            <polygon
              id="evolution-progress-polygon"
              points="${C}"
              class="triangle-inner-area"
            />
            ${r.hasGoals?`<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="3.5" class="triangle-inner-dot" />`:``}
            ${i.hasGoals?`<circle cx="${x.x.toFixed(1)}" cy="${x.y.toFixed(1)}" r="3.5" class="triangle-inner-dot" />`:``}
            ${a.hasGoals?`<circle cx="${S.x.toFixed(1)}" cy="${S.y.toFixed(1)}" r="3.5" class="triangle-inner-dot" />`:``}
          `:``}

          <!-- Outer Anchor Dots -->
          <circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="3" class="triangle-outer-dot ${V===`mente`?`selected`:``}" />
          <circle cx="${J.x.toFixed(1)}" cy="${J.y.toFixed(1)}" r="3" class="triangle-outer-dot ${V===`corpo`?`selected`:``}" />
          <circle cx="${Y.x.toFixed(1)}" cy="${Y.y.toFixed(1)}" r="3" class="triangle-outer-dot ${V===`alma`?`selected`:``}" />

          <!-- MENTE Vertex Labels (Top) -->
          <g class="triangle-vertex-group ${V===`mente`?`selected`:``}" data-pillar-vertex="mente" role="button" tabindex="0">
            <circle cx="${W}" cy="18" r="34" class="triangle-touch-target" />
            <text x="${W}" y="14" class="triangle-label-name" text-anchor="middle">MENTE</text>
            <text x="${W}" y="27" class="triangle-label-stats" text-anchor="middle">
              ${n?r.hasGoals?`Alvo: ${s}% · Atual: ${r.progress}%`:`Alvo: ${s}%`:`Definir`}
            </text>
          </g>

          <!-- CORPO Vertex Labels (Bottom-Left) -->
          <g class="triangle-vertex-group ${V===`corpo`?`selected`:``}" data-pillar-vertex="corpo" role="button" tabindex="0">
            <circle cx="85" cy="272" r="34" class="triangle-touch-target" />
            <text x="85" y="270" class="triangle-label-name" text-anchor="middle">CORPO</text>
            <text x="85" y="284" class="triangle-label-stats" text-anchor="middle">
              ${n?i.hasGoals?`Alvo: ${c}% · Atual: ${i.progress}%`:`Alvo: ${c}%`:`Definir`}
            </text>
          </g>

          <!-- ALMA Vertex Labels (Bottom-Right) -->
          <g class="triangle-vertex-group ${V===`alma`?`selected`:``}" data-pillar-vertex="alma" role="button" tabindex="0">
            <circle cx="315" cy="272" r="34" class="triangle-touch-target" />
            <text x="315" y="270" class="triangle-label-name" text-anchor="middle">ALMA</text>
            <text x="315" y="284" class="triangle-label-stats" text-anchor="middle">
              ${n?a.hasGoals?`Alvo: ${l}% · Atual: ${a.progress}%`:`Alvo: ${l}%`:`Definir`}
            </text>
          </g>
        </svg>
      </div>

      <!-- Legend -->
      ${n?`
        <div class="triangle-legend">
          <div class="legend-item">
            <span class="legend-line legend-alter-ego"></span>
            <span class="legend-text">Destino (Alter Ego)</span>
          </div>
          <div class="legend-item">
            <span class="legend-box legend-evolution"></span>
            <span class="legend-text">Evolução Atual (Metas)</span>
          </div>
        </div>
      `:``}

      <!-- State 2: Has Alter Ego, but no goals -->
      ${n&&!o?`
        <div class="triangle-empty-banner">
          <p class="empty-banner-title">Crie metas para começar sua evolução.</p>
          <p class="empty-banner-desc">O triângulo pontilhado acima representa onde você quer chegar. Suas metas movimentarão o triângulo da evolução.</p>
          <button class="btn btn-primary btn-sm" id="btn-empty-create-goal">
            + Adicionar Primeira Meta
          </button>
        </div>
      `:``}

      <!-- Contextual Inspector (Active Pillar) -->
      <div class="triangle-context-panel ${O?`visible`:``}" id="triangle-context-panel">
        ${O?`
          <div class="triangle-context-card">
            <div class="triangle-context-top">
              <div class="context-pillar-header">
                <span class="triangle-context-pillar">${O.title}</span>
                <span class="context-distance-badge">
                  Distância: ${O.distance} ${O.distance===1?`ponto`:`pontos`}
                </span>
              </div>
              <button class="triangle-context-dismiss" id="triangle-dismiss-btn" aria-label="Fechar">&times;</button>
            </div>

            <div class="context-stats-grid">
              <div class="context-stat-box">
                <span class="stat-box-label">Alter Ego (Alvo)</span>
                <span class="stat-box-value">${O.target}%</span>
              </div>
              <div class="context-stat-box">
                <span class="stat-box-label">Evolução Atual</span>
                <span class="stat-box-value ${O.hasGoals?`active`:``}">
                  ${O.hasGoals?`${O.progress}%`:`Sem metas`}
                </span>
              </div>
            </div>

            <!-- Traits from Alter Ego -->
            ${O.traits.length>0?`
              <div class="context-traits-row">
                ${O.traits.map(e=>`<span class="context-trait-chip">${e}</span>`).join(``)}
              </div>
            `:``}

            <!-- Goals List -->
            <div class="context-goals-section">
              <div class="context-goals-header">
                <span class="context-goals-title">Metas Responsáveis (${O.goals.length})</span>
                <button class="btn-add-meta-small" id="btn-add-meta-context" data-pillar="${O.pillarId}">
                  ${R(`plus`,12)} Adicionar Meta
                </button>
              </div>

              ${O.goals.length===0?`
                <p class="context-no-goals">Nenhuma meta associada a este pilar ainda. Adicione uma meta para começar a evoluir.</p>
              `:`
                <div class="context-goals-list">
                  ${O.goals.map(e=>`
                    <div class="context-goal-item" data-goal-id="${e.id}">
                      <div class="goal-item-main">
                        <span class="goal-item-title">${e.title}</span>
                        <div class="goal-item-controls">
                          <button class="goal-step-btn" data-action="decrement" data-goal-id="${e.id}">-10%</button>
                          <span class="goal-item-pct">${e.progress}%</span>
                          <button class="goal-step-btn" data-action="increment" data-goal-id="${e.id}">+10%</button>
                          <button class="goal-edit-btn" data-action="edit" data-goal-id="${e.id}" title="Editar Meta">
                            ${R(`edit`,13)}
                          </button>
                        </div>
                      </div>
                      <div class="goal-mini-bar">
                        <div class="goal-mini-fill" style="width: ${e.progress}%"></div>
                      </div>
                    </div>
                  `).join(``)}
                </div>
              `}
            </div>
          </div>
        `:`
          <p class="triangle-context-hint">Toque em Mente, Corpo ou Alma para gerenciar metas e ver a distância para o Alter Ego</p>
        `}
      </div>
    </section>
  `}function ne(e,t){let n=t.alterEgo,r=n?n[e]:{target:80,traits:[]},i=N(t,e),a=M(t,e),o=r.target,s=i.progress,c=Math.max(0,o-s);return{pillarId:e,title:{mente:`MENTE`,corpo:`CORPO`,alma:`ALMA`}[e],target:o,progress:s,distance:c,hasGoals:i.hasGoals,traits:r.traits||[],goals:a}}function re(e,t,n){let r=e.querySelector(`#evolution-triangle-card`);if(!r)return;let i=e=>{e.preventDefault(),ee(t,e=>{n.onStateChange(e),n.onRerender()})};r.querySelector(`#btn-open-alter-ego`)?.addEventListener(`click`,i),r.querySelector(`#btn-empty-alter-ego`)?.addEventListener(`click`,i),r.querySelector(`#btn-empty-create-goal`)?.addEventListener(`click`,e=>{e.preventDefault(),B(t,{onSave:e=>{n.onStateChange(e),n.onRerender()}})}),r.querySelectorAll(`[data-pillar-vertex]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation();let r=e.getAttribute(`data-pillar-vertex`);V=V===r?null:r,n.onRerender()})}),r.querySelector(`#triangle-dismiss-btn`)?.addEventListener(`click`,e=>{e.preventDefault(),V=null,n.onRerender()}),r.querySelector(`#btn-add-meta-context`)?.addEventListener(`click`,e=>{e.preventDefault(),B(t,{defaultPillar:e.currentTarget.getAttribute(`data-pillar`)||`mente`,onSave:e=>{n.onStateChange(e),n.onRerender()}})}),r.querySelectorAll(`[data-action][data-goal-id]`).forEach(e=>{e.addEventListener(`click`,r=>{r.preventDefault(),r.stopPropagation();let i=e.getAttribute(`data-action`),a=e.getAttribute(`data-goal-id`),o=t.goals?.find(e=>e.id===a);if(o){if(i===`increment`){let e=k(t,a,Math.min(100,o.progress+10));n.onStateChange(e),n.onRerender()}else if(i===`decrement`){let e=k(t,a,Math.max(0,o.progress-10));n.onStateChange(e),n.onRerender()}else i===`edit`&&B(t,{goalId:a,onSave:e=>{n.onStateChange(e),n.onRerender()}})}})})}function Z(e,t,n){let i=r();t=g(t,i),n.onStateChange(t);let a=b(t,i),o=C(t);e.innerHTML=`
    <div class="page">
      <div class="page-header">
        <p class="page-label">visão geral</p>
        <h1 class="page-title">Hoje</h1>
      </div>

      ${o>0?`
        <div class="streak-badge">
          <span class="streak-icon">${R(`flame`,16)}</span>
          <span>${o} ${o===1?`dia`:`dias`} de consistência</span>
        </div>
      `:``}

      <div class="progress-container">
        <div class="progress-summary">
          <span class="progress-number">${a.completed}</span>
          <span class="progress-total">${a.total>0?`/ ${a.total} hábitos concluídos`:`hábitos cadastrados`}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${a.percent}%"></div>
        </div>
      </div>

      ${te(t)}

      <div id="pillars-container">
        ${F.map(e=>{let n=x(t,i,e.id),r=v(t,i,e.id);return`
            <div class="pillar-card">
              <div class="pillar-header">
                <div class="pillar-info">
                  <span class="pillar-icon">${z(e.id,18)}</span>
                  <span class="pillar-name">${e.name}</span>
                </div>
                <span class="pillar-count">${n.completed} / ${n.total}</span>
              </div>

              ${r.length===0?`
                <div class="empty-pillar-habits">
                  <p class="empty-pillar-text">Nenhum hábito cadastrado</p>
                  <button class="btn-today-add-habit" data-today-add-pillar="${e.id}">
                    ${R(`plus`,14)} <span>Adicionar hábito</span>
                  </button>
                </div>
              `:`
                ${r.map(e=>`
                  <div class="habit-item ${e.completed?`completed`:``}" data-daily-habit-id="${e.id}">
                    <div class="habit-checkbox ${e.completed?`checked`:``}">
                      <span class="check-icon">${R(`check`,14)}</span>
                    </div>
                    <span class="habit-name">${e.habitName}</span>
                  </div>
                `).join(``)}

                ${r.length<3?`
                  <button class="btn-today-add-habit btn-add-more" data-today-add-pillar="${e.id}">
                    ${R(`plus`,12)} <span>Adicionar outro hábito (${r.length}/3)</span>
                  </button>
                `:``}
              `}
            </div>
          `}).join(``)}
      </div>

      ${a.total>0&&a.completed===a.total?`
        <div class="perfect-day">
          <div class="perfect-day-icon">${R(`sparkles`,40)}</div>
          <p class="perfect-day-title">Dia perfeito!</p>
          <p class="perfect-day-sub">Todos os ${a.total} hábitos concluídos.</p>
        </div>
      `:``}
    </div>

    <div id="today-modal-container"></div>
  `,re(e,t,{onStateChange:e=>{t=e,n.onStateChange(e)},onRerender:()=>{Z(e,t,n)}}),e.querySelectorAll(`.habit-item[data-daily-habit-id]`).forEach(r=>{r.addEventListener(`click`,()=>{let i=r.getAttribute(`data-daily-habit-id`);i&&Z(e,y(t,i),n)})}),e.querySelectorAll(`[data-today-add-pillar]`).forEach(r=>{r.addEventListener(`click`,i=>{i.stopPropagation();let a=r.getAttribute(`data-today-add-pillar`);a&&ie(a,t,n,e)})})}function ie(e,t,n,r){let i=document.getElementById(`today-modal-container`);if(!i)return;let a=F.find(t=>t.id===e),o=a?a.name:e;i.innerHTML=`
    <div class="modal-overlay" id="today-modal-overlay">
      <div class="modal-content">
        <div class="modal-handle"></div>
        <h2 class="modal-title">${z(e,20)} Novo Hábito · ${o}</h2>
        <p class="modal-subtitle" style="margin-top: 4px; margin-bottom: var(--spacing-md); color: var(--text-tertiary); font-size: var(--font-size-xs);">
          Defina uma ação diária simples e consistente para evoluir este pilar.
        </p>
        <input
          type="text"
          class="modal-input"
          id="today-habit-input"
          placeholder="Ex: Ler 10 páginas, Treinar 30 min..."
          maxlength="60"
          autocomplete="off"
        />
        <div class="modal-actions" style="margin-top: var(--spacing-md);">
          <button class="btn-secondary" id="today-modal-cancel">Cancelar</button>
          <button class="btn-primary" id="today-modal-save">Salvar Hábito</button>
        </div>
      </div>
    </div>
  `;let s=document.getElementById(`today-habit-input`);s?.focus();let c=()=>{i.innerHTML=``};document.getElementById(`today-modal-overlay`)?.addEventListener(`click`,e=>{e.target===document.getElementById(`today-modal-overlay`)&&c()}),document.getElementById(`today-modal-cancel`)?.addEventListener(`click`,c);let l=()=>{let i=s?.value?.trim();if(!i)return;let a=d(t,e,i);n.onStateChange(a),c(),Z(r,a,n)};document.getElementById(`today-modal-save`)?.addEventListener(`click`,l),s?.addEventListener(`keydown`,e=>{e.key===`Enter`&&l(),e.key===`Escape`&&c()})}function ae(e,t){let n=r(),o=T(),s=w(t);e.innerHTML=`
    <div class="page">
      <div class="page-header">
        <p class="page-label">progresso</p>
        <h1 class="page-title">Histórico</h1>
      </div>

      <p class="section-title">Últimos 7 dias</p>
      <div class="history-week">
        ${o.map(e=>{let r=b(t,e),i=e===n,o=r.total>0&&r.completed===r.total;return`
            <div class="week-day ${i?`today`:``} ${o?`perfect`:``}">
              <span class="week-day-label">${a(e)}</span>
              <span class="week-day-count">${r.total>0?`${r.completed}/${r.total}`:`—`}</span>
            </div>
          `}).join(``)}
      </div>

      <p class="section-title">Todos os dias</p>
      <div class="history-list" id="history-list">
        ${s.length===0?`
          <div class="empty-state">
            <div class="empty-icon">${R(`barChart`,40)}</div>
            <p class="empty-text">Seu histórico aparecerá aqui conforme você registra seus hábitos.</p>
          </div>
        `:s.map(e=>{let r=b(t,e);return`
            <div class="history-item ${r.completed>=7?`consistent`:``}" data-history-date="${e}">
              <div>
                <span class="history-date">${e===n?`Hoje`:i(e)}</span>
              </div>
              <div class="history-score">
                <span class="history-count">${r.completed}/${r.total}</span>
                <span class="history-percent">${r.percent}%</span>
              </div>
            </div>
          `}).join(``)}
      </div>
    </div>

    <div id="history-detail-container"></div>
  `,e.querySelectorAll(`.history-item[data-history-date]`).forEach(e=>{e.addEventListener(`click`,()=>{let n=e.getAttribute(`data-history-date`);n&&oe(t,n)})})}function oe(e,t){let n=document.getElementById(`history-detail-container`);if(!n)return;let a=b(e,t);n.innerHTML=`
    <div class="history-detail-overlay" id="detail-overlay">
      <div class="history-detail-content">
        <div class="modal-handle"></div>
        <div class="detail-header">
          <span class="detail-date">${t===r()?`Hoje`:i(t)}</span>
          <span class="detail-score">${a.completed}/${a.total} — ${a.percent}%</span>
        </div>

        ${F.map(n=>{let r=v(e,t,n.id);return r.length===0?``:`
            <div class="pillar-card" style="pointer-events: none;">
              <div class="pillar-header">
                <div class="pillar-info">
                  <span class="pillar-icon">${z(n.id,18)}</span>
                  <span class="pillar-name">${n.name}</span>
                </div>
              </div>
              ${r.map(e=>`
                <div class="habit-item ${e.completed?`completed`:``}">
                  <div class="habit-checkbox ${e.completed?`checked`:``}">
                    <span class="check-icon">${R(`check`,14)}</span>
                  </div>
                  <span class="habit-name">${e.habitName}</span>
                </div>
              `).join(``)}
            </div>
          `}).join(``)}
      </div>
    </div>
  `;let o=document.getElementById(`detail-overlay`);o?.addEventListener(`click`,e=>{e.target===o&&(n.innerHTML=``)})}function Q(e,t,n){e.innerHTML=`
    <div class="page">
      <div class="page-header">
        <p class="page-label">gerenciar</p>
        <h1 class="page-title">Hábitos</h1>
      </div>

      <div class="notice-banner">
        ${R(`alertTriangle`,16)}
        <span>Alterações nos hábitos serão aplicadas a partir de amanhã.</span>
      </div>

      ${F.map(e=>{let n=h(t,e.id);return`
          <div class="habits-section">
            <div class="habits-section-header">
              <div class="habits-section-title">
                ${z(e.id,18)}
                <span>${e.name}</span>
              </div>
              <span style="font-size: var(--font-size-sm); color: var(--text-tertiary);">${n.length}/3</span>
            </div>

            ${n.map((t,n)=>`
              <div class="habit-manage-item" data-habit-id="${t.id}" data-pillar="${e.id}">
                <span class="habit-order">${n+1}</span>
                <span class="habit-manage-name">${t.name}</span>
                <button class="habit-edit-btn" data-edit-id="${t.id}" aria-label="Editar hábito">
                  ${R(`edit`,16)}
                </button>
              </div>
            `).join(``)}

            ${n.length<3?`
              <button class="btn-secondary btn-with-icon" data-add-pillar="${e.id}" style="margin-top: var(--spacing-xs);">
                ${R(`plus`,16)}
                <span>Adicionar hábito</span>
              </button>
            `:``}
          </div>
        `}).join(``)}
    </div>

    <div id="habit-modal-container"></div>
  `,e.querySelectorAll(`[data-edit-id]`).forEach(r=>{r.addEventListener(`click`,i=>{i.stopPropagation();let a=r.getAttribute(`data-edit-id`);if(!a)return;let o=t.habits.find(e=>e.id===a);o&&se(t,a,o.name,o.pillarId,n,e)})}),e.querySelectorAll(`[data-add-pillar]`).forEach(r=>{r.addEventListener(`click`,()=>{let i=r.getAttribute(`data-add-pillar`);i&&ce(t,i,n,e)})})}function se(e,t,n,r,i,a){let o=document.getElementById(`habit-modal-container`);if(!o)return;o.innerHTML=`
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content">
        <div class="modal-handle"></div>
        <h2 class="modal-title">${z(r,20)} Editar hábito</h2>
        <input
          type="text"
          class="modal-input"
          id="modal-input"
          value="${n}"
          placeholder="Nome do hábito"
          maxlength="60"
          autocomplete="off"
        />
        <div class="modal-actions">
          <button class="btn-secondary" id="modal-cancel">Cancelar</button>
          <button class="btn-primary" id="modal-save">Salvar</button>
        </div>
        <button class="btn-danger" id="modal-delete">
          ${R(`trash`,14)}
          Remover este hábito
        </button>
      </div>
    </div>
  `;let s=document.getElementById(`modal-input`);s?.focus(),s?.select();let c=()=>{o.innerHTML=``};document.getElementById(`modal-overlay`)?.addEventListener(`click`,e=>{e.target===document.getElementById(`modal-overlay`)&&c()}),document.getElementById(`modal-cancel`)?.addEventListener(`click`,c),document.getElementById(`modal-save`)?.addEventListener(`click`,()=>{let r=s?.value?.trim();if(r){if(r!==n){let n=p(e,t,r);i.onStateChange(n),Q(a,n,i)}c()}}),document.getElementById(`modal-delete`)?.addEventListener(`click`,()=>{let n=f(e,t);i.onStateChange(n),Q(a,n,i),c()})}function ce(e,t,n,r){let i=document.getElementById(`habit-modal-container`);if(!i)return;i.innerHTML=`
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content">
        <div class="modal-handle"></div>
        <h2 class="modal-title">${z(t,20)} Novo hábito</h2>
        <input
          type="text"
          class="modal-input"
          id="modal-input"
          placeholder="Nome do hábito"
          maxlength="60"
          autocomplete="off"
        />
        <div class="modal-actions">
          <button class="btn-secondary" id="modal-cancel">Cancelar</button>
          <button class="btn-primary" id="modal-save">Adicionar</button>
        </div>
      </div>
    </div>
  `;let a=document.getElementById(`modal-input`);a?.focus();let o=()=>{i.innerHTML=``};document.getElementById(`modal-overlay`)?.addEventListener(`click`,e=>{e.target===document.getElementById(`modal-overlay`)&&o()}),document.getElementById(`modal-cancel`)?.addEventListener(`click`,o),document.getElementById(`modal-save`)?.addEventListener(`click`,()=>{let i=a?.value?.trim();if(!i)return;let s=d(e,t,i);n.onStateChange(s),Q(r,s,n),o()})}function $(e=32,t=``){return`
    <svg
      class="resetando-logo ${t}"
      width="${e}"
      height="${e}"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo Resetando"
    >
      <defs>
        <linearGradient id="resGradPrimary-${e}" x1="8" y1="40" x2="24" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#9E7D1E" />
          <stop offset="50%" stop-color="#D4AF37" />
          <stop offset="100%" stop-color="#F0D878" />
        </linearGradient>
        <linearGradient id="resGradAscent-${e}" x1="24" y1="34" x2="24" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#F0D878" />
        </linearGradient>
      </defs>

      <!-- Outer Triad Frame (Equilateral Evolution Delta) -->
      <path
        d="M24 6L7 39H41L24 6Z"
        stroke="url(#resGradPrimary-${e})"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Evolution Vector: Ascending Inner Arrow (Personal Growth) -->
      <path
        d="M15 32L24 19L33 32"
        stroke="url(#resGradAscent-${e})"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Core Transcendence Spark (Enlightenment / Rebirth) -->
      <circle cx="24" cy="13" r="2.2" fill="#F0D878" />

      <!-- Base Grounding Accent -->
      <line x1="19" y1="39" x2="29" y2="39" stroke="#F0D878" stroke-width="2.5" stroke-linecap="round" />
    </svg>
  `}function le(e,t,n){let r=C(t),i=w(t),a=i.length,o=0,s=0,c=0,l=0;i.forEach(e=>{let n=b(t,e);o+=n.completed,s+=n.total,n.completed>=7&&c++,n.total>0&&n.completed===n.total&&l++});let u=s>0?Math.round(o/s*100):0;e.innerHTML=`
    <div class="page">
      <div class="profile-brand">
        <div class="profile-logo-wrap">${$(52,`profile-logo`)}</div>
        <h1 class="profile-brand-name"><span class="gold">RESET</span>ANDO</h1>
        <p class="profile-brand-tagline">Evolução pessoal · Mente, Corpo e Alma</p>
      </div>

      <div class="profile-stats">
        <div class="stat-card">
          <div class="stat-value">${R(`flame`,20)} ${r}</div>
          <div class="stat-label">Sequência Atual</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${a}</div>
          <div class="stat-label">Dias Registrados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${l}</div>
          <div class="stat-label">Dias Perfeitos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${u}%</div>
          <div class="stat-label">Taxa de Adesão</div>
        </div>
      </div>

      <div class="profile-stats" style="grid-template-columns: 1fr;">
        <div class="stat-card" style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div class="stat-label" style="text-align: left;">Dias Consistentes (≥ 7/9)</div>
          </div>
          <div class="stat-value" style="margin-bottom: 0;">${c}/${a}</div>
        </div>
      </div>

      <p class="section-title" style="margin-top: var(--spacing-lg);">Filosofia</p>

      <div class="philosophy-card">
        <h3 class="philosophy-title">${R(`scale`,18)} Os 3 Pilares</h3>
        <p class="philosophy-text">
          Você não é apenas mente, corpo ou alma — é a soma dos três.
          Quando um pilar enfraquece, os outros sentem o impacto.
          Quando os três estão fortes, você vive com propósito e equilíbrio.
        </p>
      </div>

      <div class="philosophy-card">
        <h3 class="philosophy-title">${R(`target`,18)} 9 Compromissos</h3>
        <p class="philosophy-text">
          Não tente mudar tudo de uma vez. 3 hábitos para cada pilar. 9 no total.
          Pequenos, consistentes, repetidos. A disciplina nasce da simplicidade.
        </p>
      </div>

      <div class="philosophy-card">
        <h3 class="philosophy-title">${R(`flame`,18)} Consistência > Perfeição</h3>
        <p class="philosophy-text">
          Você não precisa de 9/9 todos os dias. 7 de 9 já mantém sua sequência.
          O objetivo não é perfeccionismo — é não viver no piloto automático.
        </p>
      </div>

      <div style="margin-top: var(--spacing-xl); padding-top: var(--spacing-md); border-top: 1px solid var(--border-subtle);">
        <button class="btn-danger" id="reset-data" style="width: 100%; border: 1px solid rgba(220, 38, 38, 0.25); border-radius: var(--radius-md); padding: var(--spacing-md);">
          ${R(`trash`,14)}
          Resetar todos os dados
        </button>
      </div>
    </div>
  `,document.getElementById(`reset-data`)?.addEventListener(`click`,()=>{confirm(`Tem certeza? Todos os seus dados serão permanentemente apagados.`)&&confirm(`Esta ação não pode ser desfeita. Deseja realmente continuar?`)&&(localStorage.removeItem(`resetando_data`),localStorage.removeItem(`3pilares_data`),n.onReset())})}new class{state;currentTab=`hoje`;appEl;constructor(){this.appEl=document.getElementById(`app`),this.state=l(),this.init()}init(){this.state.onboardingComplete?this.renderApp():this.renderOnboarding()}renderOnboarding(){this.appEl.innerHTML=`<div id="content"></div>`,P(document.getElementById(`content`),this.state,{onComplete:e=>{this.state=e,this.renderApp()}})}renderApp(){let e=r();this.appEl.innerHTML=`
      ${this.renderTopNavBar(e)}
      <div id="content"></div>
      ${this.renderNavBar()}
    `,this.bindNav(),this.renderCurrentTab()}renderTopNavBar(e){return`
      <header class="top-nav-bar" id="top-nav-bar">
        <div class="top-nav-brand">
          <span class="top-nav-logo">${$(24)}</span>
          <span class="top-nav-name"><span class="gold">RESET</span>ANDO</span>
        </div>
        <div class="top-nav-info">
          <div class="top-nav-date">
            <span class="nav-date-icon">${R(`calendar`,13)}</span>
            <span class="nav-date-text">${o(e)}</span>
          </div>
        </div>
      </header>
    `}renderNavBar(){return`
      <nav class="bottom-nav" id="bottom-nav">
        ${[{id:`hoje`,iconHtml:R(`sun`,20),label:`Hoje`},{id:`historico`,iconHtml:R(`calendar`,20),label:`Histórico`},{id:`habitos`,iconHtml:R(`listChecks`,20),label:`Hábitos`},{id:`perfil`,iconHtml:R(`user`,20),label:`Perfil`}].map(e=>`
          <button
            class="nav-item ${this.currentTab===e.id?`active`:``}"
            data-tab="${e.id}"
            aria-label="${e.label}"
          >
            <span class="nav-icon">${e.iconHtml}</span>
            <span class="nav-label">${e.label}</span>
          </button>
        `).join(``)}
      </nav>
    `}bindNav(){document.querySelectorAll(`.nav-item[data-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-tab`);if(t&&t!==this.currentTab){this.currentTab=t;let e=document.getElementById(`bottom-nav`);e&&(e.outerHTML=this.renderNavBar(),this.bindNav()),this.renderCurrentTab()}})})}renderCurrentTab(){let e=document.getElementById(`content`);switch(this.currentTab){case`hoje`:Z(e,this.state,{onStateChange:e=>{this.state=e}});break;case`historico`:ae(e,this.state);break;case`habitos`:Q(e,this.state,{onStateChange:e=>{this.state=e}});break;case`perfil`:le(e,this.state,{onStateChange:e=>{this.state=e},onReset:()=>{this.state=l(),this.renderOnboarding()}})}}};