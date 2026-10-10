'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const P=require(path.join(root,'physics.js'))();
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data/atlas.js'),'utf8'),ctx);
P.setData(P.decodeData(ctx.window.ATLAS_DATA));
const iso={...P.defaultState,gradient:0,stratGradient:0};
const report={tolerance:1e-9,gridRoundoff:[],boundaryRoots:[],outsideInterval:[]};
for(const co2 of [0,1,2,8]){
  const st={...iso,co2},transfer=P.buildTransfer(st);
  for(let T=200;T<=380;T+=5){
    const exact=P.sigma*T**4,actual=P.olrOnly({...st,ts:T},transfer);
    report.gridRoundoff.push({T,co2,actual,exact,error:actual-exact});
  }
  for(const T of [200,225,380]){
    const exact=P.sigma*T**4,A=.75,S=4*exact/(1-A);
    const b=P.balance(st,A,S);
    assert.equal(b.roots.length,1);assert.equal(b.roots[0].T,T);
    assert.ok(Math.abs(b.roots[0].residual)<=report.tolerance);
    assert.ok(Math.abs(b.roots[0].dOLR-4*P.sigma*T**3)<1e-6);
    report.boundaryRoots.push({target:T,co2,root:b.roots[0]});
  }
  for(const [edge,T,offset] of [['below',200,-1e-5],['above',380,1e-5]]){
    const input=P.sigma*T**4+offset,S=4*input/.25,b=P.balance(st,.75,S);
    assert.equal(b.roots.length,0);
    report.outsideInterval.push({edge,co2,input,rootCount:b.roots.length});
  }
}
const b=P.balance({...iso,co2:2},.75,1451.6158513182636);
assert.equal(b.roots.length,1);assert.equal(b.roots[0].T,200);
report.originalBrowserReproduction=b.roots[0];
report.maxGridRoundoff=Math.max(...report.gridRoundoff.map(v=>Math.abs(v.error)));
report.maxEquivalentTemperature=Math.max(...report.gridRoundoff.map(v=>Math.abs(v.error)/(4*P.sigma*v.T**3)));
report.toleranceEquivalentTemperatureAt200=report.tolerance/(4*P.sigma*200**3);
report.toleranceEquivalentTemperatureAt380=report.tolerance/(4*P.sigma*380**3);
report.passed=true;
fs.writeFileSync(path.join(__dirname,'recheck-boundary-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:report.passed,maxGridRoundoff:report.maxGridRoundoff,maxEquivalentTemperature:report.maxEquivalentTemperature,toleranceEquivalentTemperatureAt200:report.toleranceEquivalentTemperatureAt200,toleranceEquivalentTemperatureAt380:report.toleranceEquivalentTemperatureAt380,originalBrowserReproduction:report.originalBrowserReproduction,rootCases:report.boundaryRoots.length,outsideCases:report.outsideInterval.length},null,2));
