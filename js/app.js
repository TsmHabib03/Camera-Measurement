import { renderApp, refreshIcons } from './ui.js';
import { CameraController } from './camera.js';
import { MarkerCalibrator } from './calibration.js';
import { MeasurementController } from './measurement.js';
import { loadHistory, saveHistory, loadTests, saveTests, downloadFile } from './storage.js';

const root = document.querySelector('#app');
renderApp(root);

const $ = (id) => document.getElementById(id);
const video = $('cameraVideo');
const overlay = $('overlayCanvas');
const processingCanvas = $('processingCanvas');
const state = {
  unit: 'cm', precision: 3, mode: 'free', calibration: { detected: false, homography: null, marker: null, quality: 0 }, measurement: null, history: loadHistory(), tests: loadTests(), debug: false, cvReady: false,
};

const camera = new CameraController({ video, onState: handleCameraState, onError: showError });
const calibrator = new MarkerCalibrator({ processingCanvas, onUpdate: handleCalibrationUpdate, onStatus: handleVisionStatus });
const measurement = new MeasurementController({ canvas: overlay, video, getCalibration: () => state.calibration, getDisplay: (mm) => ({ value: convertMm(mm, state.unit).toFixed(state.precision), unit: state.unit }), onUpdate: handleMeasurementUpdate });

bindEvents();
renderHistory();
renderTests();

function bindEvents() {
  $('startCameraButton').addEventListener('click', () => camera.started ? camera.stop() : startCamera());
  $('emptyStartButton').addEventListener('click', startCamera);
  $('switchCameraButton').addEventListener('click', () => camera.switchCamera().catch(() => {}));
  $('clearMeasurementButton').addEventListener('click', () => measurement.clear());
  $('saveMeasurementButton').addEventListener('click', saveCurrentMeasurement);
  $('clearHistoryButton').addEventListener('click', () => { state.history = []; saveHistory(state.history); renderHistory(); });
  $('unitSelect').addEventListener('change', (event) => { state.unit = event.target.value; renderMeasurement(); renderHistory(); });
  $('precisionSelect').addEventListener('change', (event) => { state.precision = Number(event.target.value); renderMeasurement(); renderHistory(); });
  const changeResolution = async (event) => {
    const [width, height] = event.target.value.split('x').map(Number);
    camera.setResolution(width, height);
    if (camera.started) await camera.start(camera.devices[camera.deviceIndex]?.deviceId || null).catch(() => {});
  };
  $('resolutionSelect').addEventListener('change', changeResolution);
  $('mobileResolutionProxy').addEventListener('change', (event) => {
    $('resolutionSelect').value = event.target.value;
    changeResolution(event);
  });
  document.querySelectorAll('.mode-button').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  document.querySelectorAll('.mobile-panel-button').forEach((button) => button.addEventListener('click', () => setMobilePanel(button.dataset.mobileTarget)));
  document.querySelectorAll('.export-button').forEach((button) => button.addEventListener('click', () => exportHistory(button.dataset.export)));
  $('addAccuracyTestButton').addEventListener('click', addAccuracyTest);
  $('debugButton').addEventListener('click', () => { state.debug = true; $('debugPanel').classList.remove('hidden'); renderDebug(); });
  $('closeDebugButton').addEventListener('click', () => { state.debug = false; $('debugPanel').classList.add('hidden'); });
  $('helpButton').addEventListener('click', () => $('helpDialog').showModal());
  $('closeHelpButton').addEventListener('click', () => $('helpDialog').close());
  video.addEventListener('loadedmetadata', () => {
    updateCameraStageRatio();
    $('cameraStage').classList.add('is-ready');
    measurement.resize();
    calibrator.start(video);
  });
  window.addEventListener('resize', () => { updateCameraStageRatio(); measurement.resize(); });
  window.addEventListener('pagehide', () => calibrator.destroy(), { once: true });
}

function updateCameraStageRatio() {
  if (!video.videoWidth || !video.videoHeight) return;
  const mobileViewport = window.matchMedia('(max-width: 767px)').matches;
  const compactViewport = window.matchMedia('(max-width: 767px) and (max-height: 700px)').matches;
  $('cameraStage').style.aspectRatio = compactViewport ? '16 / 9' : mobileViewport ? '4 / 3' : `${video.videoWidth} / ${video.videoHeight}`;
}

function setMobilePanel(target) {
  document.querySelectorAll('.mobile-panel-button').forEach((button) => button.classList.toggle('mobile-panel-button-active', button.dataset.mobileTarget === target));
  document.querySelectorAll('[data-mobile-panel]').forEach((panel) => panel.classList.toggle('mobile-panel-active', panel.dataset.mobilePanel === target));
}

