/* 9DC.com — Direct Current, Decoded | site script (no dependencies) */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  function qs(k){try{return new URLSearchParams(location.search).get(k)}catch(e){return null}}

  /* ---------- Private inbox routing (the address is never written in any page) ---------- */
  var _q=[96,98,110,35,97,100,108,96,106,77,60,108,126,102,127,98,122,111,104,122];
  function inbox(){return String.fromCharCode.apply(null,_q.map(function(c){return c^13})).split('').reverse().join('')}
  function endpoint(){return 'https://formsubmit.co/ajax/'+inbox()}
  $$('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(a.getAttribute('data-mail')||'Inquiry from 9DC.com');
    });
  });

  /* ---------- Theme ---------- */
  var root=document.documentElement,saved=store('9dc-theme');
  if(saved)root.setAttribute('data-theme',saved);
  var tb=$('#themeBtn');
  if(tb)tb.addEventListener('click',function(){
    var dark=root.getAttribute('data-theme')?root.getAttribute('data-theme')==='dark':!matchMedia('(prefers-color-scheme: light)').matches;
    var next=dark?'light':'dark';root.setAttribute('data-theme',next);store('9dc-theme',next);
  });

  /* ---------- Nav ---------- */
  var here=location.pathname.replace(/index\.html$/,'');
  $$('#menu a').forEach(function(a){
    var h=a.getAttribute('href').replace(/index\.html$/,'');
    if(h===here||(h.indexOf('/guides/')===0&&here.indexOf('/guides/')===0)){a.classList.add('active');a.setAttribute('aria-current','page')}
  });
  var bg=$('#burger'),menu=$('#menu');
  if(bg&&menu)bg.addEventListener('click',function(){var o=menu.classList.toggle('open');bg.setAttribute('aria-expanded',o)});

  /* ---------- Reveal ---------- */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.1});
    $$('.reveal').forEach(function(el){io.observe(el)});
  }else $$('.reveal').forEach(function(el){el.classList.add('in')});

  /* ---------- Cookie ---------- */
  var ck=$('#cookie');
  if(ck&&!store('9dc-cookie'))ck.classList.add('show');
  $$('[data-cookie]').forEach(function(b){b.addEventListener('click',function(){store('9dc-cookie',b.getAttribute('data-cookie'));ck.classList.remove('show')})});
  $$('.year').forEach(function(el){el.textContent=new Date().getFullYear()});

  /* ---------- Forms ---------- */
  $$('form.js-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=$('.form-msg',f);
      if(f._honey&&f._honey.value)return;
      if(!f.checkValidity()){f.reportValidity();return}
      var btn=$('button[type=submit]',f),old=btn?btn.textContent:'';
      if(btn){btn.disabled=true;btn.textContent='Sending…'}
      var data={};
      new FormData(f).forEach(function(v,k){if(k!=='_honey'&&v!=='')data[k]=data[k]?data[k]+', '+v:v});
      data._subject=(f.getAttribute('data-subject')||'9DC.com form')+' — '+(data.name||data.email||'');
      data._template='table';data._captcha='false';data.page=location.pathname;
      fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){if(!r.ok)throw new Error('bad');return r.json().catch(function(){return {}})})
        .then(function(){
          if(msg){msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Received. We will be in touch within 2 business days.'}
          f.reset();resetSteps(f);
        })
        .catch(function(){if(msg){msg.className='form-msg err';msg.textContent='Network error — please try again in a minute.'}})
        .then(function(){if(btn){btn.disabled=false;btn.textContent=old}});
    });
  });
  function resetSteps(f){
    var st=$$('.step',f);if(!st.length)return;
    st.forEach(function(s,i){s.classList.toggle('active',i===0)});
    $$('.steps-ind span',f).forEach(function(s,i){s.classList.toggle('on',i===0)});
    if(f._go)f._go(0,true);
  }
  $$('form.multistep').forEach(function(f){
    var steps=$$('.step',f),ind=$$('.steps-ind span',f),i=0;
    function go(n,force){
      if(!force&&n>i){var bad=$$('input,select,textarea',steps[i]).filter(function(x){return !x.checkValidity()});if(bad.length){bad[0].reportValidity();return}}
      i=Math.max(0,Math.min(steps.length-1,n));
      steps.forEach(function(s,k){s.classList.toggle('active',k===i)});
      ind.forEach(function(s,k){s.classList.toggle('on',k<=i)});
    }
    f._go=go;
    $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){go(i+1)})});
    $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){go(i-1)})});
    /* auto-advance on project choice */
    if(steps[0])$$('input[type=radio]',steps[0]).forEach(function(r){r.addEventListener('change',function(){setTimeout(function(){go(1)},180)})});
  });
  /* Prefill quote form from tool context (?type=solar&ctx=...) */
  var qt=qs('type');
  if(qt){var r=$('input[name="project"][value="'+qt+'"]');if(r){r.checked=true}}
  var qc=qs('ctx'),cx=$('#q-context');
  if(qc&&cx){cx.value=qc.slice(0,300);var cn=$('#ctxNote');if(cn){cn.textContent='Attached from the calculator: '+qc.slice(0,300);cn.hidden=false}}

  /* ---------- YouTube facades ---------- */
  $$('.video[data-yt]').forEach(function(v){
    var id=v.getAttribute('data-yt'),t=v.getAttribute('data-title')||'Video';
    v.innerHTML='<img loading="lazy" alt="'+t.replace(/"/g,'')+'" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg"><div class="play"><span>▶</span></div>';
    v.setAttribute('role','button');v.setAttribute('tabindex','0');v.setAttribute('aria-label','Play: '+t);
    function play(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+t.replace(/"/g,'')+'" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>'}
    v.addEventListener('click',play,{once:true});
    v.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
  });

  /* ---------- Filters (guides, glossary, videos) ---------- */
  var fi=$('#filterInput');
  if(fi)fi.addEventListener('input',function(){var q=fi.value.toLowerCase().trim();$$('[data-filter-item]').forEach(function(c){c.style.display=c.textContent.toLowerCase().indexOf(q)>-1?'':'none'})});
  $$('[data-chip]').forEach(function(b){b.addEventListener('click',function(){
    var t=b.getAttribute('data-chip');$$('[data-chip]').forEach(function(x){x.classList.toggle('on',x===b)});
    $$('[data-cat]').forEach(function(c){c.style.display=(t==='all'||c.getAttribute('data-cat').indexOf(t)>-1)?'':'none'});
  })});

  /* ---------- Shared math ---------- */
  function num(id){var el=document.getElementById(id);return el?parseFloat(el.value)||0:0}
  function set(id,t){var el=document.getElementById(id);if(el)el.textContent=t}
  function fx(n,d){return isFinite(n)?n.toLocaleString(undefined,{minimumFractionDigits:d||0,maximumFractionDigits:d||0}):'—'}
  function money(n,d){return isFinite(n)?(n<0?'-':'')+'$'+Math.abs(n).toLocaleString(undefined,{minimumFractionDigits:d||0,maximumFractionDigits:d||0}):'—'}
  function mins(m){if(!isFinite(m))return '—';m=Math.round(m);return m<60?m+' min':Math.floor(m/60)+' h '+(m%60<10?'0':'')+(m%60)+' min'}
  function bind(ids,fn){ids.forEach(function(id){var el=document.getElementById(id);if(el){el.addEventListener('input',fn);el.addEventListener('change',fn)}});fn()}
  function bar(id,pct){var el=document.getElementById(id);if(el)el.style.width=Math.max(0,Math.min(100,pct))+'%'}
  function quoteLink(id,type,ctx){var a=document.getElementById(id);if(a)a.href='/get-quote.html?type='+type+'&ctx='+encodeURIComponent(ctx)}
  $$('.range-row input[type=range]').forEach(function(r){var o=r.parentNode.querySelector('output');function u(){if(o)o.textContent=r.value+(r.getAttribute('data-unit')||'')}r.addEventListener('input',u);u()});

  /* DC fast-charge power model: fraction of peak power available at a state of charge (0–1).
     Generic lithium-ion taper — real curves vary by vehicle, temperature and charger. */
  function curveFrac(s){
    if(s<0.10)return 0.80+2*s;           /* ramp-up at very low SoC */
    if(s<0.50)return 1.0;                /* constant-power plateau */
    if(s<0.80)return 1.0-(s-0.50)*1.5;   /* taper to 55% by 80% */
    return Math.max(0.10,0.55-(s-0.80)*2.25); /* steep taper to ~10% at 100% */
  }
  function simulate(kwh,s0,s1,peak){
    var t=0,e=0,step=0.005,s=s0,trace=[];
    if(s1<=s0||peak<=0||kwh<=0)return {min:0,kwh:0,trace:trace};
    while(s<s1-1e-9){
      var ds=Math.min(step,s1-s),p=peak*curveFrac(s+ds/2);
      var de=kwh*ds;t+=de/p*60;e+=de;s+=ds;trace.push([s,p]);
    }
    return {min:t,kwh:e,trace:trace};
  }
  window._9dc={curveFrac:curveFrac,simulate:simulate};

  /* ---------- Hero live session ---------- */
  var hb=$('#heroKw');
  if(hb){
    var pk=180,kwhH=77,soc=0.1,el=0,added=0,path=$('#heroCurve'),area=$('#heroArea'),dotC=$('#heroDot');
    /* draw curve */
    var pts=[];for(var x=0;x<=100;x+=2){pts.push([x*3,90-curveFrac(x/100)*80])}
    var d='M'+pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' L');
    if(path)path.setAttribute('d',d);if(area)area.setAttribute('d',d+' L300,90 L0,90 Z');
    (function tick(){
      var p=pk*curveFrac(soc),de=p/3600*45;/* 45 simulated seconds per frame */
      soc+=de/kwhH;el+=45;added+=de;
      if(soc>=0.8){soc=0.1;el=0;added=0}
      hb.textContent=Math.round(p);
      set('heroSoc',Math.round(soc*100)+'%');set('heroTime',Math.floor(el/60)+' min');set('heroAdded',added.toFixed(1)+' kWh');
      bar('heroBar',soc*100);
      if(dotC){dotC.setAttribute('cx',(soc*300).toFixed(1));dotC.setAttribute('cy',(90-curveFrac(soc)*80).toFixed(1))}
      setTimeout(tick,400);
    })();
  }

  /* ---------- Tool tabs ---------- */
  var tabs=$$('.tool-tabs button');
  tabs.forEach(function(b){b.addEventListener('click',function(){
    tabs.forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
    $$('.tool').forEach(function(t){t.classList.toggle('on',t.id===b.getAttribute('data-tool'))});
    history.replaceState(null,'','#'+b.getAttribute('data-tool'));
  })});
  function openHash(){if(location.hash){var t=$('.tool-tabs button[data-tool="'+location.hash.slice(1)+'"]');if(t)t.click()}}
  openHash();window.addEventListener('hashchange',openHash);

  /* 1. DC fast-charge time */
  if($('#t-fast')){
    bind(['f-kwh','f-start','f-end','f-chg','f-car','f-temp','f-eff'],function(){
      var kwh=num('f-kwh'),s0=num('f-start')/100,s1=num('f-end')/100,peak=Math.min(num('f-chg'),num('f-car'))*parseFloat($('#f-temp').value);
      var r=simulate(kwh,s0,s1,peak),grid=r.kwh/0.93;
      set('fast-time',mins(r.min));set('fast-kwh',fx(r.kwh,1)+' kWh');set('fast-grid',fx(grid,1)+' kWh');
      set('fast-avg',r.min>0?fx(r.kwh/(r.min/60),0)+' kW':'—');set('fast-range',fx(r.kwh*num('f-eff'),0)+' mi / '+fx(r.kwh*num('f-eff')*1.609,0)+' km');
      var to80=s1>0.8?simulate(kwh,s0,0.8,peak):null,rest=s1>0.8?simulate(kwh,0.8,s1,peak):null;
      set('fast-verdict',to80?'The last '+Math.round((s1-0.8)*100)+'% takes '+mins(rest.min)+' — '+Math.round(rest.min/r.min*100)+'% of the session for '+Math.round(rest.kwh/r.kwh*100)+'% of the energy. On a road trip, unplug at ~80% and stop again.':'Good plan: you stay in the fast part of the curve. Limiting factor: '+(num('f-chg')<num('f-car')?'the charger ('+num('f-chg')+' kW)':'your car’s max rate ('+num('f-car')+' kW)')+'.');
      bar('fast-bar',Math.min(100,r.min/90*100));
      quoteLink('fast-q','ev-charger','Fast-charge calc: '+kwh+' kWh pack, '+Math.round(s0*100)+'→'+Math.round(s1*100)+'%');
      var svg=$('#fastCurve');
      if(svg&&r.trace.length){
        var all=[];for(var x=0;x<=100;x+=2){all.push((x*3).toFixed(1)+','+(100-curveFrac(x/100)*85).toFixed(1))}
        var seg=r.trace.filter(function(_,i){return i%2===0}).map(function(t){return (t[0]*300).toFixed(1)+','+(100-t[1]/peak*85).toFixed(1)});
        $('#fcAll').setAttribute('d','M'+all.join(' L'));
        $('#fcSeg').setAttribute('d','M'+(s0*300).toFixed(1)+',100 L'+seg.join(' L')+' L'+(s1*300).toFixed(1)+',100 Z');
      }
    });
  }

  /* 2. Charging cost */
  if($('#t-cost')){
    bind(['c-miles','c-eff','c-home','c-dcfc','c-share','c-fee','c-gas','c-mpg'],function(){
      var miles=num('c-miles'),eff=num('c-eff')||1,share=num('c-share')/100;
      var kwh=miles/eff,homeK=kwh*(1-share)/0.88,dcK=kwh*share/0.93;
      var sessions=share>0?Math.ceil(kwh*share/45):0;
      var ev=homeK*num('c-home')+dcK*num('c-dcfc')+sessions*num('c-fee');
      var gas=num('c-mpg')>0?miles/num('c-mpg')*num('c-gas'):0;
      set('cost-month',money(ev)+'/mo');set('cost-gas',money(gas)+'/mo');set('cost-save',money((gas-ev)*12)+'/yr');
      set('cost-mile',money(miles>0?ev/miles*100:0,1).replace('$','')+'¢ / mi');
      set('cost-homeonly',money(kwh/0.88*num('c-home'))+'/mo');set('cost-dconly',money(kwh/0.93*num('c-dcfc'))+'/mo');
      set('cost-verdict',gas>ev?'Driving electric saves about '+money(gas-ev)+' a month versus '+num('c-mpg')+' mpg on gas. Every 10% of charging you move from DC fast to home saves ~'+money(kwh*0.1*(num('c-dcfc')/0.93-num('c-home')/0.88))+'/mo.':'At these prices fast charging costs more than gas — shifting to home charging is the lever.');
      bar('cost-bar',gas>0?ev/gas*100:0);
      quoteLink('cost-q','ev-charger','Cost calc: '+miles+' mi/mo, '+Math.round(share*100)+'% DC fast');
    });
  }

  /* 3. Road-trip planner */
  if($('#t-trip')){
    bind(['r-dist','r-eff','r-kwh','r-start','r-buf','r-to','r-kw','r-speed'],function(){
      var dist=num('r-dist'),eff=num('r-eff')||1,kwh=num('r-kwh'),need=dist/eff;
      var first=Math.max(0,(num('r-start')-num('r-buf'))/100*kwh),per=Math.max(0.01,(num('r-to')-num('r-buf'))/100*kwh);
      var stops=need<=first?0:Math.ceil((need-first)/per);
      var lastNeed=stops?need-first-(stops-1)*per:0;
      var sim=simulate(kwh,num('r-buf')/100,num('r-to')/100,num('r-kw'));
      var perMin=sim.min+6,chgMin=stops?(stops-1)*perMin+simulate(kwh,num('r-buf')/100,Math.min(num('r-to')/100,num('r-buf')/100+lastNeed/kwh+0.05),num('r-kw')).min+6:0;
      var drive=dist/(num('r-speed')||1)*60;
      set('trip-stops',stops+(stops===1?' stop':' stops'));set('trip-chg',mins(chgMin));set('trip-drive',mins(drive));set('trip-total',mins(drive+chgMin));
      set('trip-energy',fx(need,1)+' kWh');set('trip-leg',fx(per*eff,0)+' mi per leg');
      set('trip-verdict',stops===0?'No charging needed — you arrive with about '+Math.round((first-need)/kwh*100+num('r-buf'))+'% left.':'Charging adds '+Math.round(chgMin/(drive+chgMin)*100)+'% to your trip. Tip: '+(num('r-to')>85?'charging to '+num('r-to')+'% is slow; more, shorter stops at 10–70% are usually faster.':'short 10–'+num('r-to')+'% hops keep you in the fast part of the curve.'));
      bar('trip-bar',chgMin/(drive+chgMin||1)*100);
    });
  }

  /* 4. Solar sizer */
  if($('#t-solar')){
    var ps=$('#s-region');if(ps)ps.addEventListener('change',function(){if(ps.value){$('#s-psh').value=ps.value;$('#s-psh').dispatchEvent(new Event('input'))}});
    bind(['s-use','s-off','s-psh','s-loss','s-pw','s-cpw'],function(){
      var daily=num('s-use')*12/365*num('s-off')/100,psh=num('s-psh')||1,der=1-num('s-loss')/100;
      var kw=daily/(psh*der),panels=Math.ceil(kw*1000/(num('s-pw')||1)),real=panels*num('s-pw')/1000;
      var prod=real*psh*der*365,cost=real*1000*num('s-cpw');
      set('solar-kw',fx(real,2)+' kW');set('solar-panels',panels+' × '+num('s-pw')+' W');set('solar-area',fx(panels*21.5,0)+' ft² / '+fx(panels*2,0)+' m²');
      set('solar-prod',fx(prod,0)+' kWh/yr');set('solar-cost',money(cost));set('solar-daily',fx(daily,1)+' kWh/day');
      set('solar-verdict','A '+fx(real,1)+' kW array covers about '+Math.round(prod/(num('s-use')*12||1)*100)+'% of your use. Installed prices vary widely by market — get at least three quotes and compare cost per watt, not the headline price.');
      bar('solar-bar',Math.min(100,prod/(num('s-use')*12||1)*100));
      quoteLink('solar-q','solar','Solar sizer: ~'+fx(real,1)+' kW, '+num('s-use')+' kWh/mo');
    });
  }

  /* 5. Solar payback */
  if($('#t-roi')){
    bind(['p-cost','p-inc','p-prod','p-rate','p-esc','p-deg','p-val','p-om'],function(){
      var net=num('p-cost')*(1-num('p-inc')/100),cum=-net,pay=null,tot=0,kwhT=0,rows=[];
      for(var y=1;y<=25;y++){
        var prod=num('p-prod')*Math.pow(1-num('p-deg')/100,y-1),rate=num('p-rate')*Math.pow(1+num('p-esc')/100,y-1);
        var sav=prod*rate*num('p-val')/100-num('p-om');cum+=sav;tot+=sav;kwhT+=prod;
        if(pay===null&&cum>=0)pay=y-1+(sav>0?(sav-cum)/sav:0);
        rows.push(cum);
      }
      set('roi-pay',pay===null?'> 25 yrs':fx(pay,1)+' yrs');set('roi-net',money(net));set('roi-25',money(cum));
      set('roi-pct',net>0?fx(cum/net*100,0)+'%':'—');set('roi-lcoe',kwhT>0?money(net/kwhT*100,1).replace('$','')+'¢/kWh':'—');set('roi-y1',money(rows[0]+net));
      set('roi-verdict',pay===null?'This system does not pay back within 25 years at these inputs. Lower cost per watt or higher rates change the picture.':pay<8?'Strong case: payback under 8 years leaves 17+ years of near-free power.':pay<12?'Reasonable: a typical payback range. Negotiate cost per watt to pull it under 10 years.':'Marginal: long payback. Check net-metering rules and battery-free options before signing.');
      bar('roi-bar',pay===null?100:pay/25*100);
      quoteLink('roi-q','solar','Payback calc: '+money(num('p-cost'))+' system, payback '+(pay===null?'>25':fx(pay,1))+' yrs');
    });
  }

  /* 6. Battery bank */
  if($('#t-bank')){
    bind(['b-wh','b-days','b-v','b-chem','b-inv','b-temp','b-peak'],function(){
      var dod=parseFloat($('#b-chem').value),v=parseFloat($('#b-v').value);
      var usable=num('b-wh')*Math.max(1,num('b-days'))/(num('b-inv')/100||1);
      var nominal=usable/dod/parseFloat($('#b-temp').value),ah=nominal/v;
      var n100=Math.ceil(nominal/(12.8*100));
      set('bank-kwh',fx(nominal/1000,2)+' kWh');set('bank-ah',fx(ah,0)+' Ah @ '+v+' V');set('bank-usable',fx(usable/1000,2)+' kWh');
      set('bank-n',n100+' × 12 V 100 Ah equiv.');
      var pk=num('b-peak'),amps=pk/v;set('bank-amps',fx(amps,0)+' A at '+v+' V');
      set('bank-verdict',amps>200?'At '+v+' V your inverter draws '+fx(amps,0)+' A — that needs very heavy cable. Move up to '+(v<48?(v<24?'24 V or 48 V':'48 V'):'a split system')+'.':v===12&&nominal>3000?'Bank above ~3 kWh on 12 V gets awkward; 24 V or 48 V halves or quarters current and cable cost.':'Voltage and bank size are a sensible match.');
      bar('bank-bar',Math.min(100,amps/300*100));
      quoteLink('bank-q','battery','Battery bank: '+fx(nominal/1000,1)+' kWh @ '+v+' V');
    });
  }

  /* 7. Power-station runtime */
  if($('#t-run')){
    $$('[data-add-w]').forEach(function(b){b.addEventListener('click',function(){var w=$('#u-w');w.value=(parseFloat(w.value)||0)+parseFloat(b.getAttribute('data-add-w'));w.dispatchEvent(new Event('input'))})});
    var rz=$('#u-reset');if(rz)rz.addEventListener('click',function(){$('#u-w').value=0;$('#u-w').dispatchEvent(new Event('input'))});
    bind(['u-wh','u-dod','u-eff','u-w','u-max','u-pv','u-psh'],function(){
      var usable=num('u-wh')*num('u-dod')/100*parseFloat($('#u-eff').value),w=num('u-w');
      var h=w>0?usable/w:Infinity,re=num('u-pv')>0?num('u-wh')/(num('u-pv')*0.75):Infinity;
      set('run-h',w>0?fx(h,1)+' h':'—');set('run-usable',fx(usable,0)+' Wh');
      set('run-days',w>0?fx(h/24,2)+' days':'—');set('run-recharge',isFinite(re)?fx(re,1)+' sun-hours ≈ '+fx(re/(num('u-psh')||1),1)+' days':'—');
      set('run-verdict',w>num('u-max')?'Overload: '+w+' W exceeds the '+num('u-max')+' W inverter. Remove high-draw items or use a larger unit.':w>num('u-max')*0.8?'Near the inverter limit — motor loads (fridges, pumps) can surge 2–3× at start-up.':'Load is within the inverter rating.');
      bar('run-bar',Math.min(100,w/(num('u-max')||1)*100));
    });
  }

  /* 8. Wire gauge & voltage drop */
  if($('#t-wire')){
    var AWG=[['18',1620,7],['16',2580,10],['14',4110,20],['12',6530,25],['10',10380,35],['8',16510,50],['6',26240,65],['4',41740,85],['2',66360,115],['1',83690,130],['1/0',105600,150],['2/0',133100,175],['3/0',167800,200],['4/0',211600,230]];
    var MM={'18':0.82,'16':1.31,'14':2.08,'12':3.31,'10':5.26,'8':8.37,'6':13.3,'4':21.2,'2':33.6,'1':42.4,'1/0':53.5,'2/0':67.4,'3/0':85,'4/0':107};
    var FUSE=[5,10,15,20,25,30,40,50,60,70,80,100,125,150,175,200,225,250,300];
    bind(['w-v','w-a','w-len','w-drop','w-mat'],function(){
      var K=parseFloat($('#w-mat').value),I=num('w-a'),L=num('w-len'),Vd=num('w-v')*num('w-drop')/100;
      var cm=Vd>0?2*K*I*L/Vd:Infinity,amp=I*1.25*(K>15?1.27:1),pick=null;
      for(var k=0;k<AWG.length;k++){if(AWG[k][1]>=cm&&AWG[k][2]>=amp){pick=AWG[k];break}}
      if(!pick){set('wire-awg','Beyond 4/0');set('wire-verdict','Split the run, raise the system voltage, or move the battery closer — this current over this distance needs more than 4/0 cable.');bar('wire-bar',100);return}
      var actual=2*K*I*L/pick[1],fuse=FUSE.filter(function(x){return x>=I*1.25})[0]||300;
      if(fuse>pick[2]){var nf=FUSE.filter(function(x){return x<=pick[2]});fuse=nf[nf.length-1]}
      set('wire-awg',pick[0]+' AWG');set('wire-mm',MM[pick[0]]+' mm²');set('wire-drop',fx(actual,2)+' V ('+fx(actual/num('w-v')*100,1)+'%)');
      set('wire-loss',fx(actual*I,0)+' W');set('wire-fuse',fuse+' A');set('wire-cm',fx(cm,0)+' cmil');
      set('wire-verdict','Gauge set by '+(AWG.indexOf(pick)>0&&AWG[AWG.indexOf(pick)-1][1]>=cm?'ampacity':'voltage drop')+'. Keep the fuse within 7 in / 18 cm of the battery positive terminal.');
      bar('wire-bar',actual/num('w-v')*100/(num('w-drop')||1)*100);
    });
  }

  /* 9. Ohm's law & DC power */
  if($('#t-ohm')){
    function solve(){
      var V=parseFloat($('#o-v').value),I=parseFloat($('#o-i').value),R=parseFloat($('#o-r').value),P=parseFloat($('#o-p').value);
      var has=[!isNaN(V),!isNaN(I),!isNaN(R),!isNaN(P)],n=has.filter(Boolean).length,msg=$('#ohm-msg');
      if(n<2){msg.textContent='Enter any two values.';return}
      if(!isNaN(V)&&!isNaN(I)){R=V/I;P=V*I}
      else if(!isNaN(V)&&!isNaN(R)){I=V/R;P=V*I}
      else if(!isNaN(V)&&!isNaN(P)){I=P/V;R=V/I}
      else if(!isNaN(I)&&!isNaN(R)){V=I*R;P=V*I}
      else if(!isNaN(I)&&!isNaN(P)){V=P/I;R=V/I}
      else {V=Math.sqrt(P*R);I=V/R}
      set('ohm-v',fx(V,3)+' V');set('ohm-i',fx(I,3)+' A');set('ohm-r',fx(R,3)+' Ω');set('ohm-p',fx(P,2)+' W');
      var h=num('o-h');set('ohm-wh',h>0?fx(P*h,1)+' Wh ('+fx(P*h/1000,3)+' kWh), '+fx(I*h,1)+' Ah':'—');
      msg.textContent=n>2?'More than two values entered — solved from the first pair.':'Solved.';
    }
    $('#o-go').addEventListener('click',solve);
    $('#o-clear').addEventListener('click',function(){['o-v','o-i','o-r','o-p'].forEach(function(i){$('#'+i).value=''});['ohm-v','ohm-i','ohm-r','ohm-p','ohm-wh'].forEach(function(i){set(i,'—')});$('#ohm-msg').textContent='Enter any two values.'});
    var oh=$('#o-h');if(oh)oh.addEventListener('input',solve);
    solve();
  }

  /* ---------- Contest countdown (closes last day of month, 23:59 UTC) ---------- */
  var cd=$('#contestCountdown');
  if(cd){
    var now=new Date(),end=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()+1,0,23,59,0));
    set('contestDate',end.toUTCString().replace(':00 GMT',' UTC'));
    set('contestMonth',end.toLocaleString(undefined,{month:'long',year:'numeric',timeZone:'UTC'}));
    (function tick(){var ms=Math.max(0,end-new Date()),d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3);
      cd.textContent=d+'d '+(h<10?'0':'')+h+'h '+(m<10?'0':'')+m+'m '+(s<10?'0':'')+s+'s';setTimeout(tick,1000)})();
  }

  /* ---------- Donation amount sync ---------- */
  var other=$('#d-other');
  if(other)other.addEventListener('input',function(){if(other.value)$$('input[name="amount"]').forEach(function(r){r.checked=false;r.required=false});else $$('input[name="amount"]').forEach(function(r){r.required=true})});
})();
