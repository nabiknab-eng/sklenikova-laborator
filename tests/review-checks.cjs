'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const P=require(path.join(root,'physics.js'))();
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data/atlas.js'),'utf8'),ctx);
const data=P.decodeData(ctx.window.ATLAS_DATA);P.setData(data);
const assert=require('node:assert/strict');
const s={...P.defaultState},report={sourceHashes:{},angularRecurrence:[],extremeProfiles:[]};
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/PROVENANCE.json'),'utf8'));
for(const g of P.gases){const hash=crypto.createHash('sha256').update(Buffer.from(data[g].buffer)).digest('hex');report.sourceHashes[g]={actual:hash,expected:manifest.gases[g].sha256_float32,match:hash===manifest.gases[g].sha256_float32};}
// Direct recurrence along each angular ray: this independently checks the layer
// indexing, atmospheric source terms and hemispheric integration, without Q/E3.
function rayBin(st,b,nmu=2048,ns=20){
  const L=50,dz=1000,T=Array.from({length:L},(_,l)=>st.ts+st.gradient*Math.min((l+.5)*dz,st.tropopause)+st.stratGradient*Math.max(0,(l+.5)*dz-st.tropopause));
  const black=(kap,temp)=>kap===0?0:Math.PI*2*6.62607015e-34*299792458**2*kap**3/Math.expm1(6.62607015e-34*299792458*kap/(1.380649e-23*temp));
  const B=temp=>(black(b*200,temp)+4*black(b*200+100,temp)+black(b*200+200,temp))/6;
  const Bs=B(st.ts),Ba=T.map(B);let avg=0;
  for(let j=0;j<ns;j++){
    const ix=b*200+Math.floor((j+.5)*200/ns),dryTau=data.co2[ix]*st.co2+data.ch4[ix]*st.ch4+data.n2o[ix]*st.n2o,wetTau=data.h2o[ix]*st.h2o;
    const dt=Array.from({length:L},(_,l)=>dryTau*(Math.exp(-l*dz/7000)-Math.exp(-(l+1)*dz/7000))/(1-Math.exp(-50000/7000))+wetTau*(Math.exp(-l*dz/2000)-Math.exp(-(l+1)*dz/2000))/(1-Math.exp(-50000/2000)));
    let angular=0;
    for(let a=0;a<nmu;a++){const mu=(a+.5)/nmu;let I=Bs;for(let l=0;l<L;l++){const q=Math.exp(-dt[l]/mu);I=I*q+Ba[l]*(1-q);}angular+=2*mu*I/nmu;}
    avg+=angular/ns;
  }
  return avg;
}
for(const [name,st] of [['reference',s],['isothermal',{...s,gradient:0,stratGradient:0}],['inversion',{...s,gradient:.003,stratGradient:0}]]){
  const sol=P.solve(st);
  for(const b of [200,333,500,700,1100]){const independent=rayBin(st,b),actual=sol.out[b];report.angularRecurrence.push({profile:name,bin:b,wavenumber:200*b+100,independent,actual,relativeError:Math.abs(independent/actual-1)});}
}
for(const [name,st] of [
  ['cold steep',{...s,ts:220,gradient:-.009,tropopause:15000,stratGradient:0}],
  ['warm inversion',{...s,ts:340,gradient:.004,tropopause:15000,stratGradient:.003}],
  ['standard',{...s}],
  ['strong stratospheric inversion',{...s,ts:220,gradient:-.009,tropopause:8000,stratGradient:.003}],
]){
  const a20=P.solve(st,{samples:20}),b20=P.solve({...st,co2:2},{samples:20}),a200=P.solve(st,{samples:200}),b200=P.solve({...st,co2:2},{samples:200});
  report.extremeProfiles.push({name,minT:Math.min(...a20.temps),maxT:Math.max(...a20.temps),olr20:a20.olr,olr200:a200.olr,olrSamplingError:a20.olr-a200.olr,delta20:b20.olr-a20.olr,delta200:b200.olr-a200.olr,deltaSamplingError:b20.olr-a20.olr-(b200.olr-a200.olr)});
}
const transfer1=P.buildTransfer(s),transfer2=P.buildTransfer({...s,co2:2});
const delta=gradient=>{const st={...s,gradient};return P.olrOnly(st,transfer2)-P.olrOnly(st,transfer1);};
let lo=-.0065,hi=0;
for(let i=0;i<45;i++){const mid=(lo+hi)/2;if(delta(mid)>0)hi=mid;else lo=mid;}
const gradient=(lo+hi)/2;report.nonisothermalCancellation={gradient,stratGradient:s.stratGradient,delta:delta(gradient),Tsurface:s.ts,Ttropopause:P.temperature(s.tropopause,{...s,gradient}),Ttop:P.temperature(50000,{...s,gradient})};
report.isothermalRoundoff=[];
for(const ts of [220,255,288,340]){const st={...s,ts,gradient:0,stratGradient:0};report.isothermalRoundoff.push({ts,delta:P.olrOnly(st,transfer2)-P.olrOnly(st,transfer1)});}
const fixed={...s,atmosAnchor:288};
const a=P.balance({...fixed,ts:235},.3,1361,'fixed'),b=P.balance({...fixed,ts:300},.3,1361,'fixed');
const rootT=a.roots[0].T,c=P.balance({...fixed,ts:rootT},.3,1361,'fixed');
report.fixedAnchor={equilibriumTs235:a.roots[0].T,equilibriumTs300:b.roots[0].T,rootDifference:b.roots[0].T-a.roots[0].T,residualAfterSettingRoot:c.asr-c.currentOLR};
for(const v of Object.values(report.sourceHashes))assert.ok(v.match);
for(const v of report.angularRecurrence)assert.ok(v.relativeError<1e-6);
for(const v of report.extremeProfiles){assert.ok(Math.abs(v.olrSamplingError)<.1);assert.ok(Math.abs(v.deltaSamplingError)<.02);}
assert.ok(Math.abs(report.nonisothermalCancellation.delta)<1e-7);
assert.ok(Math.abs(report.fixedAnchor.rootDifference)<1e-5);
assert.ok(Math.abs(report.fixedAnchor.residualAfterSettingRoot)<1e-4);
report.independentChecksPassed=true;
report.lowSolarHighAlbedo={S:600,A:.8,equilibrium:P.teff(P.asr(600,.8)),checkedUITemperatureRange:[120,380]};
assert.ok(report.lowSolarHighAlbedo.equilibrium>=120&&report.lowSolarHighAlbedo.equilibrium<=380);
fs.writeFileSync(path.join(__dirname,'review-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
