(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const l of t)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function a(t){const l={};return t.integrity&&(l.integrity=t.integrity),t.referrerPolicy&&(l.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?l.credentials="include":t.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function n(t){if(t.ep)return;t.ep=!0;const l=a(t);fetch(t.href,l)}})();const y="modulepreload",M=function(e){return"/"+e},v={},C=function(s,a,n){let t=Promise.resolve();if(a&&a.length>0){let r=function(d){return Promise.all(d.map(p=>Promise.resolve(p).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),u=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));t=r(a.map(d=>{if(d=M(d),d in v)return;v[d]=!0;const p=d.endsWith(".css"),m=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${m}`))return;const c=document.createElement("link");if(c.rel=p?"stylesheet":y,p||(c.as="script"),c.crossOrigin="",c.href=d,u&&c.setAttribute("nonce",u),document.head.appendChild(c),p)return new Promise((x,b)=>{c.addEventListener("load",x),c.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${d}`)))})}))}function l(r){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r}return t.then(r=>{for(const o of r||[])o.status==="rejected"&&l(o.reason);return s().catch(l)})};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=(e,s,a=[])=>{const n=document.createElementNS("http://www.w3.org/2000/svg",e);return Object.keys(s).forEach(t=>{n.setAttribute(t,String(s[t]))}),a.length&&a.forEach(t=>{const l=w(...t);n.appendChild(l)}),n};var z=([e,s,a])=>w(e,s,a);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=e=>Array.from(e.attributes).reduce((s,a)=>(s[a.name]=a.value,s),{}),E=e=>typeof e=="string"?e:!e||!e.class?"":e.class&&typeof e.class=="string"?e.class.split(" "):e.class&&Array.isArray(e.class)?e.class:"",S=e=>e.flatMap(E).map(a=>a.trim()).filter(Boolean).filter((a,n,t)=>t.indexOf(a)===n).join(" "),P=e=>e.replace(/(\w)(\w*)(_|-|\s*)/g,(s,a,n)=>a.toUpperCase()+n.toLowerCase()),g=(e,{nameAttr:s,icons:a,attrs:n})=>{var b;const t=e.getAttribute(s);if(t==null)return;const l=P(t),r=a[l];if(!r)return console.warn(`${e.outerHTML} icon name was not found in the provided icons object.`);const o=k(e),[u,d,p]=r,m={...d,"data-lucide":t,...n,...o},c=S(["lucide",`lucide-${t}`,o,n]);c&&Object.assign(m,{class:c});const x=z([u,m,p]);return(b=e.parentNode)==null?void 0:b.replaceChild(x,e)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=["svg",i,[["path",{d:"m8 2 1.88 1.88"}],["path",{d:"M14.12 3.88 16 2"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"}],["path",{d:"M12 20v-9"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5"}],["path",{d:"M6 13H2"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4"}],["path",{d:"M22 13h-4"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=["svg",i,[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"}],["circle",{cx:"12",cy:"13",r:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=["svg",i,[["path",{d:"m9 18 6-6-6-6"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=["svg",i,[["circle",{cx:"12",cy:"12",r:"10"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=["svg",i,[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m9 12 2 2 4-4"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=["svg",i,[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"}],["path",{d:"M12 17h.01"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=["svg",i,[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=["svg",i,[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"7 10 12 15 17 10"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=["svg",i,[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"M12 18v-6"}],["path",{d:"m9 15 3 3 3-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=["svg",i,[["path",{d:"m12 14 4-4"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=["svg",i,[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}],["path",{d:"M12 7v5l4 2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=["svg",i,[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=["svg",i,[["polyline",{points:"15 3 21 3 21 9"}],["polyline",{points:"9 21 3 21 3 15"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=["svg",i,[["path",{d:"m18 8 4 4-4 4"}],["path",{d:"M2 12h20"}],["path",{d:"m6 8-4 4 4 4"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=["svg",i,[["path",{d:"M12 2v20"}],["path",{d:"m8 18 4 4 4-4"}],["path",{d:"m8 6 4-4 4 4"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=["svg",i,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=["svg",i,[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=["svg",i,[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=["svg",i,[["path",{d:"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"}],["path",{d:"m14.5 12.5 2-2"}],["path",{d:"m11.5 9.5 2-2"}],["path",{d:"m8.5 6.5 2-2"}],["path",{d:"m17.5 15.5 2-2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=["svg",i,[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=["svg",i,[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}],["path",{d:"M7 12h10"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=["svg",i,[["path",{d:"M20 7h-9"}],["path",{d:"M14 17H5"}],["circle",{cx:"17",cy:"17",r:"3"}],["circle",{cx:"7",cy:"7",r:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=["svg",i,[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=["svg",i,[["path",{d:"M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"}],["path",{d:"M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5"}],["circle",{cx:"12",cy:"12",r:"3"}],["path",{d:"m18 22-3-3 3-3"}],["path",{d:"m6 2 3 3-3 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=["svg",i,[["path",{d:"M3 6h18"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=["svg",i,[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=({icons:e={},nameAttr:s="data-lucide",attrs:a={}}={})=>{if(!Object.values(e).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const n=document.querySelectorAll(`[${s}]`);if(Array.from(n).forEach(t=>g(t,{nameAttr:s,icons:e,attrs:a})),s==="data-lucide"){const t=document.querySelectorAll("[icon-name]");t.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(t).forEach(l=>g(l,{nameAttr:"icon-name",icons:e,attrs:a})))}},se={AlertCircle:H,Bug:A,Camera:L,CheckCircle2:V,ChevronRight:j,CircleHelp:T,Copy:N,Download:R,FileDown:B,Gauge:O,History:I,Home:q,Maximize2:U,MoveHorizontal:_,MoveVertical:D,Play:F,RefreshCw:$,RotateCcw:W,Ruler:X,Save:K,ScanLine:Z,Settings2:G,Square:J,SwitchCamera:Y,Trash2:Q,X:ee};function h(){te({icons:se,attrs:{"stroke-width":1.8}})}function oe(e){e.innerHTML=`
    <div class="min-h-[100dvh] w-full min-w-0 max-w-full overflow-x-clip bg-slate-50 text-slate-900">
      <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div class="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-4 sm:px-6">
          <div class="flex min-w-0 items-center gap-3">
            <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"><i data-lucide="ruler" class="size-[18px]"></i></div>
            <div class="min-w-0"><h1 class="truncate text-[15px] font-semibold text-slate-950">PlaneMeasure</h1><p class="hidden text-xs text-slate-500 sm:block">Calibrated camera measurement</p></div>
          </div>
          <div class="flex items-center gap-1.5">
            <div id="visionStatusShell" class="mr-1 hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex"><span id="visionStatusIndicator" class="size-2.5 rounded-full bg-slate-300"></span><span id="opencvStatus" class="text-xs font-medium text-slate-500">Calibration loads with camera</span></div>
            <button id="helpButton" class="icon-button" title="Calibration help" aria-label="Calibration help"><i data-lucide="circle-help" class="size-[18px]"></i></button>
            <button id="debugButton" class="icon-button" title="Debug mode" aria-label="Debug mode"><i data-lucide="bug" class="size-[18px]"></i></button>
          </div>
        </div>
      </header>

      <main class="mx-auto grid w-full min-w-0 max-w-[1680px] gap-5 p-0 md:p-5 lg:grid-cols-[minmax(0,1fr)_370px] xl:grid-cols-[minmax(0,1fr)_410px]">
        <section class="min-w-0">
          <div class="min-w-0 max-w-full overflow-hidden bg-white md:rounded-2xl md:border md:border-slate-200 md:shadow-sm">
            <div class="camera-workspace-header flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
              <div><h2 class="text-sm font-semibold text-slate-900">Camera workspace</h2><p class="mt-0.5 text-xs text-slate-500">Place the marker and object on the same flat plane</p></div>
              <label class="hidden items-center gap-2 text-xs font-medium text-slate-500 sm:flex"><i data-lucide="settings-2" class="size-4"></i><select id="resolutionSelect" class="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option value="640x480">640 x 480</option><option value="1280x720" selected>1280 x 720</option><option value="1920x1080">1920 x 1080</option></select></label>
            </div>

            <div id="cameraStage" class="camera-stage">
              <video id="cameraVideo" autoplay playsinline muted></video><canvas id="overlayCanvas" aria-label="Measurement overlay"></canvas><canvas id="processingCanvas" class="hidden"></canvas>
              <div id="cameraEmpty" class="absolute inset-0 z-10 flex items-center justify-center p-6 text-center"><div class="max-w-sm"><div class="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white backdrop-blur"><i data-lucide="camera" class="size-6"></i></div><p class="text-lg font-semibold text-white">Start the camera to measure</p><p class="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-300">Camera processing stays on this device. Nothing is uploaded.</p><button id="emptyStartButton" class="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 shadow-sm transition-colors hover:bg-blue-50"><i data-lucide="play" class="size-4"></i> Start camera</button></div></div>
              <div class="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-3 sm:inset-x-4 sm:top-4"><div id="calibrationBadge" class="flex min-h-9 items-center gap-2 rounded-xl border border-amber-300/30 bg-slate-950/85 px-3 text-xs font-medium text-amber-100 backdrop-blur-xl"><span id="calibrationDot" class="size-2 rounded-full bg-amber-300 status-pulse"></span><span id="calibrationBadgeText">Calibration required</span></div><div id="modeBadge" class="rounded-xl border border-white/15 bg-slate-950/85 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl">Free mode</div></div>
              <div class="pointer-events-none absolute inset-x-3 bottom-3 z-20 sm:inset-x-4 sm:bottom-4"><div id="cameraError" class="pointer-events-auto hidden items-start gap-3 rounded-xl border border-red-300/30 bg-white/95 p-3 text-sm text-red-700 shadow-lg backdrop-blur"><i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0"></i><span id="cameraErrorText"></span></div></div>
            </div>

            <div class="camera-controls min-w-0 border-t border-slate-200 bg-white p-3 sm:p-4">
              <div class="mb-3 flex min-w-0 items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 md:hidden"><div class="min-w-0"><span class="block text-[10px] font-semibold text-blue-500">LIVE RESULT</span><span id="mobileModeLabel" class="block truncate text-xs font-semibold text-slate-700">Free</span></div><span id="mobileMeasurementValue" class="mono-number min-w-0 max-w-[68%] truncate text-right text-xl font-semibold text-blue-700">--.--- cm</span></div>
              <div id="modeControls" class="mode-controls-grid grid gap-1 rounded-xl bg-slate-100 p-1" aria-label="Measurement mode">
                <button data-mode="free" class="mode-button mode-button-active"><i data-lucide="scan-line" class="size-4"></i><span>Free</span></button>
                <button data-mode="length" class="mode-button"><i data-lucide="maximize-2" class="size-4"></i><span>Length</span></button>
                <button data-mode="width" class="mode-button"><i data-lucide="move-horizontal" class="size-4"></i><span>Width</span></button>
                <button data-mode="height" class="mode-button"><i data-lucide="move-vertical" class="size-4"></i><span>Height</span></button>
              </div>
              <div class="action-controls-grid mt-3 grid gap-2">
                <button id="startCameraButton" class="tool-button"><i data-lucide="camera" class="size-4"></i><span>Start</span></button>
                <button id="switchCameraButton" class="tool-button" title="Switch camera"><i data-lucide="switch-camera" class="size-4"></i><span class="hidden min-[390px]:inline">Switch</span></button>
                <button id="clearMeasurementButton" class="tool-button"><i data-lucide="rotate-ccw" class="size-4"></i><span class="hidden min-[390px]:inline">Clear</span></button>
                <button id="saveMeasurementButton" disabled class="primary-tool-button"><i data-lucide="save" class="size-4"></i><span>Save</span></button>
              </div>
            </div>
          </div>
        </section>

        <aside class="min-w-0 max-w-full space-y-5 px-3 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4 md:px-0 md:pb-5 md:pt-0">
          <nav class="mobile-panel-nav md:hidden" aria-label="Tool panels"><button data-mobile-target="measure" class="mobile-panel-button mobile-panel-button-active"><i data-lucide="ruler" class="size-4"></i>Measure</button><button data-mobile-target="calibration" class="mobile-panel-button"><i data-lucide="scan-line" class="size-4"></i>Calibrate</button><button data-mobile-target="history" class="mobile-panel-button"><i data-lucide="history" class="size-4"></i>History</button></nav>
          <section data-mobile-panel="measure" class="panel mobile-panel-active overflow-hidden">
            <div class="border-b border-slate-200 p-5"><div class="flex items-center justify-between gap-3"><div><p class="text-xs font-medium text-slate-500">CURRENT MEASUREMENT</p><h2 id="currentModeLabel" class="mt-1 text-sm font-semibold text-slate-900">Free</h2></div><div class="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><i data-lucide="ruler" class="size-[18px]"></i></div></div><div class="mt-6 min-h-24"><p id="measurementValue" class="mono-number break-all text-4xl font-semibold leading-none text-slate-300">--.--- cm</p><p id="measurementHint" class="mt-3 text-sm leading-5 text-slate-500">Calibrate, then drag across the camera view.</p><div id="measurementDetails" class="mt-5 hidden grid-cols-2 gap-y-2 border-t border-slate-200 pt-4 text-xs"><span class="text-slate-500">Angle</span><span id="angleValue" class="mono-number text-right font-medium text-slate-800">0.00 deg</span><span class="text-slate-500">Plane distance</span><span id="mmValue" class="mono-number text-right font-medium text-slate-800">0.000 mm</span></div></div></div>
            <div class="grid grid-cols-2 gap-3 bg-slate-50/70 p-5"><label class="field-label">Unit<select id="unitSelect" class="field-select"><option value="cm">Centimeters</option><option value="mm">Millimeters</option><option value="m">Meters</option></select></label><label class="field-label">Precision<select id="precisionSelect" class="field-select"><option value="1">1 decimal</option><option value="2">2 decimals</option><option value="3" selected>3 decimals</option><option value="4">4 decimals</option><option value="5">5 decimals</option></select></label></div>
          </section>

          <section data-mobile-panel="calibration" class="panel p-5">
            <div class="flex items-start justify-between gap-3"><div><h2 class="text-sm font-semibold text-slate-900">Calibration status</h2><p class="mt-1 text-xs text-slate-500">50.00 mm reference marker</p></div><span id="calibrationState" class="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">Required</span></div>
            <div class="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200"><div class="status-row"><span>Marker detected</span><span id="markerDetectedValue">No</span></div><div class="status-row"><span>Physical scale</span><span id="scaleValue" class="mono-number">No</span></div><div class="status-row"><span>Perspective correction</span><span id="perspectiveValue">Inactive</span></div><div class="status-row"><span>Detection quality</span><span id="qualityValue">--</span></div></div>
            <p id="calibrationMessage" class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">Place the supplied marker flat beside the object and keep all four corners visible.</p>
            <a href="/assets/calibration/planemeasure-marker-50mm.svg" target="_blank" class="secondary-button mt-3 w-full"><i data-lucide="download" class="size-4"></i> Open printable marker</a>
          </section>

          <section data-mobile-panel="history" class="panel p-5">
            <div class="flex items-center justify-between gap-3"><div class="flex items-center gap-2"><i data-lucide="history" class="size-[18px] text-slate-400"></i><h2 class="text-sm font-semibold text-slate-900">Measurement history</h2></div><button id="clearHistoryButton" class="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600">Clear all</button></div>
            <div id="historyList" class="scrollbar-thin mt-4 max-h-72 space-y-2 overflow-y-auto"><div class="rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center"><p class="text-sm font-medium text-slate-500">No saved measurements</p><p class="mt-1 text-xs text-slate-400">Your saved readings appear here.</p></div></div>
            <div class="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4"><span class="mr-auto flex items-center gap-2 text-xs font-medium text-slate-500"><i data-lucide="file-down" class="size-4"></i> Export</span><button data-export="csv" class="export-button">CSV</button><button data-export="json" class="export-button">JSON</button><button data-export="txt" class="export-button">TXT</button></div>
          </section>

          <section data-mobile-panel="measure" class="panel mobile-panel-active p-5">
            <div class="flex items-center gap-2"><i data-lucide="gauge" class="size-[18px] text-slate-400"></i><h2 class="text-sm font-semibold text-slate-900">Accuracy test</h2></div><p class="mt-2 text-xs leading-5 text-slate-500">Compare the current result with a known reference length.</p>
            <div class="mt-4 grid grid-cols-[1fr_88px] gap-2"><input id="expectedValue" type="number" min="0" step="any" placeholder="Expected value" class="field-input" /><select id="expectedUnit" class="field-select mt-0"><option>mm</option><option>cm</option><option>m</option></select></div><button id="addAccuracyTestButton" disabled class="secondary-button mt-2 w-full disabled:cursor-not-allowed disabled:opacity-40">Add current reading</button><div id="accuracyResults" class="mt-3 space-y-2"></div>
          </section>

          <section data-mobile-panel="calibration" class="panel p-4 sm:hidden"><label class="flex items-center justify-between gap-3 text-xs font-semibold text-slate-600">Camera resolution<select id="mobileResolutionProxy" class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-blue-500"><option value="640x480">640 x 480</option><option value="1280x720" selected>1280 x 720</option><option value="1920x1080">1920 x 1080</option></select></label></section>
        </aside>
      </main>

      <div id="debugPanel" class="fixed inset-y-0 right-0 z-[60] hidden w-full max-w-md border-l border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15"><div class="flex items-center justify-between"><div><h2 class="text-base font-semibold text-slate-950">Debug mode</h2><p class="mt-1 text-xs text-slate-500">Camera and calibration diagnostics</p></div><button id="closeDebugButton" class="icon-button" aria-label="Close debug"><i data-lucide="x" class="size-4"></i></button></div><div id="debugValues" class="mono-number mt-6 space-y-4 text-sm text-slate-700"></div></div>

      <dialog id="helpDialog" class="m-auto w-[min(92vw,640px)] rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/35"><div class="flex items-center justify-between border-b border-slate-200 p-5"><div><h2 class="font-semibold text-slate-950">Calibrate the measurement plane</h2><p class="mt-1 text-xs text-slate-500">Use the supplied 50 mm marker</p></div><button id="closeHelpButton" class="icon-button" aria-label="Close help"><i data-lucide="x" class="size-4"></i></button></div><div class="p-5 sm:p-6"><ol class="grid gap-3 sm:grid-cols-2"><li class="instruction-step"><span>1</span><div><strong>Print accurately</strong><p>Use actual size and confirm the marker is 50.00 mm.</p></div></li><li class="instruction-step"><span>2</span><div><strong>Use one plane</strong><p>Place the marker beside the object on a flat surface.</p></div></li><li class="instruction-step"><span>3</span><div><strong>Frame clearly</strong><p>Keep all corners visible, sharp, and well lit.</p></div></li><li class="instruction-step"><span>4</span><div><strong>Measure</strong><p>Wait for Valid, then drag between two points.</p></div></li></ol><p class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">Perspective correction cannot measure points above the calibrated surface or correct unknown lens distortion.</p><a href="/docs/calibration.md" target="_blank" class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">Read the calibration guide <i data-lucide="chevron-right" class="size-4"></i></a></div></dialog>
    </div>`,h()}function ae(e){e.innerHTML='<main class="grid min-h-[100dvh] place-items-center bg-slate-50 p-6 text-slate-900"><section class="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"><div class="flex size-11 items-center justify-center rounded-xl bg-blue-600 text-white"><i data-lucide="ruler" class="size-5"></i></div><p class="mono-number mt-10 text-sm font-semibold text-blue-600">404 / OUT OF FRAME</p><h1 class="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">This page cannot be measured.</h1><p class="mt-4 max-w-md text-sm leading-6 text-slate-500">The requested path does not exist. Return to the camera workspace to continue.</p><a href="/" class="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"><i data-lucide="home" class="size-4"></i> Return to PlaneMeasure</a></section></main>',h()}function ie(e,s){var n;const a=le((s==null?void 0:s.message)||"The application could not finish loading.");e.innerHTML=`<main class="grid min-h-[100dvh] place-items-center bg-slate-50 p-6 text-slate-900"><section class="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm sm:p-10"><div class="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><i data-lucide="alert-circle" class="size-5"></i></div><p class="mono-number mt-10 text-sm font-semibold text-red-600">APPLICATION EXCEPTION</p><h1 class="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">PlaneMeasure needs to restart.</h1><p class="mt-4 text-sm leading-6 text-slate-500">${a}</p><div class="mt-8 flex flex-wrap gap-2"><button id="exceptionReloadButton" class="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"><i data-lucide="refresh-cw" class="size-4"></i> Reload application</button><a href="/" class="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><i data-lucide="home" class="size-4"></i> Home</a></div></section></main>`,h(),(n=document.getElementById("exceptionReloadButton"))==null||n.addEventListener("click",()=>window.location.reload())}function le(e){return String(e).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[s])}const f=document.querySelector("#app"),ne=window.location.pathname.replace(/\/+$/,"")||"/";ne!=="/"?ae(f):C(()=>import("./app-DT5qjMq-.js"),[]).catch(e=>ie(f,e));export{h as a,oe as r};