async function startCamera() {
  hideError();
  try {
    await camera.start();
  } catch { return; }
}

function handleVisionStatus({ state: visionState, message, error }) {
  state.cvReady = visionState === 'ready';
  $('opencvStatus').textContent = message;
  if (visionState === 'loading') {
    $('opencvStatus').className = 'text-xs font-medium text-blue-600';
    $('visionStatusIndicator').className = 'vision-spinner size-2.5 rounded-full border-2 border-blue-200 border-t-blue-600';
  } else {
    const ready = visionState === 'ready';
    $('opencvStatus').className = `text-xs font-medium ${ready ? 'text-emerald-600' : 'text-amber-600'}`;
    $('visionStatusIndicator').className = `size-2.5 rounded-full ${ready ? 'bg-emerald-500' : 'bg-amber-500'}`;
    if (!ready && error) showError(new Error('The calibration engine could not load. Reload the page and try again.'));
  }
  renderDebug();
}

function handleCameraState({ started, settings }) {
  $('cameraEmpty').classList.toggle('hidden', started);
  $('cameraEmpty').classList.toggle('flex', !started);
  $('startCameraButton').innerHTML = started ? '<i data-lucide="square" class="size-4"></i><span>Stop</span>' : '<i data-lucide="camera" class="size-4"></i><span>Start</span>';
  $('startCameraButton').classList.toggle('border-red-200', started);
  $('startCameraButton').classList.toggle('bg-red-50', started);
  $('startCameraButton').classList.toggle('text-red-600', started);
  window.__planeMeasureCameraSettings = settings;
  refreshIcons();
  if (!started) { calibrator.stop(); state.calibration = { detected: false, homography: null, marker: null, quality: 0 }; measurement.clear(); handleCalibrationUpdate({ detected: false }); }
  renderDebug();
}

function handleCalibrationUpdate(update) {
  if (!update.detected) {
    state.calibration = { detected: false, homography: null, marker: null, quality: 0 };
    $('calibrationBadgeText').textContent = 'Calibration required';
    $('calibrationBadge').className = 'flex min-h-9 items-center gap-2 rounded-xl border border-amber-300/30 bg-slate-950/85 px-3 text-xs font-medium text-amber-100 backdrop-blur-xl';
    $('calibrationDot').className = 'size-2 rounded-full bg-amber-300 status-pulse';
    $('calibrationState').textContent = 'Required'; $('calibrationState').className = 'rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700';
    $('markerDetectedValue').textContent = 'No'; $('markerDetectedValue').className = 'text-slate-500';
    $('scaleValue').textContent = 'No'; $('scaleValue').className = 'mono-number text-slate-500';
    $('perspectiveValue').textContent = 'Inactive'; $('perspectiveValue').className = 'text-slate-500';
    $('qualityValue').textContent = '--'; $('qualityValue').className = 'text-slate-500';
    $('calibrationMessage').textContent = 'Place the supplied marker flat beside the object and keep all four corners visible.';
    $('calibrationMessage').className = 'mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800';
  } else {
    state.calibration = { ...update, quality: Math.round((update.marker.confidence || 0) * 100) };
    const quality = state.calibration.quality;
    $('calibrationBadgeText').textContent = quality < 45 ? 'Low calibration quality' : 'Calibrated';
    $('calibrationBadge').className = `flex min-h-9 items-center gap-2 rounded-xl border ${quality < 45 ? 'border-amber-300/30 text-amber-100' : 'border-emerald-300/30 text-emerald-100'} bg-slate-950/85 px-3 text-xs font-medium backdrop-blur-xl`;
    $('calibrationDot').className = `size-2 rounded-full ${quality < 45 ? 'bg-amber-300' : 'bg-emerald-300'}`;
    $('calibrationState').textContent = quality < 45 ? 'Low quality' : 'Valid'; $('calibrationState').className = `rounded-lg px-2.5 py-1.5 text-xs font-semibold ${quality < 45 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`;
    $('markerDetectedValue').textContent = 'Yes'; $('markerDetectedValue').className = 'text-emerald-600';
    $('scaleValue').textContent = `${(update.marker.widthPx / 50).toFixed(2)} px/mm`; $('scaleValue').className = 'mono-number text-emerald-600';
    $('perspectiveValue').textContent = 'Active'; $('perspectiveValue').className = 'text-emerald-600';
    $('qualityValue').textContent = `${quality}%`; $('qualityValue').className = quality < 45 ? 'text-amber-600' : 'text-emerald-600';
    $('calibrationMessage').textContent = quality < 45 ? 'Calibration quality is low. Move closer, improve lighting, and keep the marker on the same plane.' : 'Scale is established from the marker. Measurements are valid only on its plane.';
    $('calibrationMessage').className = `mt-4 rounded-xl border p-3 text-xs leading-5 ${quality < 45 ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`;
  }
  measurement.draw(); renderDebug();
}

