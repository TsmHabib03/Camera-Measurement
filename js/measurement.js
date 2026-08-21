import { projectPoint, distance, angle } from './perspective.js';

export class MeasurementController {
  constructor({ canvas, video, getCalibration, getDisplay, onUpdate }) {
    this.canvas = canvas;
    this.video = video;
    this.ctx = canvas.getContext('2d');
    this.getCalibration = getCalibration;
    this.getDisplay = getDisplay;
    this.onUpdate = onUpdate;
    this.mode = 'free';
    this.points = null;
    this.dragIndex = -1;
    this.pointerId = null;
    this.resizeFrame = null;
    this.measureFrame = null;
    this.bindPointerEvents();
  }

  setMode(mode) {
    this.mode = mode;
    this.onUpdate({ mode });
    this.draw();
  }

  clear() {
    this.points = null;
    this.onUpdate({ measurement: null });
    this.draw();
  }

  resize() {
    window.cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame = window.requestAnimationFrame(() => {
      this.resizeFrame = null;
      if (!this.video.videoWidth) return;
      const rect = this.canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const requestedWidth = Math.round(rect.width * pixelRatio);
      const requestedHeight = Math.round(rect.height * pixelRatio);
      const cap = Math.min(1, 1280 / requestedWidth, 900 / requestedHeight);
      const width = Math.max(1, Math.round(requestedWidth * cap));
      const height = Math.max(1, Math.round(requestedHeight * cap));
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
      this.draw();
    });
  }

  bindPointerEvents() {
    this.canvas.addEventListener('pointerdown', (event) => {
      if (!this.getCalibration()?.homography || !this.video.videoWidth) return;
      const point = this.pointerToVideo(event);
      const hit = this.points ? this.nearestHandle(point) : -1;
      this.dragIndex = hit >= 0 ? hit : 1;
      if (!this.points) this.points = [point, point];
      else if (hit < 0) this.points = [point, point];
      this.pointerId = event.pointerId;
      this.canvas.setPointerCapture(event.pointerId);
      this.canvas.classList.add('dragging');
      this.emitMeasurement();
    });
    this.canvas.addEventListener('pointermove', (event) => {
      if (event.pointerId !== this.pointerId || this.dragIndex < 0 || !this.points) return;
      const pointerEvent = event.getCoalescedEvents?.().at(-1) || event;
      this.points[this.dragIndex] = this.pointerToVideo(pointerEvent);
      if (!this.measureFrame) {
        this.measureFrame = window.requestAnimationFrame(() => {
          this.measureFrame = null;
          this.emitMeasurement();
        });
      }
    });
    const finish = (event) => {
      if (event.pointerId !== this.pointerId) return;
      this.dragIndex = -1;
      this.pointerId = null;
      this.canvas.classList.remove('dragging');
    };
    this.canvas.addEventListener('pointerup', finish);
    this.canvas.addEventListener('pointercancel', finish);
  }

  pointerToVideo(event) {
    const rect = this.canvas.getBoundingClientRect();
    return [(event.clientX - rect.left) * (this.video.videoWidth / rect.width), (event.clientY - rect.top) * (this.video.videoHeight / rect.height)];
  }

  nearestHandle(point) {
    const radius = Math.max(this.video.videoWidth, this.video.videoHeight) * 0.035;
    const distances = this.points.map((p) => Math.hypot(p[0] - point[0], p[1] - point[1]));
    const index = distances.indexOf(Math.min(...distances));
    return distances[index] <= radius ? index : -1;
  }

  emitMeasurement() {
    const calibration = this.getCalibration();
    if (!this.points || !calibration?.homography) return;
    const projected = this.points.map((point) => projectPoint(calibration.homography, point));
    const mm = distance(projected[0], projected[1]);
    this.onUpdate({ measurement: { pixels: this.points.map((point) => [...point]), planePoints: projected, mm, angle: angle(projected[0], projected[1]), mode: this.mode } });
    this.draw();
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!this.video.videoWidth || !this.video.videoHeight) return;
    const scaleX = canvas.width / this.video.videoWidth;
    const scaleY = canvas.height / this.video.videoHeight;
    const toCanvas = ([x, y]) => [x * scaleX, y * scaleY];
    const calibration = this.getCalibration();
    if (calibration?.marker?.corners) {
      const points = calibration.marker.corners.map(toCanvas);
      ctx.save();
      ctx.strokeStyle = calibration.homography ? '#67e8f9' : '#fbbf24';
      ctx.lineWidth = Math.max(2, canvas.width / 500);
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
    if (!this.points) return;
    const [a, b] = this.points.map(toCanvas);
    const lineWidth = Math.max(3, canvas.width / 360);
    ctx.save();
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = 'rgba(0,0,0,.7)';
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#22d3ee';
    [a, b].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, Math.max(9, canvas.width / 90), 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#082f49'; ctx.lineWidth = 3; ctx.stroke(); });
    const calibrationReady = Boolean(calibration?.homography);
    if (calibrationReady) {
      const projected = this.points.map((point) => projectPoint(calibration.homography, point));
      const mm = distance(projected[0], projected[1]);
      const display = this.getDisplay(mm);
      const label = `${display.value} ${display.unit}`;
      const midX = (a[0] + b[0]) / 2;
      const midY = (a[1] + b[1]) / 2;
      ctx.font = `600 ${Math.max(14, canvas.width / 55)}px "Cascadia Mono", monospace`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(9,9,11,.86)';
      ctx.fillRect(midX - textWidth / 2 - 10, midY - 30, textWidth + 20, 30);
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, midX, midY - 15);
    }
    ctx.restore();
  }
}
