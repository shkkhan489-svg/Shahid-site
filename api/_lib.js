import {createClient} from '@supabase/supabase-js';
export const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_KEY);
export async function email(to,subject,text){if(!process.env.RESEND_API_KEY)return;
 await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.RESEND_FROM,to,subject,text})})}
export async function whatsapp(to,body){const {TWILIO_SID:s,TWILIO_TOKEN:t,TWILIO_WHATSAPP_FROM:f}=process.env;if(!s)return;
 await fetch(`https://api.twilio.com/2010-04-01/Accounts/${s}/Messages.json`,{method:'POST',headers:{Authorization:'Basic '+Buffer.from(s+':'+t).toString('base64'),'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({From:f,To:to,Body:body})})}
export const isAdmin=r=>r.headers['x-admin-key']&&r.headers['x-admin-key']===process.env.ADMIN_PASSWORD;
export async function json(r){let b='';for await(const c of r)b+=c;return JSON.parse(b||'{}')}
