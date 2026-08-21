import '../css/style.css';
import { renderException, renderNotFound } from './ui.js';

const root = document.querySelector('#app');
const path = window.location.pathname.replace(/\/+$/, '') || '/';

if (path !== '/') {
  renderNotFound(root);
} else {
  import('./app.js').catch((error) => renderException(root, error));
}
