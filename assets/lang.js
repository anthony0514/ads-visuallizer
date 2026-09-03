/* ADS Visualizer — shared language state.
   One key in localStorage, mirrored across the shell and every iframe.
   Markup carries both languages; CSS hides the one that is off. */
(function(w){
  'use strict';
  var KEY='ads-lang', DEFAULT='ko', subs=[], cur=DEFAULT;

  function stored(){
    try{ var v=w.localStorage.getItem(KEY); if(v==='ko'||v==='en') return v; }catch(e){}
    return DEFAULT;
  }

  function paint(l){
    var r=document.documentElement;
    r.setAttribute('data-lang',l);
    r.setAttribute('lang',l);
    for(var i=0;i<subs.length;i++){ try{ subs[i](l); }catch(e){} }
  }

  function relay(l){
    var msg={ads_lang:l};
    try{ if(w.parent && w.parent!==w) w.parent.postMessage(msg,'*'); }catch(e){}
    var fr=document.getElementsByTagName('iframe');
    for(var i=0;i<fr.length;i++){
      try{ fr[i].contentWindow.postMessage(msg,'*'); }catch(e){}
    }
  }

  function set(l, spread){
    if(l!=='ko' && l!=='en') return;
    var changed = l!==cur;
    cur=l;
    try{ w.localStorage.setItem(KEY,l); }catch(e){}
    if(changed || spread) paint(l);
    if(spread) relay(l);
  }

  w.addEventListener('message', function(e){
    var d=e && e.data;
    if(d && d.ads_lang && d.ads_lang!==cur){ set(d.ads_lang,false); paint(d.ads_lang); relay(d.ads_lang); }
  });
  w.addEventListener('storage', function(e){
    if(e.key===KEY && e.newValue && e.newValue!==cur){ set(e.newValue,false); paint(e.newValue); }
  });

  cur=stored();

  w.ADSLang={
    get:function(){ return cur; },
    set:function(l){ set(l,true); },
    /* fn(lang) runs now and on every change */
    on:function(fn){ subs.push(fn); try{ fn(cur); }catch(e){} },
    /* pick a value out of {en:…, ko:…} */
    t:function(pair){ return pair[cur]!==undefined ? pair[cur] : pair.en; },
    /* wire a group of [data-lang-set] buttons */
    bind:function(root){
      var b=(root||document).querySelectorAll('[data-lang-set]');
      Array.prototype.forEach.call(b, function(el){
        el.addEventListener('click', function(){ w.ADSLang.set(el.getAttribute('data-lang-set')); });
      });
      w.ADSLang.on(function(l){
        Array.prototype.forEach.call(b, function(el){
          el.setAttribute('aria-pressed', String(el.getAttribute('data-lang-set')===l));
        });
      });
    }
  };

  paint(cur);
})(window);
