(function(){
  function getBrowserInfo(){
    var ua = navigator.userAgent, tem, 
        M = ua.match(/(opera|chrome|edg|safari|firefox|msie|trident(?=\/))\/\s*([\d.]+)/i) || [];
    if(/trident/i.test(M[1])){
      tem = /rv:\s*([\d.]+)/g.exec(ua) || [];
      return {name:'IE',version:tem[1]||''};
    }
    if(M[1]=== 'Chrome'){
      tem = ua.match(/\b(OPR|Edg)\/([\d.]+)/);
      if(tem!= null) {
        return {name: tem[1] === 'OPR' ? 'Opera' : 'Edge', version: tem[2]};
      }
    }
    M = M[1]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    return {name: M[0], version: M[1]};
  }

  function render(){
    var info = getBrowserInfo();
    var el = document.getElementById('browser-widget');
    if(!el) return;
    el.style.position = 'fixed';
    el.style.right = '12px';
    el.style.bottom = '12px';
    el.style.padding = '8px 12px';
    el.style.background = 'rgba(0,0,0,0.7)';
    el.style.color = '#fff';
    el.style.borderRadius = '6px';
    el.style.fontFamily = 'Roboto, Arial, sans-serif';
    el.style.fontSize = '13px';
    el.style.zIndex = 9999;
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    el.textContent = 'Browser: ' + info.name + (info.version ? ' ' + info.version : '');
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
