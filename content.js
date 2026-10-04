const clicked = new WeakSet();
const labelOf = el => ((el.getAttribute('aria-label') || '') + ' ' + el.textContent).trim();
const isMore = el => /more/i.test(el.getAttribute('aria-label') || '');

function clickOnce(el) {
  if (!el || clicked.has(el)) return false;
  clicked.add(el);
  el.click();
  return true;
}

// Matching on textContent also hits every wrapping ancestor; keep only the innermost match.
function innermost(selector, re) {
  const hits = [...document.querySelectorAll(selector)].filter(el => re.test(labelOf(el)));
  return hits.find(el => !hits.some(o => o !== el && el.contains(o)));
}

// The "Merged audio" group: walk up from its header until the container also holds the "(You)" row.
function mergedGroup() {
  const header = document.evaluate("//*[normalize-space(text())='Merged audio']", document, null,
    XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  for (let el = header; el; el = el.parentElement) {
    if (el.textContent.includes('(You)')) return el;
  }
  return null;
}

// Walk up from the ⋮ until we reach the row containing "(You)",
// stopping if we hit a container holding other rows' ⋮ buttons too.
function isMyRow(btn) {
  for (let el = btn.parentElement; el; el = el.parentElement) {
    if ([...el.querySelectorAll('button')].filter(isMore).length > 1) return false;
    if (el.textContent.includes('(You)')) return true;
  }
  return false;
}

function run() {
  // Step 3: "Stop merging audio with nearby devices"
  if (clickOnce(innermost('[role="menuitem"], button, li', /stop merging audio/i))) return;

  // Step 2: my ⋮, only inside the "Merged audio" group
  const group = mergedGroup();
  const myMore = group && [...group.querySelectorAll('button')].find(b => isMore(b) && isMyRow(b));
  if (clickOnce(myMore)) return;

  // Step 1: the "Your audio is merged with nearby devices" pill
  clickOnce(innermost('button, [role="button"]', /audio is merged with nearby devices/i));
}

// ponytail: Meet mutates the DOM constantly, so check at most twice a second
let timer = null;
new MutationObserver(() => {
  if (!timer) timer = setTimeout(() => { timer = null; run(); }, 500);
}).observe(document.body, { childList: true, subtree: true });

run();
