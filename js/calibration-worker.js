import openCvModule from '@techstark/opencv-js';
import { solveHomography } from './perspective.js';

let cv = null;
let queuedFrame = null;
let processing = false;

initialize();

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'frame') return;
  if (!cv) {
    queuedFrame = event.data;
    return;
  }
  processFrame(event.data);
});

async function initialize() {
  try {
    cv = openCvModule instanceof Promise ? await openCvModule : openCvModule;
    if (!cv?.Mat) {
      const deadline = Date.now() + 15000;
      while (!cv?.Mat && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 50));
    }
    if (!cv?.Mat) throw new Error('OpenCV did not initialize.');
    self.postMessage({ type: 'status', state: 'ready', message: 'Calibration ready' });
    if (queuedFrame) {
      const frame = queuedFrame;
      queuedFrame = null;
      processFrame(frame);
    }
  } catch (error) {
    self.postMessage({ type: 'status', state: 'error', message: 'Calibration unavailable', error: error?.message || String(error) });
  }
}

function processFrame(frame) {
  if (processing) {
    queuedFrame = frame;
    return;
  }
  processing = true;
  const { width, height, ratio, buffer } = frame;
  let src;
  let gray;
  let threshold;
  let contours;
  let hierarchy;
  try {
    src = new cv.Mat(height, width, cv.CV_8UC4);
    src.data.set(new Uint8ClampedArray(buffer));
    gray = new cv.Mat();
    threshold = new cv.Mat();
    contours = new cv.MatVector();
    hierarchy = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    cv.threshold(gray, threshold, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);
    cv.findContours(threshold, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
    const candidates = [];
    for (let index = 0; index < contours.size(); index += 1) {
      const contour = contours.get(index);
      const perimeter = cv.arcLength(contour, true);
      const approx = new cv.Mat();
      cv.approxPolyDP(contour, approx, perimeter * 0.035, true);
      const area = Math.abs(cv.contourArea(approx));
      if (approx.rows === 4 && area > width * height * 0.008 && area < width * height * 0.85) {
        const points = [];
        for (let point = 0; point < 4; point += 1) points.push([approx.intAt(point, 0), approx.intAt(point, 1)]);
        const ordered = orderCorners(points);
        const side = averageSide(ordered);
        const rectangularity = area / Math.max(side * side, 1);
        if (rectangularity > 0.42 && rectangularity < 1.35) candidates.push({ ordered, area, side });
      }
      approx.delete();
      contour.delete();
    }
    let candidate = null;
    let verification = null;
    for (const current of candidates.sort((a, b) => b.area - a.area).slice(0, 8)) {
      const result = verifyMarker(gray, current.ordered);
      if (result.valid) {
        candidate = current;
        verification = result;
        break;
      }
    }
    if (!candidate) {
      self.postMessage({ type: 'result', detected: false });
      return;
    }
    const corners = candidate.ordered.map(([x, y]) => [x / ratio, y / ratio]);
    const [tl, tr, br, bl] = corners;
    const widthPx = (Math.hypot(tr[0] - tl[0], tr[1] - tl[1]) + Math.hypot(br[0] - bl[0], br[1] - bl[1])) / 2;
    const heightPx = (Math.hypot(bl[0] - tl[0], bl[1] - tl[1]) + Math.hypot(br[0] - tr[0], br[1] - tr[1])) / 2;
    const sizeConfidence = Math.min(1, candidate.side / Math.max(90, width * 0.22));
    const marker = { corners, widthPx, heightPx, confidence: Math.min(1, verification.score * 0.75 + sizeConfidence * 0.25) };
    const homography = solveHomography(corners, [[0, 0], [50, 0], [50, 50], [0, 50]]);
    self.postMessage({ type: 'result', detected: true, marker, homography });
  } catch (error) {
    self.postMessage({ type: 'result', detected: false, error: error?.message || String(error) });
  } finally {
    [src, gray, threshold, contours, hierarchy].forEach((mat) => mat?.delete?.());
    processing = false;
    if (queuedFrame) {
      const next = queuedFrame;
      queuedFrame = null;
      setTimeout(() => processFrame(next), 0);
    }
  }
}

function verifyMarker(gray, corners) {
  const size = 160;
  const source = cv.matFromArray(4, 1, cv.CV_32FC2, corners.flat());
  const destination = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, size - 1, 0, size - 1, size - 1, 0, size - 1]);
  const matrix = cv.getPerspectiveTransform(source, destination);
  const warped = new cv.Mat();
  cv.warpPerspective(gray, warped, matrix, new cv.Size(size, size), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
  const expected = [[1, 0, 1, 0], [0, 1, 0, 1], [1, 1, 0, 0], [0, 0, 1, 1]];
  const sampleDark = (centerX, centerY, radius = 4) => {
    let dark = 0;
    let total = 0;
    for (let y = centerY - radius; y <= centerY + radius; y += 1) for (let x = centerX - radius; x <= centerX + radius; x += 1) { if (warped.ucharAt(y, x) < 128) dark += 1; total += 1; }
    return dark / total;
  };
  const centers = [42, 67, 93, 118];
  const grid = centers.map((y) => centers.map((x) => sampleDark(x, y) > 0.55 ? 1 : 0));
  const borderPoints = [[8, 8], [80, 8], [151, 8], [151, 80], [151, 151], [80, 151], [8, 151], [8, 80]];
  const borderScore = borderPoints.reduce((sum, [x, y]) => sum + sampleDark(x, y, 3), 0) / borderPoints.length;
  const marginPoints = [[23, 23], [80, 23], [137, 23], [137, 80], [137, 137], [80, 137], [23, 137], [23, 80]];
  const marginWhiteScore = marginPoints.reduce((sum, [x, y]) => sum + (1 - sampleDark(x, y, 3)), 0) / marginPoints.length;
  let bestMatch = 0;
  let rotated = grid;
  for (let rotation = 0; rotation < 4; rotation += 1) {
    let matched = 0;
    for (let row = 0; row < 4; row += 1) for (let column = 0; column < 4; column += 1) if (rotated[row][column] === expected[row][column]) matched += 1;
    bestMatch = Math.max(bestMatch, matched / 16);
    rotated = rotateGrid(rotated);
  }
  source.delete(); destination.delete(); matrix.delete(); warped.delete();
  const score = bestMatch * 0.65 + borderScore * 0.25 + marginWhiteScore * 0.1;
  return { valid: bestMatch >= 0.875 && borderScore >= 0.7 && marginWhiteScore >= 0.65, score };
}

function orderCorners(points) {
  const sums = points.map(([x, y]) => x + y);
  const diffs = points.map(([x, y]) => x - y);
  return [points[sums.indexOf(Math.min(...sums))], points[diffs.indexOf(Math.max(...diffs))], points[sums.indexOf(Math.max(...sums))], points[diffs.indexOf(Math.min(...diffs))]];
}

function averageSide(points) {
  return points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + Math.hypot(next[0] - point[0], next[1] - point[1]);
  }, 0) / points.length;
}

function rotateGrid(grid) {
  return grid[0].map((_, index) => grid.map((row) => row[index]).reverse());
}
