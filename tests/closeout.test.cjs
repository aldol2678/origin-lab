const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {bundleAssets,keys}=require('../tools/assets.cjs'),{initialTen}=require('../tools/verify-r1.cjs');
const manifest=require('../assets/manifest.json'),ledger=require('../assets/r1-provenance.json'),correction=require('../assets/r1-provenance-correction.json');
test('C01 original 48 mappings preserved and ten R1 vector corrections explicitly approved',()=>{
 const before=require('./fixtures/r1-48-manifest.json');for(const [k,v]of Object.entries(before.assets))assert.deepEqual(manifest.assets[k],v);
 assert.equal(Object.keys(manifest.assets).length,58);assert.equal(correction.records.length,10);
 assert.equal(correction.r2IndexedFilesVerified,60);assert(correction.r2ArchiveMatchesR1PreservedCopy);
 assert.equal(correction.humanDrawnClaim,false);assert.equal(correction.exclusiveCopyrightClaim,false);
 assert.equal(correction.designApproved,true);assert.equal(correction.draftIntegrationApproved,true);assert.equal(correction.releaseApproved,false);assert.equal(correction.productionDeploymentApproved,false);
 for(const key of initialTen){const r=ledger.records.find(x=>x.key===key),c=correction.records.find(x=>x.key===key);assert(c);assert.equal(r.sourceApproved,false);assert.equal(r.sourceRightsStatus,c.previousSourceRightsStatus);assert.equal(r.rightsStatus,c.correctedRightsStatus);for(const t of ['light','dark']){const v=manifest.assets[key][t+'.default'];assert(v.approved);assert.equal(v.sha256,c.r1Files.find(x=>x.path.includes('svg20-'+t)).sha256);assert(v.path.endsWith('.svg'));}assert.equal(manifest.assets[key]['default.locked'].path,'r1/common/locked.svg');}
});
test('C02 every mapping carries actual file, original provenance, runtime decision and hash',()=>{
 const map=require('../assets/r1-mapping.json');assert.deepEqual(map,require('../tools/r1-mapping.cjs').mapping(manifest,ledger));assert.equal(map.keys.length,58);assert.equal(map.excluded.length,46);assert.equal(map.logo,'EXCLUDED');
 assert.deepEqual(map.keys.map(x=>x.key).sort(),keys(require('../data/catalog.json')).sort());
 for(const row of map.keys)for(const variant of row.variants){const m=manifest.assets[row.key][variant.variant];assert.equal(variant.destinationPath,'assets/'+m.path);assert.equal(variant.sha256,m.sha256);assert.equal(variant.runtimeStatus,'APPROVED_FOR_DRAFT');assert(fs.existsSync(variant.destinationPath));}
});
test('C03 approval, exact viewBox, 1 MiB boundary and unsafe SVG remain hard build gates',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'origin-closeout-'));try{
 const write=(content,approved=true)=>{fs.writeFileSync(path.join(dir,'a.svg'),content);fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify({version:1,assets:{'discovery.water':{'light.default':{path:'a.svg',approved}}}}));};
 const valid='<svg viewBox="0 0 64 64"></svg>';
 write(valid,false);assert.throws(()=>bundleAssets(dir,['discovery.water']),/approved/);
 write('<svg viewBox="0 0 512 512"></svg>');assert.throws(()=>bundleAssets(dir,['discovery.water']),/inert/);
 write(valid+' '.repeat(1024*1024-valid.length));assert.throws(()=>bundleAssets(dir,['discovery.water']),/1 MiB/);
 for(const payload of ['<style/>','<image/>','<use/>','<foreignObject/>','<text/>','<path onclick="x()"/>','<path href="https://example.invalid"/>']){write(valid.replace('</svg>',payload+'</svg>'));assert.throws(()=>bundleAssets(dir,['discovery.water']),/inert/);}
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