function handleMeasurementUpdate(update) {
  if (update.mode) { state.mode = update.mode; $('modeBadge').textContent = `${capitalize(update.mode)} mode`; $('currentModeLabel').textContent = capitalize(update.mode); $('mobileModeLabel').textContent = capitalize(update.mode); }
  if ('measurement' in update) state.measurement = update.measurement;
  renderMeasurement(); renderDebug();
}

function setMode(mode) {
  state.mode = mode; measurement.setMode(mode);
  document.querySelectorAll('.mode-button').forEach((button) => { const active = button.dataset.mode === mode; button.className = `mode-button ${active ? 'mode-button-active' : ''}`; });
}

function renderMeasurement() {
  const current = state.measurement;
  const saveButton = $('saveMeasurementButton'); const testButton = $('addAccuracyTestButton');
  saveButton.disabled = !current || !state.calibration.homography;
  testButton.disabled = !current || !state.calibration.homography;
  if (!current || !state.calibration.homography) { const emptyValue = `--.--- ${state.unit}`; $('measurementValue').textContent = emptyValue; $('mobileMeasurementValue').textContent = emptyValue; $('measurementValue').className = 'mono-number break-all text-4xl font-semibold leading-none text-slate-300'; $('measurementDetails').classList.add('hidden'); $('measurementHint').textContent = state.calibration.homography ? 'Drag across the camera view to measure.' : 'Calibrate, then drag across the camera view.'; return; }
  const converted = convertMm(current.mm, state.unit); const formatted = converted.toFixed(state.precision);
  const displayValue = `${formatted} ${state.unit}`; $('measurementValue').textContent = displayValue; $('mobileMeasurementValue').textContent = displayValue; $('measurementValue').className = 'mono-number break-all text-4xl font-semibold leading-none text-blue-600'; $('measurementDetails').classList.remove('hidden'); $('measurementDetails').classList.add('grid'); $('angleValue').textContent = `${current.angle.toFixed(2)} deg`; $('mmValue').textContent = `${current.mm.toFixed(3)} mm`; $('measurementHint').textContent = `${capitalize(state.mode)} measurement on the calibrated plane.`;
}

function saveCurrentMeasurement() {
  if (!state.measurement) return;
  const item = { id: crypto.randomUUID?.() || String(Date.now()), label: capitalize(state.mode), valueMm: state.measurement.mm, angle: state.measurement.angle, createdAt: new Date().toISOString() };
  state.history = [item, ...state.history].slice(0, 50); saveHistory(state.history); renderHistory();
}

function renderHistory() {
  const list = $('historyList');
  if (!state.history.length) { list.innerHTML = '<div class="rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center"><p class="text-sm font-medium text-slate-500">No saved measurements</p><p class="mt-1 text-xs text-slate-400">Your saved readings appear here.</p></div>'; return; }
  list.innerHTML = state.history.map((item, index) => `<div class="rounded-xl border border-slate-200 bg-white p-3"><div class="flex items-center justify-between gap-3"><div class="min-w-0"><p class="truncate text-sm font-semibold text-slate-800">#${state.history.length - index} ${escapeHtml(item.label)}</p><p class="mt-1 text-xs text-slate-400">${new Date(item.createdAt).toLocaleString()}</p></div><span class="mono-number shrink-0 text-sm font-semibold text-blue-600">${convertMm(item.valueMm, state.unit).toFixed(state.precision)} ${state.unit}</span></div><div class="mt-2 flex justify-end gap-1"><button data-rename-id="${item.id}" class="rename-button h-7 rounded-lg px-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800">Rename</button><button data-copy-id="${item.id}" class="copy-button flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600" title="Copy measurement" aria-label="Copy measurement"><i data-lucide="copy" class="size-3.5"></i></button><button data-delete-id="${item.id}" class="delete-button flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600" title="Delete measurement" aria-label="Delete measurement"><i data-lucide="trash-2" class="size-3.5"></i></button></div></div>`).join('');
  list.querySelectorAll('.rename-button').forEach((button) => button.addEventListener('click', () => { const item = state.history.find((entry) => entry.id === button.dataset.renameId); const label = window.prompt('Measurement name', item.label); if (label?.trim()) { item.label = label.trim().slice(0, 80); saveHistory(state.history); renderHistory(); } }));
  list.querySelectorAll('.copy-button').forEach((button) => button.addEventListener('click', () => { const item = state.history.find((entry) => entry.id === button.dataset.copyId); navigator.clipboard?.writeText(`${convertMm(item.valueMm, state.unit).toFixed(state.precision)} ${state.unit}`); }));
  list.querySelectorAll('.delete-button').forEach((button) => button.addEventListener('click', () => { state.history = state.history.filter((entry) => entry.id !== button.dataset.deleteId); saveHistory(state.history); renderHistory(); }));
  refreshIcons();
}

