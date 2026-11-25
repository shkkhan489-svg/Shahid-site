import {db,json} from './_lib.js';
export const config={api:{bodyParser:false}};
export default async function h(req,res){
 if(req.method==='POST'){const b=await json(req);
  if(b.action==='like')await db.from('likes').insert({post_id:b.post_id});
  if(b.action==='comment'&&b.body)await db.from('comments').insert({post_id:b.post_id,name:(b.name||'Guest').slice(0,60),body:b.body.slice(0,1000)});
  return res.json({ok:true})}
 const {data:posts}=await db.from('posts').select('*').order('created_at',{ascending:false});
 const {data:cm}=await db.from('comments').select('post_id,name,body').eq('approved',true);
 const {data:lk}=await db.from('likes').select('post_id').eq('approved',true);
 res.json({posts:(posts||[]).map(p=>({...p,comments:(cm||[]).filter(c=>c.post_id==p.id),likes:(lk||[]).filter(l=>l.post_id==p.id).length}))})}
