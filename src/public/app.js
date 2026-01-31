const endpointInput = document.getElementById('endpoint');
const sendBtn = document.getElementById('send');
const responseEl = document.getElementById('response');

sendBtn.addEventListener('click', async () => {
  const endpoint = endpointInput.value.trim();
  if (!endpoint) return;

  // Clear previous
  responseEl.style.display = 'none';
  responseEl.textContent = '';

  try {
    const res = await fetch(window.location.origin + endpoint);
    const ct = res.headers.get('content-type') || '';

    if (ct.includes('application/json')) {
      const data = await res.json();
      // show only if there's a JSON body (not empty)
      if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
        responseEl.style.display = 'block';
        responseEl.textContent = JSON.stringify(data, null, 2);
      } else {
        responseEl.style.display = 'none';
      }
    } else {
      // not JSON: hide response area
      responseEl.style.display = 'none';
    }
  } catch (err) {
    responseEl.style.display = 'block';
    responseEl.textContent = 'Error: ' + err.message;
  }
});
