Air.Module("B.bridge", function() {
  var PROTOCOL_KEY = 'cjiahybrid';

  /**
   * 执行 Hybrid 方法
   * @param {String} fnName 方法名
   * @param {Object} param  传入参数对象
   */
  function run(fnName, param, options) {
    if (!fnName) {
      return;
    }
    options = options || {};

    var url = generateUrl(fnName, param, options);

    var iframe = document.createElement('iframe');
    var cont = document.body || document.documentElement;

    iframe.style.display = 'none';
    iframe.setAttribute('src', url);
    cont.appendChild(iframe);

    setTimeout(function(){
      iframe.parentNode.removeChild(iframe);
      iframe = null;
    }, 200);
  }

  /**
   * 生成访问的Url
   * @param {String} fnName       方法名
   * @param {Object} param        传入参数对象
   * @param {Object} options      选项
   *   @options {boolean} unified 使用统一回调，默认 true
   * @return {String} url
   */
  function generateUrl(fnName, param, options) {
    param = param || {};
    var url = PROTOCOL_KEY + '://' + fnName + '?jsparams=';
    var unified = typeof options.unified === 'boolean' ? options.unified : true;

    if (unified) {
      param.success = register(fnName, param.success);
      param.failed = register(fnName, param.failed);
    }

    url += encodeURIComponent(JSON.stringify(param));

    return url;
  }

  /**
   * 注册全局回调
   * @param {String} fnName 方法名
   * @param {Function} fn 回调方法
   * @return {String} callbackName 方法名（PROTOCOL_KEY + GUID + 毫秒数）
   */
  function register(fnName, fn, options) {
    var callbackName = PROTOCOL_KEY + getGUID() + new Date().getTime();
    options = options || {};
    var keepCallback = typeof options.keepCallback === 'boolean' ? options.keepCallback : false;
    console.log(fnName, callbackName);

    window[callbackName] = function() {
      if (typeof fn === 'function') {
        fn.apply(window, arguments);
      }
      if (!keepCallback) {
        destroyCallback(callbackName);
      }
    }

    return callbackName;
  }
  /**
   * 销毁全局回调
   * @param {String} callbackName 方法名
   */
  function destroyCallback(callbackName) {
    delete window[callbackName];
  }

  /**
   * 获取不带连接符的GUID
   * @return {String} guid
   */
  function getGUID() {
    var lut = [];
    for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }

    function generater() {
      var d0 = Math.random() * 0xffffffff | 0;
      var d1 = Math.random() * 0xffffffff | 0;
      var d2 = Math.random() * 0xffffffff | 0;
      var d3 = Math.random() * 0xffffffff | 0;
      return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    }

    return generater();
  }

  var isHybrid = /^file:/.test(location.protocol);

  return {
    run: run,
    register: register,
    isHybrid: isHybrid,
    isInApp: true
  };
});
