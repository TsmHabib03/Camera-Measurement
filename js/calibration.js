export class MarkerCalibrator {
  constructor({ processingCanvas, onUpdate, onStatus }) {
    this.canvas = processingCanvas;
    this.ctx = processingCanvas.getContext('2d', { willReadFrequently: true, desynchronized: true });
    this.onUpdate = onUpdate;
    this.onStatus = onStatus;
    this.worker = null;
    this.video = null;
    this.running = false;
    this.busy = false;
    this.timer = null;
    this.lastDetected = null;
  }

  start(video) {
    this.video = video;
    this.running = true;
    this.ensureWorker();
    this.schedule(180);
  }

  stop() {
    this.running = false;
    this.busy = false;
    window.clearTimeout(this.timer);
    this.timer = null;
  }

  destroy() {
    this.stop();
    this.worker?.terminate();
    this.worker = null;
  }

  ensureWorker() {
    if (this.worker) return;
    this.onStatus?.({ state: 'loading', message: 'Loading calibration' });
    this.worker = new Worker(new URL('./calibration-worker.js', import.meta.url), { type: 'module' });
    this.worker.addEventListener('message', (event) => this.handleWorkerMessage(event.data));
    this.worker.addEventListener('error', () => {
      this.busy = false;
      this.onStatus?.({ state: 'error', message: 'Calibration unavailable' });
      this.onUpdate({ detected: false, error: new Error('The calibration worker could not start.') });
    });
  }

  handleWorkerMessage(message) {
    if (message.type === 'status') {
      this.onStatus?.(message);
      if (message.state === 'ready') this.schedule(0);
      return;
    }
    if (message.type !== 'result') return;
    this.busy = false;
    if (!this.running) return;
    if (message.detected) {
      this.lastDetected = true;
      this.onUpdate(message);
    } else if (this.lastDetected !== false || message.error) {
      this.lastDetected = false;
      this.onUpdate(message.error ? { detected: false, error: new Error(message.error) } : { detected: false });
    }
    // Detection is intentionally periodic: video remains the priority while the
    // worker checks whether the reference marker has entered the frame.
    this.schedule(message.detected ? 1300 : 1500);
  }

  schedule(delay = 700) {
    window.clearTimeout(this.timer);
    if (!this.running) return;
    this.timer = window.setTimeout(() => this.capture(), delay);
  }

  capture() {
    const video = this.video;
    if (!this.running || this.busy || !video || video.readyState < 2 || !video.videoWidth) {
      this.schedule(250);
      return;
    }
    const maxWidth = window.matchMedia('(max-width: 767px)').matches ? 400 : 480;
    const ratio = Math.min(1, maxWidth / video.videoWidth);
    const width = Math.max(1, Math.round(video.videoWidth * ratio));
    const height = Math.max(1, Math.round(video.videoHeight * ratio));
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(video, 0, 0, width, height);
    const image = this.ctx.getImageData(0, 0, width, height);
    this.busy = true;
    this.worker.postMessage({ type: 'frame', width, height, ratio, buffer: image.data.buffer }, [image.data.buffer]);
  }
}
