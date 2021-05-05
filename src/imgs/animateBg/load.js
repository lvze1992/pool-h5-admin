function insertJs(url) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);
  document.getElementsByTagName('html')[0].appendChild(script);
}
export function loadAnimate() {
  if (window.bgAnimateFunc && window.THREE) {
    window.bgAnimateFunc();
    setTimeout(() => {
      document.querySelector('body > canvas').style.display = 'block';
    }, 0);
    return;
  }
  setTimeout(() => {
    insertJs('./animateBg/jquery.min.js');
    insertJs('./animateBg/TweenMax.min.js');
    insertJs('./animateBg/three.min.js');
    insertJs('./animateBg/script.js');
  }, 0);
  clearInterval(window.bgAnimateFuncTimer);
  window.bgAnimateFuncTimer = setInterval(() => {
    if (window.bgAnimateFunc && window.THREE) {
      clearInterval(window.bgAnimateFuncTimer);
      window.bgAnimateFunc();
      setTimeout(() => {
        document.querySelector('body > canvas').style.display = 'block';
      }, 0);
    }
  }, 100);
}
export function cancelAnimate() {
  const dom = document.querySelector('body > canvas');
  dom.remove();
  //   window.bgCancelAnimate && window.bgCancelAnimate();
}