function addAccuracyTest() {
  const expected = Number($('expectedValue').value); if (!expected || !state.measurement) return;
  const expectedMm = convertToMm(expected, $('expectedUnit').value); const measuredMm = state.measurement.mm; const errorMm = Math.abs(measuredMm - expectedMm);
  state.tests = [{ id: Date.now(), expectedMm, measuredMm, errorMm, errorPercent: errorMm / expectedMm * 100, createdAt: new Date().toISOString() }, ...state.tests].slice(0, 30); saveTests(state.tests); renderTests();
}

function renderTests() { $('accuracyResults').innerHTML = state.tests.length ? state.tests.map((test) => `<div class="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"><div class="grid grid-cols-2 gap-y-1.5"><span class="text-slate-500">Expected</span><span class="mono-number text-right font-medium text-slate-800">${test.expectedMm.toFixed(3)} mm</span><span class="text-slate-500">Measured</span><span class="mono-number text-right font-medium text-slate-800">${test.measuredMm.toFixed(3)} mm</span><span class="text-slate-500">Absolute error</span><span class="mono-number text-right font-medium text-amber-700">${test.errorMm.toFixed(3)} mm</span><span class="text-slate-500">Error</span><span class="mono-number text-right font-medium text-amber-700">${test.errorPercent.toFixed(2)}%</span></div></div>`).join('') : ''; }

function exportHistory(format) {
  if (!state.history.length) return;
  let content = ''; let type = 'text/plain';
  if (format === 'json') { content = JSON.stringify(state.history, null, 2); type = 'application/json'; }
  else if (format === 'csv') { content = ['Measurement,Value,Unit,Angle,Created', ...state.history.map((item) => `${item.label},${convertMm(item.valueMm, state.unit).toFixed(state.precision)},${state.unit},${item.angle.toFixed(2)},${item.createdAt}`)].join('\n'); type = 'text/csv'; }
  else content = state.history.map((item) => `${item.label}: ${convertMm(item.valueMm, state.unit).toFixed(state.precision)} ${state.unit} (angle ${item.angle.toFixed(2)} deg)`).join('\n');
  downloadFile(`planemeasure-${format}.${format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'txt'}`, content, type);
}

function renderDebug() {
  if (!state.debug) return;
  const settings = window.__planeMeasureCameraSettings || {};
  $('debugValues').innerHTML = `<div><span class="text-slate-400">Camera resolution</span><br>${settings.width || '--'} x ${settings.height || '--'}</div><div><span class="text-slate-400">Marker detected</span><br>${state.calibration.detected ? 'YES' : 'NO'}</div><div><span class="text-slate-400">Marker size</span><br>50.00 mm</div><div><span class="text-slate-400">Pixel width</span><br>${state.calibration.marker?.widthPx?.toFixed(2) || '--'} px</div><div><span class="text-slate-400">Pixel height</span><br>${state.calibration.marker?.heightPx?.toFixed(2) || '--'} px</div><div><span class="text-slate-400">Calibration</span><br>${state.calibration.homography ? 'VALID' : 'REQUIRED'}</div><div><span class="text-slate-400">Perspective</span><br>${state.calibration.homography ? 'VALID' : 'INACTIVE'}</div><div><span class="text-slate-400">Measurement</span><br>${state.measurement ? `${(state.measurement.mm / 10).toFixed(3)} cm` : '--'}</div>`;
}

function convertMm(mm, unit) { return unit === 'mm' ? mm : unit === 'm' ? mm / 1000 : mm / 10; }
function convertToMm(value, unit) { return unit === 'mm' ? value : unit === 'm' ? value * 1000 : value * 10; }
function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
function showError(error) { const message = error?.message || String(error); $('cameraErrorText').textContent = message; $('cameraError').classList.remove('hidden'); $('cameraError').classList.add('flex'); }
function hideError() { $('cameraError').classList.add('hidden'); $('cameraError').classList.remove('flex'); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character])); }
