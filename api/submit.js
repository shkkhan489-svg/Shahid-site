import formidable from 'formidable';import fs from 'fs';
import {db,email,whatsapp} from './_lib.js';
export const config={api:{bodyParser:false}};
export default async function h(req,res){if(req.method!=='POST')return res.status(405).end();
 try{const [f,files]=await formidable({maxFileSize:20e6}).parse(req);const v=k=>f[k]?.[0]||'';let url='';const file=files.file?.[0];
 if(file&&file.size){const p=Date.now()+'-'+file.originalFilename.replace(/\W/g,'_');const {error}=await db.storage.from('uploads').upload(p,fs.readFileSync(file.filepath),{contentType:file.mimetype});if(!error)url=db.storage.from('uploads').getPublicUrl(p).data.publicUrl}
 const row={kind:v('type'),name:v('name'),email:v('email'),phone:v('phone'),title:v('title'),message:v('message'),file_url:url};
 await db.from('inbox').insert(row);
 const t=`New ${row.kind} message\nName: ${row.name}\nPhone: ${row.phone}\nEmail: ${row.email}\n${row.title}\n${row.message}\n${url}`;
 await Promise.allSettled([email(process.env.OWNER_EMAIL,'Website: '+row.kind,t),whatsapp(process.env.OWNER_WHATSAPP,t)]);res.json({ok:true})}
 catch(e){res.status(500).json({ok:false})}}
