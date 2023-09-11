((document) => {
    'use strict';
    let fastNode;
    let failed;
    let isRunning;
 
    const DEST_LIST_US = [
      'cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
      'cdn.jsdelivr.net/npm/vue-i18n@8.26.7/dist/vue-i18n.min.js',
      'cdn.jsdelivr.net/npm/qs@6.11.0/dist/qs.js',
      'cdn.jsdelivr.net/npm/axios@0.26.0/dist/axios.min.js',
      'cdn.jsdelivr.net/npm/vue-router@3.5.3/dist/vue-router.min.js',
      'cdn.jsdelivr.net/npm/element-ui@2.15.7/lib/index.js',
      'cdn.jsdelivr.net/npm/vue-clipboard2@0.3.3/dist/vue-clipboard.min.js'
    ];

    const DEST_LIST_CN = [
        'lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.11/vue.min.js',
        'lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue-i18n/8.26.7/vue-i18n.min.js',
        'lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/qs/6.10.3/qs.min.js',
        'lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/axios/0.26.0/axios.min.js',
        'lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue-router/3.5.3/vue-router.js',
        'lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/element-ui/2.15.7/index.min.js',
        'lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue-clipboard2/0.3.3/vue-clipboard.min.js',
    ];

    const PREFIX = '//';
 
    const starTime = Date.now();
    const TIMEOUT = 1000;
    const STORE_KEY = 'cdn-auto-switch';
    const USING_CACHE = false;

    const shouldReplace = (element,text) =>{
        if(element.dataset && element.dataset.cdn &&element.dataset.cdn.length>0){
            return true;
        }else{
            return false;
        }
    };
    const replace = (element,text) =>{
        return PREFIX + DEST_LIST_US[element.dataset.cdn];
    };
    const setTimeout = window.setTimeout;
    const $ = document.querySelectorAll.bind(document);
  
    const replaceElementSrc = () => {
      let element;
      let value;
      for (element of $('script')) {
        value = element.src;
        if (shouldReplace(element,value)) {
          const newNode = document.createElement('script');
          newNode.src = replace(element,value);
          element.defer = true;
          element.src = '';
          element.before(newNode);
          element.remove();
        }
      }
    
    };
  
    const tryReplace = () => {

      if (!isRunning && failed) {
        console.log("切换");

        // console.warn(SOURCE + ' is not available. Use ' + fastNode);
        isRunning = true;
        setTimeout(replaceElementSrc, 0);
        // Some need to wait for a while
        setTimeout(replaceElementSrc, 20);
        // Replace dynamically added elements
        setInterval(replaceElementSrc, 500);
      }
    };
  
    const checkAvailable = (url, callback) => {
        
      let timeoutId;
      const newNode = document.createElement('script');
      const handleResult = (isSuccess) => {
        if (!timeoutId) {
          return;
        }
  
        clearTimeout(timeoutId);
        timeoutId = 0;
        // Used to cancel loading. Without this line it will remain pending status.
        if (!isSuccess) newNode.src = 'data:text/plain;base64,';
        newNode.remove();
        callback(isSuccess);
      };
  
      timeoutId = setTimeout(handleResult, TIMEOUT+1000);
  
      newNode.addEventListener('error', (res) =>  handleResult(false));
      newNode.addEventListener('load', (res) =>handleResult(true));
    //   newNode.rel = 'stylesheet';
      newNode.type = 'text/javascript';
      newNode.src = url  +'?'+ starTime;
      
      document.head.insertAdjacentElement('afterbegin', newNode);
    };
  
    const cached = (() => {
      try {
        return Object.assign(
          {},
          JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
        );
      } catch {
        return {};
      }
    })();
  
    const main = () => {
      cached.time = starTime;
      cached.failed = false;
      cached.fastNode = null;
      var testUrl = DEST_LIST_CN[0];
     
      setTimeout(() => {
        // If all domains are timeout
        if (failed && !fastNode) {
            console.log("测速失败切换节点");
          fastNode = DEST_LIST_CN[1];
          tryReplace();
        }
  
        localStorage.setItem(STORE_KEY, JSON.stringify(cached));
      }, TIMEOUT + 100);

      checkAvailable('https://' + testUrl, (isAvailable) => {
            
          console.log(testUrl, (Date.now() - starTime)+'ms', Boolean(isAvailable));
          if (!isAvailable) {
            failed = true;
            cached.failed = true;
            console.log("节点太慢切换");
          }
  
          if (isAvailable && !fastNode) {
            fastNode = testUrl;
          }
  
          if (isAvailable && !cached.fastNode) {
            cached.fastNode = testUrl;
          }
          tryReplace();
        });
      
       
    };
    main();
    // if (
    //   USING_CACHE &&
    //   cached.time &&
    //   starTime - cached.time < 60 * 60 * 1000 &&
    //   cached.failed &&
    //   cached.fastNode
    // ) {
    //   failed = true;
    //   fastNode = cached.fastNode;
    //   tryReplace();
    //   setTimeout(main, 1000);
    // } else {
    //   main();
    // }
  })(document);