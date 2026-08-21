export function solveHomography(source, target) {
  const a = [];
  const b = [];
  source.forEach(([x, y], i) => {
    const [u, v] = target[i];
    a.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    a.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  });
  for (let i = 0; i < 8; i += 1) {
    let pivot = i;
    for (let j = i + 1; j < 8; j += 1) if (Math.abs(a[j][i]) > Math.abs(a[pivot][i])) pivot = j;
    [a[i], a[pivot]] = [a[pivot], a[i]];
    [b[i], b[pivot]] = [b[pivot], b[i]];
    const divisor = a[i][i] || 1e-12;
    for (let k = i; k < 8; k += 1) a[i][k] /= divisor;
    b[i] /= divisor;
    for (let j = 0; j < 8; j += 1) {
      if (j === i) continue;
      const factor = a[j][i];
      for (let k = i; k < 8; k += 1) a[j][k] -= factor * a[i][k];
      b[j] -= factor * b[i];
    }
  }
  return [...b, 1];
}

export function projectPoint(h, [x, y]) {
  const denominator = h[6] * x + h[7] * y + 1;
  return [(h[0] * x + h[1] * y + h[2]) / denominator, (h[3] * x + h[4] * y + h[5]) / denominator];
}

export function distance(a, b) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export function angle(a, b) {
  return Math.atan2(b[1] - a[1], b[0] - a[0]) * (180 / Math.PI);
}
