const fetch = require('node-fetch');

async function test() {
  const url = process.argv[2] || 'http://localhost:3000/api/chat';
  const payload = {
    prompt: 'สวัสดีค่ะ ฉันอยากรู้จักตัวละคร',
    character: 'Momo',
    userName: 'Tester'
  };
  try {
    const r = await fetch(url, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
    const data = await r.json();
    console.log('status', r.status);
    console.log('body', data);
  } catch (e) {
    console.error('Request failed', e.message);
  }
}

test();
