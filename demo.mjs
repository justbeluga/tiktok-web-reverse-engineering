import signBogus  from '../encryption/xbogus.mjs';
import signGnarly from '../encryption/xgnarly.mjs';

const config = {
   browser: {
    language:  'en-US',
    name:      'Mozilla',
    online:    true,
    platform:  'Win32',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    version:   '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
  }
}


export async function signParams(data) {

  const queryString = new URLSearchParams({
    ...data.params
  }).toString();

  let body = '';

  if (data.body) {
    body = JSON.stringify(data.body);
  }

  const xBogus = signBogus(
    queryString,
    body,
    config.browser.userAgent,
    Math.floor(Date.now() / 1000)
  );

  const xGnarly = signGnarly(
    queryString,                         // query string
    body,                                // POST body
    config.browser.userAgent,            // user-agent
    0,                                   // envcode
    '5.1.1'                              // version
  );

  return `${data.url}/?${queryString}&X-Bogus=${xBogus}&X-Gnarly=${xGnarly}`;
}

const params = {
  foo: 123
}

const signedUrl = await signParams({
  // body: '' (send only if is used in the request)
  params,
  url: 'https://webcast.tiktok.com/webcast/recharge/packages'
})

console.log('[+] Signed Url', signedUrl)
