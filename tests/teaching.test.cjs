'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),P=require(path.join(root,'physics.js'))(),calc=require(path.join(root,'calculations.js'));
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data/atlas.js'),'utf8'),ctx);P.setData(P.decodeData(ctx.window.ATLAS_DATA));
const s={...P.defaultState,solar:1361,albedo:.3,closure:'shift',atmosAnchor:288},tests=[],measurements={};
const close=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
function test(name,fn){try{fn();tests.push({name,passed:true});}catch(e){tests.push({name,passed:false,error:e.message});}}
function run(experiment,state,reference=state){return calc(P,{experiment,state,reference,samples:20});}
test('Rozdílové spektrum: integrál odpovídá ΔOLR včetně rozdílu průhledných zbytků',()=>{
 for(const state of [s,{...s,gradient:0,stratGradient:0},{...s,gradient:.003,stratGradient:0},{...s,ts:300}]){
  const r=run(2,{...state,co2:2},s),integral=r.difference.reduce((a,v)=>a+v*P.DW,0)+r.current.transparentTail-r.reference.transparentTail;
  close(integral,r.current.olr-r.reference.olr);assert.equal(r.difference.length,P.NB);
 }
});
test('Oba příspěvkové profily: součet diskrétních vrstev a povrchu rekonstruuje tok',()=>{
 const r=run(2,{...s,co2:2},s);let max=0;
 for(const a of [r.current,r.reference])for(const b of [200,333,384,500]){
  let sum=0;for(let l=0;l<=a.transfer.layers;l++)sum+=a.emissions[b*(a.transfer.layers+1)+l];
  max=Math.max(max,Math.abs(sum-a.out[b]));close(sum,a.out[b],1e-14);
 }
 measurements.maxContributionError=max;
});
test('Čtyři stavy překryvu odpovídají nezávislým výpočtům jednotlivých atmosfér',()=>{
 const r=run(5,{...s,co2:2,h2o:.7,ch4:1.3,n2o:.6});
 for(const [key,c,w]of [['none',0,0],['co2',2,0],['water',0,.7],['both',2,.7]])close(r.fourStates[key],P.solve({...s,co2:c,h2o:w,ch4:1.3,n2o:.6}).olr);
 close(r.joint,r.fourStates.none-r.fourStates.both);
 close(r.separate,(r.fourStates.none-r.fourStates.co2)+(r.fourStates.none-r.fourStates.water));
});
test('Tři kroky běžného profilu: změna bilance při stejných teplotách a nová rovnováha',()=>{
 const state={...s,co2:2},r=run(6,state),d=r.comparison;
 const old=P.solve({...state,co2:1,ts:d.T0}),after=P.solve({...state,ts:d.T0});
 close(d.olr0,old.olr);close(d.olrAfter,after.olr);close(d.deltaN,old.olr-after.olr);
 assert.ok(d.deltaN>0&&d.deltaT>0);close(d.T1-d.T0,d.deltaT);assert.ok(Math.abs(d.baselineResidual)<1e-4);
 measurements.normal=d;
});
test('Tři kroky: stejný sloupec a plná izotermie nevytvářejí falešné působení',()=>{
 const same=run(6,s).comparison,iso=run(6,{...s,co2:2,gradient:0,stratGradient:0}).comparison;
 assert.equal(same.deltaN,0);assert.equal(same.deltaT,0);assert.ok(Math.abs(iso.deltaN)<1e-7);assert.ok(Math.abs(iso.deltaT)<1e-5);measurements.isothermal=iso;
});
test('Tři kroky inverze: větší tok, záporná změna bilance, nižší nová Ts',()=>{
 const d=run(6,{...s,co2:2,gradient:.003,stratGradient:0}).comparison;
 assert.ok(d.olrAfter>d.olr0);assert.ok(d.deltaN<0&&d.deltaT<0);measurements.inversion=d;
});
test('Pevná atmosféra: porovnání zachovává skutečný samostatný profil a aktuální ASR',()=>{
 const state={...s,ts:305,atmosAnchor:282,closure:'fixed',albedo:.28,solar:1400,co2:2},r=run(6,state),d=r.comparison;
 const direct=gas=>{const st={...state,ts:d.T0,co2:gas},tr=P.buildTransfer(st),temps=Array.from(tr.heights,(z,i)=>i?P.temperature(z,{...st,ts:282}):d.T0);return P.solveWithTemperatures(st,temps,tr).olr;};
 close(d.olr0,direct(1));close(d.olrAfter,direct(2));close(r.current.asr,1400*(1-.28)/4);
 const moved=run(6,{...state,ts:240}).comparison;close(moved.T0,d.T0);close(moved.deltaN,d.deltaN);close(moved.deltaT,d.deltaT);
});
test('Chybějící původní kořen se nenahrazuje smyšlenou teplotou',()=>{assert.equal(run(6,{...s,albedo:.8,solar:600,gradient:0,stratGradient:0}).comparison,null);});
test('Přiblížený graf používá skutečné toky a obsahuje oba přesně hledané kořeny',()=>{
 for(const state of [{...s,co2:2},{...s,co2:2,gradient:.003,stratGradient:0},{...s,co2:2,closure:'fixed',atmosAnchor:282}]){
  const d=run(6,state).comparison,g=d.focused;assert.ok(g.x.includes(d.T0)&&g.x.includes(d.T1));
  for(const i of [0,Math.floor(g.x.length/2),g.x.length-1]){
   const T=g.x[i];
   for(const [gas,values]of [[2,g.currentN],[1,g.baselineN]]){
    const st={...state,ts:T,co2:gas},tr=P.buildTransfer(st),temps=Array.from(tr.heights,(z,j)=>j?P.temperature(z,{...st,ts:state.closure==='fixed'?282:T}):T);
    close(values[i],P.asr(state.solar,state.albedo)-P.solveWithTemperatures(st,temps,tr).olr);
   }
  }
 }
});
test('Původní fyzikální jádro a spektrální data jsou zachována bitově',()=>{
 for(const name of ['physics.js','data/atlas.js','data/PROVENANCE.json']){
  const expected=JSON.parse(fs.readFileSync(path.join(__dirname,'original-physics-sha256.json'),'utf8')).sha256;
  const now=fs.readFileSync(path.join(root,name)),digest=crypto.createHash('sha256').update(now).digest('hex');assert.equal(digest,expected[name],name);
  measurements[name]=digest;
 }
});
const report={date:'2026-10-10',passed:tests.filter(t=>t.passed).length,total:tests.length,tests,measurements};
fs.writeFileSync(path.join(__dirname,'teaching-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
if(report.passed!==report.total)process.exitCode=1;
