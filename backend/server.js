require('dotenv').config();
const express=require('express'),mongoose=require('mongoose'),jwt=require('jsonwebtoken'),cors=require('cors'),path=require('path');
if(!process.env.JWT_SECRET){console.error('Set JWT_SECRET in .env');process.exit(1)}
const app=express();app.set('trust proxy',1);app.use('/api/admin/media',express.json({limit:'8mb'}));app.use(cors(process.env.CLIENT_URL?{origin:process.env.CLIENT_URL.split(',')}:undefined),express.json({limit:'1mb'}));
app.use((q,s,n)=>boot().then(()=>n(),e=>s.status(500).json({error:e.message})));/* Vercel: DB connect + seed pehle ho jaye */
const S=o=>new mongoose.Schema(o,{timestamps:true});
const P=mongoose.model('Product',S({id:Number,cat:String,name:String,nameUr:String,desc:String,descUr:String,price:Number,img:String,imgs:[String],video:String,stock:{type:Boolean,default:true}}));
const O=mongoose.model('Order',S({name:String,phone:String,address:String,items:[{name:String,qty:Number,price:Number}],subtotal:Number,delivery:Number,total:Number,status:{type:String,default:'new'}}));
const A=mongoose.model('Appointment',S({name:String,phone:String,date:String,token:Number,note:String,status:{type:String,default:'booked'}}));
const ST=mongoose.model('Setting',S({site:{type:String,default:'site',unique:true},logoImg:String,doctorLeftImg:String,doctorRightImg:String,doctorAboutImg:String,featuredVideo:String,aboutSeed:Boolean,priceSeed:Boolean}));
/* Media library: website gallery + admin uploads. Image ya to external URL (src) hoti hai ya DB mein (data) save hoti hai.
   show=true => website ki Gallery mein nazar aati hai. */
const MD=mongoose.model('Media',S({name:String,alt:String,src:String,data:Buffer,contentType:String,size:Number,show:{type:Boolean,default:true},pos:{type:Number,default:0}}));
const mediaUrl=m=>m.src||'/api/media/'+m._id+'/file';
const mediaOut=m=>({_id:m._id,name:m.name||'',alt:m.alt||'',url:mediaUrl(m),hosted:!m.src,show:m.show!==false,size:m.size||0,createdAt:m.createdAt});
const DELIVERY=500,ah=f=>(q,s,n)=>f(q,s,n).catch(e=>s.status(500).json({error:e.message}));
const ok=(v,m=200)=>typeof v==='string'&&v.trim()&&v.length<=m;
const auth=(q,s,n)=>{try{jwt.verify((q.headers.authorization||'').slice(7),process.env.JWT_SECRET);n()}catch{s.status(401).json({error:'Unauthorized'})}};

app.get('/',(q,s)=>s.json({ok:true,service:'riaz-homoeo-clinic-api'}));
app.get('/api/products',ah(async(q,s)=>s.json(await P.find().sort('id'))));
app.get('/api/gallery',ah(async(q,s)=>{
  const rows=await MD.find({show:{$ne:false}}).select('-data').sort('pos createdAt');
  s.json(rows.map(m=>({url:mediaUrl(m),alt:m.alt||m.name||'Gallery'})));
}));
app.get('/api/media/:id/file',ah(async(q,s)=>{
  if(!mongoose.isValidObjectId(q.params.id))return s.sendStatus(404);
  const m=await MD.findById(q.params.id).select('data contentType src');
  if(!m)return s.sendStatus(404);
  if(m.src)return s.redirect(m.src);
  s.set({'Content-Type':m.contentType||'image/jpeg','Cache-Control':'public, max-age=31536000, s-maxage=31536000, immutable','Cross-Origin-Resource-Policy':'cross-origin'});
  s.send(m.data);
}));
app.get('/api/settings',ah(async(q,s)=>s.json(await ST.findOne({site:'site'})||{site:'site'})));
/* Comments: ab product cards par nahi — website par ek alag (bulk) Comments section hai.
   Comment ka cid=0 => bulk section. Purane product comments DB mein rehte hain, sirf admin dekh/delete kar sakta hai. */
