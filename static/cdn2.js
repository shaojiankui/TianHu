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

  
    const main = () => {
    
        if (navigator.language != "zh-CN") {
            DEST_LIST_US.forEach(element => {
                var script = document.createElement("script");
                script.src = PREFIX+element;
                script.type = 'text/javascript';
                script.defer = true;
                document.head.insertAdjacentElement('beforeEnd', script);
            });
            
        }else{
            DEST_LIST_CN.forEach(element => {
                var script = document.createElement("script");
                script.src =  PREFIX+element;
                script.defer = true;
                script.type = 'text/javascript';
                document.head.insertAdjacentElement('beforeEnd', script);
            });
        }
       
    };
    main();
  })(document);