// Scan only the proposed public index; report paths and categories, never matches.
const fs=require('node:fs'), cp=require('node:child_process');
const paths=cp.execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const rules=[
 ['credential',/(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{24,}|AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/],
 ['private host path',/\/(?:workspace|home|Users|tmp)\/[a-zA-Z0-9_-]/],
 ['private email',/[A-Za-z0-9._%+-]+@(?:gmail|naver|daum|outlook)\.[A-Za-z.]+/i],
 ['unrelated project',/INHA\s*WORLD|인덕\s*디펜스|학교\s*마스코트/],
 ['unsafe payload',/^(?:node_modules\/|\.env(?:\.|$)|.*\.(?:zip|woff2?|ttf|otf|mp4|webm|docx)$|qa\/.*\.json$)/]
];
const findings=[];for(const path of paths){const value=fs.readFileSync(path,'utf8');for(const [name,pattern]of rules){if(name==='unsafe payload'?pattern.test(path):pattern.test(value))findings.push({path,category:name});}}
console.log(JSON.stringify({filesReviewed:paths.length,findings},null,2));if(findings.length)process.exitCode=1;
