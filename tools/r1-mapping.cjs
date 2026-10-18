// Derive mapping from actual manifest and verified source ledger, never from labels.
function mapping(manifest, ledger) {
 return {
  schema:'origin-lab.asset-mapping.r1',
  keys:Object.entries(manifest.assets).map(([key,variants])=>{
   const record=ledger.records.find(x=>x.key===key);
   return {key,sourceRightsStatus:record.sourceRightsStatus,rightsStatus:record.rightsStatus,
    variants:Object.entries(variants).map(([variant,entry])=>({variant,
     sourcePath:ledger.files.find(x=>x.path===entry.path).sourcePath,
     destinationPath:'assets/'+entry.path,sha256:entry.sha256,
     runtimeStatus:'APPROVED_FOR_DRAFT',missing:false}))};
  }),
  excluded:ledger.records.filter(x=>!x.runtimeSupported).map(x=>x.key),logo:'EXCLUDED'
 };
}
module.exports={mapping};
