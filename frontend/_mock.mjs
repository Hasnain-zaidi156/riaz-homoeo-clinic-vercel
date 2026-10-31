import http from 'node:http'
import sharp from 'sharp'
const big = await sharp({create:{width:3000,height:2000,channels:4,background:{r:200,g:40,b:40,alpha:1}}}).png().toBuffer()
const jpg = await sharp({create:{width:2400,height:1800,channels:3,background:{r:30,g:90,b:160}}}).jpeg({quality:95}).toBuffer()
const P=`http://localhost:3999`
http.createServer((q,s)=>{
  const j=o=>{s.setHeader('content-type','application/json');s.end(JSON.stringify(o))}
  if(q.url==='/api/products')return j([{_id:'a1',id:1,name:'A',price:100,img:P+'/api/media/m1/file'},{_id:'a2',id:2,name:'B',price:200,img:'https://example.invalid/x.png',imgs:[P+'/api/media/m2/file']}])
  if(q.url==='/api/settings')return j({logoImg:'/api/media/m1/file',doctorLeftImg:'/api/media/m2/file',aboutText:''})
  if(q.url==='/api/gallery')return j([{url:'/api/media/m2/file',alt:'Certificate'},{url:'/api/media/v/file',alt:'vid',isVideo:true}])
  if(q.url==='/api/media/m1/file'){s.setHeader('content-type','image/png');return s.end(big)}
  if(q.url==='/api/media/m2/file'){s.setHeader('content-type','image/jpeg');return s.end(jpg)}
  s.statusCode=404;s.end()
}).listen(3999)
