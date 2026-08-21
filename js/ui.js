import {
  createIcons,
  AlertCircle,
  Bug,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Copy,
  Download,
  FileDown,
  Gauge,
  History,
  Home,
  Maximize2,
  MoveHorizontal,
  MoveVertical,
  Play,
  RefreshCw,
  RotateCcw,
  Ruler,
  Save,
  ScanLine,
  Settings2,
  Square,
  SwitchCamera,
  Trash2,
  X,
} from 'lucide';

const iconSet = { AlertCircle, Bug, Camera, CheckCircle2, ChevronRight, CircleHelp, Copy, Download, FileDown, Gauge, History, Home, Maximize2, MoveHorizontal, MoveVertical, Play, RefreshCw, RotateCcw, Ruler, Save, ScanLine, Settings2, Square, SwitchCamera, Trash2, X };

export function refreshIcons() {
  createIcons({ icons: iconSet, attrs: { 'stroke-width': 1.8 } });
}

export function renderApp(root) {
  root.innerHTML = `
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
            <div class="flex items-start justify-between gap-3"><div><h2 class="text-sm font-semibold text-slate-900">Calibration status</h2><p class="mt-1 text-xs text-slate-500">50.00 × 50.00 mm reference marker</p></div><span id="calibrationState" class="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">Required</span></div>
            <div class="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200"><div class="status-row"><span>Marker detected</span><span id="markerDetectedValue">No</span></div><div class="status-row"><span>Physical scale</span><span id="scaleValue" class="mono-number">No</span></div><div class="status-row"><span>Perspective correction</span><span id="perspectiveValue">Inactive</span></div><div class="status-row"><span>Detection quality</span><span id="qualityValue">--</span></div></div>
            <p id="calibrationMessage" class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">Place the supplied marker flat beside the object and keep all four corners visible.</p>
            <button id="downloadMarkerButton" type="button" class="secondary-button mt-3 w-full"><i data-lucide="download" class="size-4"></i> Download print-ready PDF</button>
            <p class="mt-2 text-center text-[11px] leading-4 text-slate-400">A4 PDF with a 50 × 50 mm marker and a 100 mm verification line.</p>
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

      <dialog id="helpDialog" class="m-auto w-[min(92vw,640px)] rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/35"><div class="flex items-center justify-between border-b border-slate-200 p-5"><div><h2 class="font-semibold text-slate-950">Calibrate the measurement plane</h2><p class="mt-1 text-xs text-slate-500">Use the supplied 50 × 50 mm marker</p></div><button id="closeHelpButton" class="icon-button" aria-label="Close help"><i data-lucide="x" class="size-4"></i></button></div><div class="p-5 sm:p-6"><ol class="grid gap-3 sm:grid-cols-2"><li class="instruction-step"><span>1</span><div><strong>Download and print</strong><p>Download the print-ready A4 PDF and ask the shop to print it without resizing.</p></div></li><li class="instruction-step"><span>2</span><div><strong>Verify once</strong><p>Confirm the PDF’s verification line is 100 mm and the marker is 50 × 50 mm.</p></div></li><li class="instruction-step"><span>3</span><div><strong>Use one plane</strong><p>Place the marker beside the object on the same flat surface with all corners visible.</p></div></li><li class="instruction-step"><span>4</span><div><strong>Measure</strong><p>Wait for Valid, then drag between the object’s two endpoints.</p></div></li></ol><p class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">Perspective correction cannot measure points above the calibrated surface or correct unknown lens distortion.</p><a href="/docs/calibration.md" target="_blank" class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">Read the calibration guide <i data-lucide="chevron-right" class="size-4"></i></a></div></dialog>
    </div>`;
  refreshIcons();
}

export function renderNotFound(root) {
  root.innerHTML = `<main class="grid min-h-[100dvh] place-items-center bg-slate-50 p-6 text-slate-900"><section class="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"><div class="flex size-11 items-center justify-center rounded-xl bg-blue-600 text-white"><i data-lucide="ruler" class="size-5"></i></div><p class="mono-number mt-10 text-sm font-semibold text-blue-600">404 / OUT OF FRAME</p><h1 class="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">This page cannot be measured.</h1><p class="mt-4 max-w-md text-sm leading-6 text-slate-500">The requested path does not exist. Return to the camera workspace to continue.</p><a href="/" class="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"><i data-lucide="home" class="size-4"></i> Return to PlaneMeasure</a></section></main>`;
  refreshIcons();
}

export function renderException(root, error) {
  const message = escapeHtml(error?.message || 'The application could not finish loading.');
  root.innerHTML = `<main class="grid min-h-[100dvh] place-items-center bg-slate-50 p-6 text-slate-900"><section class="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm sm:p-10"><div class="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><i data-lucide="alert-circle" class="size-5"></i></div><p class="mono-number mt-10 text-sm font-semibold text-red-600">APPLICATION EXCEPTION</p><h1 class="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">PlaneMeasure needs to restart.</h1><p class="mt-4 text-sm leading-6 text-slate-500">${message}</p><div class="mt-8 flex flex-wrap gap-2"><button id="exceptionReloadButton" class="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"><i data-lucide="refresh-cw" class="size-4"></i> Reload application</button><a href="/" class="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><i data-lucide="home" class="size-4"></i> Home</a></div></section></main>`;
  refreshIcons();
  document.getElementById('exceptionReloadButton')?.addEventListener('click', () => window.location.reload());
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}
