const BASE='https://api.tts.quest/v3/voicevox/synthesis';
module.exports=async function handler(req,res){
  const text=typeof req.query.text==='string'?req.query.text.trim():'';
  if(req.method!=='GET'){res.statusCode=405;return res.end('Method not allowed')}
  if(!text||text.length>400){res.statusCode=400;return res.end('Invalid text')}
  try{
    const result=await fetch(BASE+'?speaker=1&text='+encodeURIComponent(text),{signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)throw Error('Synthesis unavailable');return r.json()});
    if(!result.success||!/^https:\/\/audio[1-9]\.tts\.quest\//.test(result.audioStatusUrl)||!/^https:\/\/audio[1-9]\.tts\.quest\//.test(result.mp3DownloadUrl))throw Error('Invalid synthesis response');
    let ready=false;
    for(let i=0;i<18;i++){
      const status=await fetch(result.audioStatusUrl,{signal:AbortSignal.timeout(6000)}).then(r=>r.json());
      if(status.isAudioReady){ready=true;break}
      if(status.isAudioError)throw Error('Synthesis failed');
      await new Promise(resolve=>setTimeout(resolve,1000));
    }
    if(!ready)throw Error('Synthesis timed out');
    const audio=await fetch(result.mp3DownloadUrl,{signal:AbortSignal.timeout(12000)});
    if(!audio.ok||!audio.headers.get('content-type')?.includes('audio'))throw Error('Audio unavailable');
    const bytes=Buffer.from(await audio.arrayBuffer());
    if(bytes.length>2_000_000)throw Error('Audio too large');
    res.setHeader('Content-Type','audio/mpeg');res.setHeader('Cache-Control','public, s-maxage=86400, stale-while-revalidate=604800');res.statusCode=200;res.end(bytes);
  }catch(error){res.statusCode=502;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:error.message}))}
};
