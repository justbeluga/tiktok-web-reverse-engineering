import Signer from './signer.mjs';
import axios from 'axios';

const config = {
   browser: {
    language:  'en-US',
    name:      'Mozilla',
    online:    true,
    platform:  'Win32',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
    version:   '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
  }
}

const signer = new Signer(null, null);

await signer.init(); // Signer laoded

export async function signParams({ url, params, body = '' }) {
  const navigator = await signer.navigator();
  const { userAgent } = navigator;

  const queryString = new URLSearchParams({ ...params }).toString();

  const unsignedUrl = `${url}/?${queryString}`;

  if (body !== '') {
    body = JSON.stringify(body);
  }

  const { signedUrl, xBogus, xGnarly } = await signer.Sign({ url: unsignedUrl, body });

  return { signedUrl, xBogus, xGnarly, userAgent };
}


const cookie = '';

// const msToken = await fetchMsToken({ cookie });
const match = cookie.match(/msToken=([^;]+)/);
const msToken = match ? match[1] : null;

console.log({ cookie, msToken });

const params = {
  "WebIdLastTime": "1742491620",
  "aid": "1988",
  "app_language": "en",
  "app_name": "tiktok_web",
  "aweme_id": "7485820197425663238",
  "browser_language": config.browser.language,
  "browser_name": config.browser.name,
  "browser_online": config.browser.online.toString(),
  "browser_platform": config.browser.platform,
  "browser_version": config.browser.version,
  "channel": "tiktok_web",
  "cookie_enabled": "true",
  "data_collection_enabled": "true",
  "device_id": "7483944496233973254",
  "device_platform": "web_pc",
  "focus_state": "true",
  "from_page": "video",
  "history_len": "3",
  "is_fullscreen": "false",
  "is_page_visible": "true",
  "msToken": "",
  "odinId": "7507419673009456000",
  "os": "windows",
  "priority_region": "AR",
  "referrer": "",
  "region": "AR",
  "screen_height": "1080",
  "screen_width": "1920",
  "text": "cool vid",
  "text_extra": "[]",
  "tz_name": "America/Buenos_Aires",
  "user_is_login": "true",
  "verifyFp": "verify_mchjkjj3_fcePkPC3_oGxi_4nF1_AwMB_7u0860Fi4Lsr",
  "webcast_language": "en"
};

  
const { signedUrl, xBogus, xGnarly, userAgent } = await signParams({
  params,
  url: 'https://www.tiktok.com/test'
});

console.log({ signedUrl, xBogus, xGnarly, userAgent })

/* try {
  const response = await axios.post(
    signature.signedUrl,
    '',
    {
      headers: {
        'content-type': 'apapplication/x-www-form-urlencoded',
        cookie,
        'user-agent': userAgent
      },
      withCredentials: false
    }
  );
  console.log('Response', response.data);
} catch (error) {
  // console.log({ error: error?.response?.data, message: error });
  console.log('[ERROR]', error);
} */