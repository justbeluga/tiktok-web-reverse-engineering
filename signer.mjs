/* eslint-disable */
import { createCipheriv } from 'crypto';
import { devices, chromium } from 'playwright-chromium';
const iPhone11 = devices['iPhone 11 Pro'];

import path from 'path';
import { fileURLToPath } from 'url';

function getRandomInt(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const diff = max - min + 1;
  return min + Math.floor(Math.random() * Math.floor(diff));
}

class Signer {
  userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
  args = [
    '--disable-blink-features',
    '--disable-blink-features=AutomationControlled',
    '--disable-infobars',
    '--window-size=1920,1080',
    '--start-maximized',
  ];
  // Default TikTok loading page
  default_url = 'https://www.tiktok.com/@1/video/1';

  // Password for xttparams AES encryption
  password = 'webapp1.0+202106';

  constructor(default_url, userAgent, browser) {
    if (default_url) {
      this.default_url = default_url;
    }
    if (userAgent) {
      this.userAgent = userAgent;
    }

    if (browser) {
      this.browser = browser;
      this.isExternalBrowser = true;
    }

    this.args.push(`--user-agent='${this.userAgent}'`);

    this.options = {
      headless: true,
      args: this.args,
      ignoreDefaultArgs: ['--mute-audio', '--hide-scrollbars'],
      ignoreHTTPSErrors: true,
    };
  }

  async init() {
    // Get the directory name of the current module
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    if (!this.browser) {
      this.browser = await chromium.launch(this.options);
    }

    let emulateTemplate = {
      ...iPhone11,
      locale: 'en-US',
      deviceScaleFactor: getRandomInt(1, 3),
      isMobile: Math.random() > 0.5,
      hasTouch: Math.random() > 0.5,
      userAgent: this.userAgent,
    };
    emulateTemplate.viewport.width = getRandomInt(320, 1920);
    emulateTemplate.viewport.height = getRandomInt(320, 1920);

    this.context = await this.browser.newContext({
      bypassCSP: true,
      ...emulateTemplate,
    });

    this.page = await this.context.newPage();

    await this.page.route('**/*', (route) => {
      return route.request().resourceType() === 'script'
        ? route.abort()
        : route.continue();
    });

    await this.page.goto(this.default_url, {
      waitUntil: 'networkidle',
    });

    let LOAD_SCRIPTS = ['webmssdk_5.1.2.js',];

    LOAD_SCRIPTS.forEach(async (script) => {
      await this.page.addScriptTag({
        path: path.resolve(__dirname, 'javascript', script),
      });
      console.log('[+] ' + script + ' loaded');
    });

     await this.page.evaluate(() => {
      /* window.generateSignature = function generateSignature(url) {
        if (typeof window.byted_acrawler.sign !== 'function') {
          throw 'No signature function found';
        }
        return window.byted_acrawler.sign({ url });
      };

      window.generateBogus = function generateBogus(params) {
        if (typeof window.generateBogus !== 'function') {
          throw 'No X-Bogus function found';
        }
        return window.generateBogus(params);
      }; */

      window.generateXBogus = function generateXBogus(query, undf) {
        if (typeof window.__tsign.u[911].v !== 'function') {
          throw 'No X-Bogus function found';
        }

        return window.__tsign.u[911].v(query, undf);
      };

      window.generateXGnarly = function generateXGnarly(query, strBody) {
        if (typeof window.__tsign.u[912].v !== 'function') {
          throw 'No X-Gnarly function found';
        }

        return window.__tsign.u[912].v(query, strBody);
      };

      return this;
    });
  }

  async navigator() {
    // Get the 'viewport' of the page, as reported by the page.
    const info = await this.page.evaluate(() => {
      return {
        deviceScaleFactor: window.devicePixelRatio,
        userAgent: window.navigator.userAgent,
        browser_language: window.navigator.language,
        browser_platform: window.navigator.platform,
        browser_name: window.navigator.appCodeName,
        browser_version: window.navigator.appVersion,
      };
    });
    return info;
  }

  async Sign({ url, body = '' }) {
    // console.log('Sign', { e: url, t: body });

    const params = new URL(url).search.slice(1); // removes the "?" from the start

    const xGnarly = await this.page.evaluate(`generateXGnarly('${params}', ${body})`);

    const xBogus = await this.page.evaluate(`generateXBogus('${params}', ${null})`);

    return { signedUrl:`${url}&X-Gnarly=${xGnarly}&X-Bogus=${xBogus}`, xBogus, xGnarly }
  }

  async signDepercated(link) {

    // await this.page.evaluate('setMsToken("xdFakeOne")'); // Fake set msToken function
    // generate valid verifyFp
    // let verify_fp = Utils.generateVerifyFp();
    // let newUrl = link + '&verifyFp=' + verify_fp;

    let signature = await this.page.evaluate(`generateSignature('${link}')`);
    let signedUrl = link + '&_signature=' + signature;

    let queryString = new URL(signedUrl).searchParams.toString();

    // let bogus2 = xbogus(queryString, this.userAgent)

    let bogus = await this.page.evaluate(`generateBogus('${queryString}','${this.userAgent}')`);
    let msToken = ''; // await this.page.evaluate('retrieveMsToken()');
    signedUrl += '&X-Bogus=' + bogus;

    // console.log({ bogus, bogus2 })

    return {
      msToken,
      bogus,
      signature,
      // verify_fp,
      signedUrl,
      'x-tt-params': this.xttparams(queryString),
      'x-bogus': bogus,
    };
  }

  xttparams(query_str) {
    query_str += '&is_encryption=1';

    // Encrypt query string using aes-128-cbc
    const cipher = createCipheriv('aes-128-cbc', this.password, this.password);
    return Buffer.concat([cipher.update(query_str), cipher.final()]).toString(
      'base64'
    );
  }

  async close() {
    if (this.browser && !this.isExternalBrowser) {
      await this.browser.close();
      this.browser = null;
    }
    if (this.page) {
      this.page = null;
    }
  }
}

export default Signer;