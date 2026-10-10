/* Pure calculation module. SI throughout; no DOM or external dependencies. */
function GreenhousePhysics() {
  'use strict';
  const h=6.62607015e-34, c=299792458, k=1.380649e-23;
  const sigma=2*Math.PI**5*k**4/(15*h**3*c**2);
  const gases=['co2','h2o','ch4','n2o'];
  const NB=2500, DW=200, TOP=50000, H_DRY=7000, H_WATER=2000;
  const defaultState={ts:288,gradient:-0.0065,tropopause:11000,stratGradient:0.001,co2:1,h2o:1,ch4:1,n2o:1};
  function planck(wn,T) { // B per SI wavenumber [W m^-2 sr^-1 (m^-1)^-1]
    if(!(T>0)||wn<0) throw Error('Teplota musí být kladná a vlnočet nezáporný.');
    if(wn===0) return 0;
    const x=h*c*wn/(k*T);
    return x>700 ? 0 : 2*h*c*c*wn**3/Math.expm1(x);
  }
  function exitance(wn,T) {return Math.PI*planck(wn,T);}
  function binPlanck(b,T) {const a=b*DW; return (exitance(a,T)+4*exitance(a+DW/2,T)+exitance(a+DW,T))/6;}
  function temperature(z,s) {return s.ts+s.gradient*Math.min(z,s.tropopause)+s.stratGradient*Math.max(0,z-s.tropopause);}
  function asr(S=1361,A=0.3) {return S*(1-A)/4;}
  function teff(F) {return (F/sigma)**0.25;}
  // E1: convergent power series for x<=1, continued fraction for x>1.
  function E1(x) {
    if(x===0) return Infinity;
    if(x<0) throw Error('Záporná optická tloušťka.');
    if(x<=1) {
      let term=-x, sum=term;
      for(let j=2;j<160;j++){term*=-x/j;const d=term/j;sum+=d;if(Math.abs(d)<1e-17)break;}
      return -0.5772156649015328606-Math.log(x)-sum;
    }
    let b=x+1, cc=1e300, d=1/b, f=d;
    for(let j=1;j<400;j++) {
      const a=-j*j;b+=2;d=a*d+b;if(Math.abs(d)<1e-300)d=1e-300;
      cc=b+a/cc;if(Math.abs(cc)<1e-300)cc=1e-300;
      d=1/d;const delta=cc*d;f*=delta;if(Math.abs(delta-1)<2e-15)break;
    }
    return f*Math.exp(-x);
  }
  function transmissionExact(tau) { // 2 E3(tau) = 2 integral_0^1 mu exp(-tau/mu) dmu
    if(tau<0) throw Error('Optická tloušťka musí být nezáporná.');
    if(tau===0) return 1;
    if(tau>60)return 0;
    if(tau>8) { // avoid cancellation in E3 recurrence at large x
      let b=tau+3, cc=1e300,d=1/b,f=d;
      for(let j=1;j<400;j++) {const a=-j*(j+2);b+=2;d=a*d+b;cc=b+a/cc;d=1/d;const q=cc*d;f*=q;if(Math.abs(q-1)<2e-15)break;}
      return 2*f*Math.exp(-tau);
    }
    const ex=Math.exp(-tau), e2=ex-tau*E1(tau);
    return ex-tau*e2;
  }
  const LOG_MIN=Math.log(1e-7), LOG_MAX=Math.log(60), NT=6000;
  const TABLE_STEP=(LOG_MAX-LOG_MIN)/(NT-1), qtable=new Float64Array(NT);
  for(let i=0;i<NT;i++)qtable[i]=transmissionExact(Math.exp(LOG_MIN+i*TABLE_STEP));
  function transmission(t) {
    if(t<=0) return 1;
    if(t<1e-7)return 1-2*t;
    if(t>=60)return 0;
    const j=(Math.log(t)-LOG_MIN)/TABLE_STEP, i=Math.floor(j), f=j-i;
    return qtable[i]*(1-f)+qtable[i+1]*f;
  }
  function grey(ts,ta,tau) {const q=transmissionExact(tau);return sigma*(ta**4+(ts**4-ta**4)*q);}
  function decodeData(obj) {
    const result={};
    for(const g of gases) {
      const raw=typeof atob==='function'?atob(obj.base64[g]):Buffer.from(obj.base64[g],'base64').toString('binary');
      const u=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)u[i]=raw.charCodeAt(i);
      const view=new DataView(u.buffer),a=new Float32Array(raw.length/4);
      for(let i=0;i<a.length;i++)a[i]=view.getFloat32(i*4,true);result[g]=a;
    }
    return result;
  }
  let spectral=null, cache=new Map();
  function setData(data) {spectral=data;cache.clear();}
  function buildTransfer(s,options={}) {
    if(!spectral)throw Error('Spektrální data nebyla načtena.');
    const samples=options.samples||20, layers=options.layers||50;
    if(!Number.isInteger(samples)||samples<1||samples>200)throw Error('Počet vzorků musí být 1 až 200.');
    const key=JSON.stringify([samples,layers,...gases.map(g=>s[g])]);
    if(cache.has(key))return cache.get(key);
    const weights=new Float64Array(NB*(layers+1)),tauMean=new Float64Array(NB);
    const tauGas=Object.fromEntries(gases.map(g=>[g,new Float64Array(NB)]));
    const dry=new Float64Array(layers),wet=new Float64Array(layers),heights=new Float64Array(layers+1);
    for(let l=0;l<layers;l++) {
      const lo=l*TOP/layers, hi=(l+1)*TOP/layers;heights[l+1]=(lo+hi)/2;
      dry[l]=(Math.exp(-lo/H_DRY)-Math.exp(-hi/H_DRY))/(1-Math.exp(-TOP/H_DRY));
      wet[l]=(Math.exp(-lo/H_WATER)-Math.exp(-hi/H_WATER))/(1-Math.exp(-TOP/H_WATER));
    }
    for(const g of gases)if(!(s[g]>=0&&Number.isFinite(s[g])))throw Error('Násobky sloupce plynů musí být nezáporné.');
    for(let b=0;b<NB;b++) {
      const off=b*(layers+1);
      for(let j=0;j<samples;j++) {
        const ix=b*200+Math.floor((j+0.5)*200/samples);
        const tc=spectral.co2[ix]*s.co2, tw=spectral.h2o[ix]*s.h2o,tm=spectral.ch4[ix]*s.ch4,tn=spectral.n2o[ix]*s.n2o;
        const td=tc+tm+tn;let above=0,q0=1;
        tauMean[b]+=(td+tw)/samples;
        tauGas.co2[b]+=tc/samples;tauGas.h2o[b]+=tw/samples;tauGas.ch4[b]+=tm/samples;tauGas.n2o[b]+=tn/samples;
        for(let l=layers-1;l>=0;l--) {
          above+=td*dry[l]+tw*wet[l];const q1=transmission(above);
          weights[off+l+1]+=(q0-q1)/samples;q0=q1;
        }
        weights[off]+=q0/samples;
      }
    }
    const result={weights,tauMean,tauGas,heights,layers,samples,nb:NB,dw:DW};
    cache.set(key,result);if(cache.size>20)cache.delete(cache.keys().next().value);
    return result;
  }
  function solve(s,options={}) {
    const tr=options.transfer||buildTransfer(s,options),L=tr.layers;
    const temps=Array.from(tr.heights,(z,i)=>i===0?s.ts:temperature(z,s));
    if(temps.some(t=>!(t>0)))throw Error('Zvolený profil vede k nekladné absolutní teplotě.');
    const out=new Float64Array(NB),surf=new Float64Array(NB),mean=new Float64Array(NB),p10=new Float64Array(NB),p90=new Float64Array(NB);
    const x=Float64Array.from({length:NB},(_,b)=>b*DW+DW/2);
    const emissions=new Float64Array(NB*(L+1));let olr=0,bbIntegral=0;
    for(let b=0;b<NB;b++) {
      const off=b*(L+1);let total=0,zm=0;
      for(let l=0;l<=L;l++) {
        const B=binPlanck(b,temps[l]),v=B*tr.weights[off+l];emissions[off+l]=v;total+=v;zm+=tr.heights[l]*v;
        if(l===0){surf[b]=B;bbIntegral+=B*DW;}
      }
      out[b]=total;olr+=total*DW;mean[b]=total?zm/total:0;
      let cum=0,lo=false;
      for(let l=0;l<=L;l++){cum+=emissions[off+l];if(!lo&&cum>=0.1*total){p10[b]=tr.heights[l];lo=true;}if(cum>=0.9*total){p90[b]=tr.heights[l];break;}}
    }
    // Explicitly transparent region above atlas upper bound; tiny at classroom temperatures.
    const transparentTail=Math.max(0,sigma*s.ts**4-bbIntegral);
    olr+=transparentTail;
    return {x,out,surf,mean,p10,p90,emissions,olr,transparentTail,temps,transfer:tr,state:{...s}};
  }
  function balance(s,A=0.3,S=1361,closure='shift',options={}) {
    const transfer=buildTransfer(s,options), input=asr(S,A);
    function at(T) {
      const p={...s,ts:T};
      if(closure==='fixed') { // independent anchor keeps atmospheric temperatures fixed as the surface changes
        const fixedState={...s,ts:s.atmosAnchor===undefined?s.ts:s.atmosAnchor};
        return solveWithTemperatures(p,Array.from(transfer.heights,(z,i)=>i?temperature(z,fixedState):T),transfer).olr;
      }
      return olrOnly(p,transfer);
    }
    const grid=[],lo=200,hi=380;
    for(let T=lo;T<=hi;T+=5)grid.push({T,olr:at(T)});
    const roots=[],fluxZeroTolerance=1e-9; // W m^-2; includes summation roundoff at a grid boundary
    const addRoot=T=>{
      if(roots.some(r=>Math.abs(r.T-T)<1e-5))return;
      roots.push({T,residual:input-at(T),dOLR:(at(T+0.01)-at(T-0.01))/0.02});
    };
    for(const point of grid)if(Math.abs(input-point.olr)<=fluxZeroTolerance)addRoot(point.T);
    for(let i=1;i<grid.length;i++) {
      let a=grid[i-1].T,b=grid[i].T,fa=input-grid[i-1].olr,fb=input-grid[i].olr;
      if(Math.abs(fa)>fluxZeroTolerance&&Math.abs(fb)>fluxZeroTolerance&&fa*fb<0) {
        for(let j=0;j<35&&b-a>1e-5;j++){const m=(a+b)/2,fm=input-at(m);if(fa*fm<=0){b=m;fb=fm;}else{a=m;fa=fm;}}
        addRoot((a+b)/2);
      }
    }
    roots.sort((a,b)=>a.T-b.T);
    return {asr:input,grid,roots,closure,currentOLR:at(s.ts),currentT:s.ts};
  }
  function solveWithTemperatures(s,temps,tr) { // efficient flux-only equilibrium evaluations
    let sum=0,bb=0;
    for(let b=0;b<NB;b++) {
      const off=b*(tr.layers+1);
      for(let l=0;l<=tr.layers;l++){const B=binPlanck(b,temps[l]);sum+=B*tr.weights[off+l]*DW;if(l===0)bb+=B*DW;}
    }
    return {olr:sum+Math.max(0,sigma*s.ts**4-bb)};
  }
  function olrOnly(s,transfer) {return solveWithTemperatures(s,Array.from(transfer.heights,(z,i)=>i?temperature(z,s):s.ts),transfer).olr;}
  // Independent full angular Gaussian integration, used in automated tests.
  function gaussLegendre(n=64) {
    const nodes=[],weights=[];
    for(let i=1;i<=n;i++) {
      let z=Math.cos(Math.PI*(i-0.25)/(n+0.5)),p,pp;
      for(let it=0;it<30;it++){let p1=1,p2=0;for(let j=1;j<=n;j++){const p3=p2;p2=p1;p1=((2*j-1)*z*p2-(j-1)*p3)/j;}p=p1;pp=n*(z*p1-p2)/(z*z-1);const dz=p/pp;z-=dz;if(Math.abs(dz)<1e-15)break;}
      nodes.push((z+1)/2);weights.push(1/((1-z*z)*pp*pp));
    }
    return {nodes,weights};
  }
  function transmissionQuadrature(tau,n=128) {const q=gaussLegendre(n);return q.nodes.reduce((s,m,i)=>s+2*q.weights[i]*m*Math.exp(-tau/m),0);}
  return {h,c,k,sigma,gases,NB,DW,TOP,H_DRY,H_WATER,defaultState,planck,exitance,binPlanck,temperature,asr,teff,E1,transmissionExact,transmission,grey,decodeData,setData,buildTransfer,solve,balance,olrOnly,solveWithTemperatures,gaussLegendre,transmissionQuadrature};
}
if(typeof module!=='undefined'&&module.exports)module.exports=GreenhousePhysics;
if(typeof window!=='undefined')window.GreenhousePhysics=GreenhousePhysics;