const CM=mongoose.model('Comment',S({cid:Number,_id:Number,name:String,text:String}));
const lastPost=new Map(); // simple spam guard: ek IP se 20 second mein 1 comment
app.get('/api/bulk-comments',ah(async(q,s)=>s.json(await CM.find({cid:0}).sort('-_id').limit(100))));
app.post('/api/bulk-comments',ah(async(q,s)=>{
  if(!ok(q.body&&q.body.name,40)||!ok(q.body.text,300))return s.status(400).json({error:'Naam aur text dono chahiye'});
  const now=Date.now(),prev=lastPost.get(q.ip)||0;
  if(now-prev<20000)return s.status(429).json({error:'Thori der baad dobara likhein'});
  lastPost.set(q.ip,now);if(lastPost.size>5000)lastPost.clear();
  const l=await CM.findOne().sort('-_id');
  s.json(await CM.create({_id:l?l._id+1:1,cid:0,name:String(q.body.name).trim().slice(0,40),text:String(q.body.text).trim().slice(0,300)}));
}));

app.post('/api/orders',ah(async(q,s)=>{
 const{name,phone,address,items}=q.body;
 if(!ok(name,60)||!ok(phone,20)||!Array.isArray(items)||!items.length)return s.status(400).json({error:'Invalid order'});
 const rows=[];
 for(const i of items){if(!mongoose.isValidObjectId(i._id))continue;const p=await P.findById(i._id);if(p)rows.push({name:p.name,qty:Math.min(99,Math.max(1,parseInt(i.qty)||1)),price:p.price})}
 if(!rows.length)return s.status(400).json({error:'No valid items'});
 const subtotal=rows.reduce((a,r)=>a+r.price*r.qty,0);
 s.json(await O.create({name,phone,address:String(address||'').slice(0,300),items:rows,subtotal,delivery:DELIVERY,total:subtotal+DELIVERY}));
}));

