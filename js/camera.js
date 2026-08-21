export class CameraController {
  constructor({ video, onState, onError }) {
    this.video = video;
    this.onState = onState;
    this.onError = onError;
    this.stream = null;
    this.devices = [];
    this.deviceIndex = 0;
    this.started = false;
    // 720p is ample for a 50 mm plane marker and keeps mobile previews responsive.
    this.resolution = { width: 1280, height: 720 };
  }

  async enumerate() {
    if (!navigator.mediaDevices?.enumerateDevices) return [];
    const devices = await navigator.mediaDevices.enumerateDevices();
    this.devices = devices.filter((device) => device.kind === 'videoinput');
    return this.devices;
  }

  async start(deviceId = null) {
    if (!navigator.mediaDevices?.getUserMedia) {
      const error = new Error('Camera access is not supported in this browser. Use a modern browser over HTTPS or localhost.');
      this.onError(error);
      throw error;
    }
    this.stop();
    try {
      const constraints = {
        audio: false,
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: this.resolution.width },
          height: { ideal: this.resolution.height },
          frameRate: { ideal: 30, max: 30 },
          facingMode: deviceId ? undefined : { ideal: 'environment' },
        },
      };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = this.stream;
      await this.video.play();
      await this.enumerate();
      const activeId = this.stream.getVideoTracks()[0]?.getSettings?.().deviceId;
      const activeIndex = this.devices.findIndex((device) => device.deviceId === activeId);
      if (activeIndex >= 0) this.deviceIndex = activeIndex;
      this.started = true;
      this.onState({ started: true, settings: this.stream.getVideoTracks()[0]?.getSettings?.() || {} });
      return this.stream;
    } catch (error) {
      this.started = false;
      this.onError(this.describeError(error));
      throw error;
    }
  }

  setResolution(width, height) {
    this.resolution = { width, height };
  }

  async switchCamera() {
    await this.enumerate();
    if (this.devices.length < 2) {
      this.onError(new Error('Only one camera is available on this device.'));
      return;
    }
    this.deviceIndex = (this.deviceIndex + 1) % this.devices.length;
    await this.start(this.devices[this.deviceIndex].deviceId);
  }

  stop() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.video.srcObject = null;
    this.started = false;
    this.onState({ started: false, settings: {} });
  }

  describeError(error) {
    const messages = {
      NotAllowedError: 'Camera permission was denied. Allow camera access in your browser settings, then try again.',
      NotFoundError: 'No camera was found. Connect a camera and try again.',
      NotReadableError: 'The camera is busy or unavailable. Close other camera apps and try again.',
      OverconstrainedError: 'The requested camera mode is unavailable. Try switching cameras.',
      SecurityError: 'Camera access requires HTTPS or localhost.',
    };
    return new Error(messages[error?.name] || error?.message || 'Could not start the camera.');
  }
}
