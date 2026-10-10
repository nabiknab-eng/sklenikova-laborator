function calculateExperiment(P,q) {
  const s=q.state,ref=q.reference,options={samples:q.samples||20,layers:50};
  const compact=r=>{const t=r.transfer;return {...r,transfer:{heights:t.heights,layers:t.layers,samples:t.samples,tauMean:t.tauMean,tauGas:t.tauGas}};};
  const solve=p=>P.solve(p,options),flux=p=>P.olrOnly(p,P.buildTransfer(p,options));
  if(q.experiment===1) {
    const x=Float64Array.from({length:1200},(_,i)=>(i+1)*250);
    return {x,y:Float64Array.from(x,v=>P.exitance(v,s.ts)),reference:Float64Array.from(x,v=>P.exitance(v,ref.ts)),flux:P.sigma*s.ts**4,asr:P.asr(s.solar,s.albedo),teff:P.teff(P.asr(s.solar,s.albedo))};
  }
  if(q.experiment===2) {
    const a=solve(s),b=solve(ref),d=flux({...s,co2:s.co2*2})-a.olr;
    return {current:compact(a),reference:compact(b),doubling:d,difference:Float64Array.from(a.out,(v,i)=>v-b.out[i])};
  }
  if(q.experiment===3) {
    const base=flux({...s,co2:1}),scales=[0,.125,.25,.5,.75,1,1.25,1.5,2,3,4,5,6,7,8],delta=scales.map(co2=>flux({...s,co2})-base);
    const matching=['ts','gradient','tropopause','stratGradient','h2o','ch4','n2o'].every(key=>s[key]===ref[key]);
    const baseRef=matching?base:flux({...ref,co2:1}),deltaRef=matching?delta:scales.map(co2=>flux({...ref,co2})-baseRef);
    const z=Float64Array.from({length:101},(_,i)=>i*500);
    return {z,temp:Float64Array.from(z,v=>P.temperature(v,s)),tempRef:Float64Array.from(z,v=>P.temperature(v,ref)),scales,delta,deltaRef,base,olr:flux(s),doubling:flux({...s,co2:2})-base};
  }
  if(q.experiment===4) {
    const x=Float64Array.from({length:241},(_,i)=>i*0.05),y=Float64Array.from(x,t=>P.grey(s.ts,s.ta,t)),yr=Float64Array.from(x,t=>P.grey(ref.ts,ref.ta,t));
    const opacity=1-P.transmissionExact(s.tau);
    return {x,y,reference:yr,olr:P.grey(s.ts,s.ta,s.tau),surface:P.sigma*s.ts**4*(1-opacity),atmosphere:P.sigma*s.ta**4*opacity,q:1-opacity};
  }
  if(q.experiment===5) {
    const a=solve(s),b=solve(ref),f0=flux({...s,co2:0,h2o:0}),fc=flux({...s,h2o:0}),fw=flux({...s,co2:0});
    return {current:compact(a),reference:compact(b),difference:Float64Array.from(a.out,(v,i)=>v-b.out[i]),joint:f0-a.olr,separate:2*f0-fc-fw,overlap:f0-a.olr-(2*f0-fc-fw),fourStates:{none:f0,co2:fc,water:fw,both:a.olr}};
  }
  if(q.experiment===6){
    const current=P.balance(s,s.albedo,s.solar,s.closure,options),reference=P.balance(ref,ref.albedo,ref.solar,ref.closure,options),baselineState={...s,co2:1};
    const co2Baseline=P.balance(baselineState,s.albedo,s.solar,s.closure,options),baseRoot=co2Baseline.roots[0];
    let comparison=null;
    if(baseRoot){
      const baseTransfer=P.buildTransfer(baselineState,options),newTransfer=P.buildTransfer(s,options);
      const at=(state,T,tr=state===baselineState?baseTransfer:newTransfer)=>{const anchor=s.closure==='fixed'?(s.atmosAnchor===undefined?s.ts:s.atmosAnchor):T;
        const temps=Array.from(tr.heights,(z,i)=>i?P.temperature(z,{...state,ts:anchor}):T);
        return P.solveWithTemperatures({...state,ts:T},temps,tr).olr;
      };
      // Difference of two fluxes at identical temperatures. Baseline bisection
      // residual does not become a false forcing when the states are equal.
      const T0=baseRoot.T,olr0=at(baselineState,T0),olrAfter=at(s,T0),T1=current.roots[0]?.T??null;
      comparison={T0,T1,olr0,olrAfter,deltaN:olr0-olrAfter,deltaT:T1===null?null:T1-T0,baselineResidual:current.asr-olr0};
      if(T1!==null){
        const lo=Math.max(200,Math.min(T0,T1)-3),hi=Math.min(380,Math.max(T0,T1)+3);
        const x=Array.from(new Set([...Array.from({length:31},(_,i)=>lo+(hi-lo)*i/30),T0,T1])).sort((a,b)=>a-b);
        comparison.focused={x,currentN:x.map(T=>current.asr-at(s,T)),baselineN:x.map(T=>current.asr-at(baselineState,T))};
      }
    }
    return {current,reference,co2Baseline,comparison};
  }
  throw Error('Neznámý experiment.');
}
if(typeof module!=='undefined'&&module.exports)module.exports=calculateExperiment;
if(typeof window!=='undefined')window.calculateExperiment=calculateExperiment;