app.post('/api/appointments',ah(async(q,s)=>{
 const{name,phone,date,note}=q.body;
 if(!ok(name,60)||!ok(phone,20)||!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return s.status(400).json({error:'Invalid details'});
 if(new Date(date+'T00:00:00').getDay()===5)return s.status(400).json({error:'friday'});
 const last=await A.findOne({date}).sort('-token');
 s.json(await A.create({name,phone,date,note:String(note||'').slice(0,300),token:(last?last.token:0)+1}));
}));

app.post('/api/login',(q,s)=>{const{user,pass}=q.body;
 if(user&&user===process.env.ADMIN_USER&&pass===process.env.ADMIN_PASS)return s.json({token:jwt.sign({u:user},process.env.JWT_SECRET,{expiresIn:'12h'})});
 s.status(401).json({error:'Wrong username or password'})});

const r=express.Router();r.use(auth);
const upd=M=>ah(async(q,s)=>s.json(await M.findByIdAndUpdate(q.params.id,{status:q.body.status},{new:true})));
r.get('/orders',ah(async(q,s)=>s.json(await O.find().sort('-createdAt').limit(200))));
r.patch('/orders/:id',upd(O));
r.get('/appointments',ah(async(q,s)=>s.json(await A.find().sort('-date token').limit(300))));
r.patch('/appointments/:id',upd(A));
r.post('/products',ah(async(q,s)=>{const l=await P.findOne().sort('-id');s.json(await P.create({...q.body,id:(l?l.id:0)+1}))}));
r.put('/products/:id',ah(async(q,s)=>s.json(await P.findByIdAndUpdate(q.params.id,q.body,{new:true}))));
r.delete('/products/:id',ah(async(q,s)=>{await P.findByIdAndDelete(q.params.id);s.json({ok:1})}));
/* Admin: site images (logo / hero / about) — + picker se badli jati hain */
r.get('/settings',ah(async(q,s)=>s.json(await ST.findOne({site:'site'})||{site:'site'})));
r.put('/settings',ah(async(q,s)=>{
  const b=q.body||{},set={};
  ['logoImg','doctorLeftImg','doctorRightImg','doctorAboutImg'].forEach(k=>{if(typeof b[k]==='string')set[k]=b[k].trim().slice(0,600)});
  s.json(await ST.findOneAndUpdate({site:'site'},{$set:set},{upsert:true,new:true,setDefaultsOnInsert:true}));
}));
/* Admin: saare comments dekhna / delete karna */
r.get('/comments',ah(async(q,s)=>{
  const rows=await CM.find().sort('-_id').limit(500).lean();
  const prods=await P.find({id:{$in:[...new Set(rows.map(c=>c.cid).filter(Boolean))]}}).select('id name').lean();
  const nm=Object.fromEntries(prods.map(p=>[p.id,p.name]));
  s.json(rows.map(c=>({...c,product:c.cid?(nm[c.cid]||'Product #'+c.cid):null})));
}));
r.delete('/comments/:id',ah(async(q,s)=>{
  const id=Number(q.params.id);if(!Number.isInteger(id))return s.status(400).json({error:'Bad id'});
  await CM.deleteOne({_id:id});s.json({ok:1});
}));
/* Admin: media library (+ button) — upload, gallery se select, website par show/hide */
r.get('/media',ah(async(q,s)=>s.json((await MD.find().select('-data').sort('pos createdAt')).map(mediaOut))));
r.post('/media',ah(async(q,s)=>{
  const m=/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(String(q.body&&q.body.dataUrl||''));
  if(!m)return s.status(400).json({error:'Sirf JPG, PNG, WEBP ya GIF image upload karein'});
  const buf=Buffer.from(m[2],'base64');
  if(!buf.length||buf.length>5*1024*1024)return s.status(400).json({error:'Image 5MB se choti honi chahiye'});
  const l=await MD.findOne().sort('-pos').select('pos');
  const name=String(q.body.name||'image').slice(0,80);
  const d=await MD.create({name,alt:String(q.body.alt||name.replace(/\.[^.]+$/,'')).slice(0,80),data:buf,contentType:m[1],size:buf.length,show:q.body.show!==false,pos:(l?l.pos:0)+1});
  s.json(mediaOut(d));
}));
r.patch('/media/:id',ah(async(q,s)=>{
  const set={};if(typeof q.body.show==='boolean')set.show=q.body.show;if(typeof q.body.alt==='string')set.alt=q.body.alt.slice(0,80);
  const d=await MD.findByIdAndUpdate(q.params.id,{$set:set},{new:true}).select('-data');
  d?s.json(mediaOut(d)):s.sendStatus(404);
}));
r.delete('/media/:id',ah(async(q,s)=>{await MD.findByIdAndDelete(q.params.id);s.json({ok:1})}));
app.use('/api/admin',r);

let ready;
function boot(){
 if(!ready)ready=mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/riaz-clinic').then(async()=>{
 const ALT=['Clinic Front','Dr. Fawad','Homoeopathy','DXN Range','Herbal Meds','Certificate','Certificate','Certificate','Certificate','Certificate','Certificate','Trophy','Trophy'];
 if(!await MD.countDocuments())await MD.insertMany(require('./gallery.json').map((src,i)=>({src,name:ALT[i]||'Gallery',alt:ALT[i]||'Gallery',show:true,pos:i+1})));
 /* One-time (v18): About image set + saare clinic products ki price 3500. Baad mein admin jo badle woh barqarar rehta hai. */
 const st=await ST.findOne({site:'site'});
 if(!st||!st.aboutSeed)await ST.findOneAndUpdate({site:'site'},{$set:{doctorAboutImg:'https://i.ibb.co/PZvDc5qS/image.png',aboutSeed:true}},{upsert:true,setDefaultsOnInsert:true});
 if(!st||!st.priceSeed){await P.updateMany({cat:'clinic'},{$set:{price:3500}});await ST.updateOne({site:'site'},{$set:{priceSeed:true}})}
 const seed=require('./products.json');
 if(!await P.countDocuments())await P.insertMany(seed);
 else{
  for(const p of seed)if(p.imgs)await P.updateOne({id:p.id,imgs:{$exists:false}},{$set:{imgs:p.imgs}});
  const f=seed.find(p=>p.id===1000); // Featured product: purane database mein na ho to add kar do
  if(f&&!await P.findOne({id:1000}))await P.create(f);
 }
}).catch(e=>{ready=null;throw e});
 return ready;
}
/* Local: node server.js  |  Vercel: api/index.js is app ko export se use karta hai */
if(require.main===module){boot().then(()=>{
 const port=process.env.PORT||3000;const srv=app.listen(port,()=>console.log('http://localhost:'+port));
 srv.on('error',e=>{
   if(e && e.code==='EADDRINUSE'){
     console.log('=========================================================');
     console.log('Port '+port+' BUSY hai - purana server abhi chal raha hai.');
     console.log('Pehle usay band karein (PowerShell):');
     console.log('  Stop-Process -Id (Get-NetTCPConnection -LocalPort '+port+' -State Listen).OwningProcess -Force');
     console.log('ya CMD:');
     console.log('  netstat -ano | findstr :'+port+'    phir    taskkill /PID <PID> /F');
     console.log('=========================================================');
     process.exit(1);
   }
   console.error(e);
 });
}).catch(e=>{console.error(e);process.exit(1)})}
module.exports=app;
