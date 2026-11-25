import formidable from 'formidable';import fs from 'fs';
import {db,email,whatsapp,isAdmin,json} from './_lib.js';
export const config={api:{bodyParser:false}};
export default async function h(req,res){if(!isAdmin(req))return res.status(401).json({error:'auth'});
 if(req.method==='GET'){const q=async(t,w)=>(await db.from(t).select('*').match(w).order('created_at',{ascending:false})).data;
  return res.json({comments:await q('comments',{approved:false}),likes:await q('likes',{approved:false}),inbox:await q('inbox',{})})}
 const ct=req.headers['content-type']||'';
 if(ct.startsWith('multipart')){const [f,files]=await formidable({maxFileSize:100e6}).parse(req);const v=k=>f[k]?.[0]||'';const media=[];
  for(const x of files.media||[]){const p=Date.now()+'-'+x.originalFilename.replace(/\W/g,'_');await db.storage.from('uploads').upload(p,fs.readFileSync(x.filepath),{contentType:x.mimetype});media.push(db.storage.from('uploads').getPublicUrl(p).data.publicUrl)}
  if(v('contentKey')){await db.from('site_content').upsert({key:v('contentKey'),value:media[0]||''});return res.json({ok:true})}
  const post={kind:v('kind')||'post',title:v('title'),body:v('body'),media};await db.from('posts').insert(post);
  if(v('social')&&process.env.SOCIAL_WEBHOOK_URL)await fetch(process.env.SOCIAL_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(post)});
  return res.json({ok:true})}
 const b=await json(req);
 if(b.action==='setcontent')await db.from('site_content').upsert({key:b.key,value:b.value});
 if(b.action==='approve')await db.from(b.table).update({approved:true}).eq('id',b.id);
 if(b.action==='delete')await db.from(b.table).delete().eq('id',b.id);
 if(b.action==='reply'){const {data}=await db.from('inbox').select('*').eq('id',b.id).single();
  if(data.email)await email(data.email,'Reply from Shahid Khan',b.text);
  if(data.phone)await whatsapp('whatsapp:'+data.phone.replace(/[^\d+]/g,''),b.text);
  await db.from('inbox').update({replied:true}).eq('id',b.id)}
 res.json({ok:true})}
