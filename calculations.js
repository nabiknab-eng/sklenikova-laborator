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
    return {current:compact(a),reference:compact(b),doubling:d};
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
    return {current:compact(a),reference:compact(b),difference:Float64Array.from(a.out,(v,i)=>v-b.out[i]),joint:f0-a.olr,separate:2*f0-fc-fw,overlap:f0-a.olr-(2*f0-fc-fw)};
  }
  if(q.experiment===6)return {current:P.balance(s,s.albedo,s.solar,s.closure,options),reference:P.balance(ref,ref.albedo,ref.solar,ref.closure,options),co2Baseline:P.balance({...s,co2:1},s.albedo,s.solar,s.closure,options)};
  throw Error('Neznámý experiment.');
}
if(typeof module!=='undefined'&&module.exports)module.exports=calculateExperiment;
if(typeof window!=='undefined')window.calculateExperiment=calculateExperiment;
