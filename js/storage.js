const HISTORY_KEY = 'planemeasure.history.v1';
const TEST_KEY = 'planemeasure.accuracy-tests.v1';

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}

export function saveHistory(items) { localStorage.setItem(HISTORY_KEY, JSON.stringify(items)); }
export function loadTests() { try { return JSON.parse(localStorage.getItem(TEST_KEY) || '[]'); } catch { return []; } }
export function saveTests(items) { localStorage.setItem(TEST_KEY, JSON.stringify(items)); }

export function downloadFile(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
