const SKILL_NAMES={vocabulary:'Từ vựng',kanji:'Chữ Hán',reading:'Đọc hiểu',listening:'Nghe hiểu'};
const SKILLS=Object.keys(SKILL_NAMES);
const $=id=>document.getElementById(id);
let selectedLevel='N4',run=null,tick=null;
function time(ms){let s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function shuffle(question){
  const order=question.options.map((_,i)=>i);
  for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
  return {...question,options:order.map(i=>question.options[i]),answer:order.indexOf(question.answer)};
}
function lastResult(id,skill){
  try{return JSON.parse(localStorage.getItem('jlptPracticeResultsV2')||'{}')[id+'-'+(skill||'all')]}catch{return null}
}
function saveResult(){
  try{const data=JSON.parse(localStorage.getItem('jlptPracticeResultsV2')||'{}');data[run.exam.id+'-'+(run.skill||'all')]={score:run.correct,total:run.questions.length,elapsed:run.elapsed,date:new Date().toISOString()};localStorage.setItem('jlptPracticeResultsV2',JSON.stringify(data))}catch{}
}
function renderHome(){
  $('levels').replaceChildren();
  [...new Set(PRACTICE_EXAMS.map(e=>e.level))].forEach(level=>{
    const b=document.createElement('button');b.textContent=level;b.className=level===selectedLevel?'active-filter':'';
    b.onclick=()=>{selectedLevel=level;renderHome()};$('levels').append(b);
  });
  $('cards').replaceChildren();
  PRACTICE_EXAMS.filter(e=>e.level===selectedLevel).forEach(exam=>{
    const card=document.createElement('article');card.className='card';
    const title=document.createElement('h3');title.textContent=exam.title;
    const desc=document.createElement('p');desc.className='muted';desc.textContent=exam.description;
    const chips=document.createElement('div');chips.className='chips';
    SKILLS.forEach(skill=>{const chip=document.createElement('span');chip.className='chip';chip.textContent=SKILL_NAMES[skill]+' '+exam.questions.filter(q=>q.skill===skill).length;chips.append(chip)});
    const actions=document.createElement('div');actions.className='actions';
    const all=document.createElement('button');all.className='primary';all.textContent='Làm toàn bộ đề';all.onclick=()=>start(exam,null);actions.append(all);
    SKILLS.forEach(skill=>{
      const b=document.createElement('button');b.textContent=SKILL_NAMES[skill];b.onclick=()=>start(exam,skill);actions.append(b);
    });
    const previous=lastResult(exam.id,null);
    card.append(title,desc,chips,actions);
    if(previous){const p=document.createElement('p');p.className='muted';p.textContent='Lần làm gần nhất: '+previous.score+'/'+previous.total+' · '+time(previous.elapsed);card.append(p)}
    $('cards').append(card);
  });
}
function start(exam,skill){
  const questions=exam.questions.filter(q=>!skill||q.skill===skill).map(shuffle);
  if(!questions.length)return;
  run={exam,skill,questions,answers:Array(questions.length).fill(null),index:0,started:Date.now()};
  $('home').classList.add('hidden');$('results').classList.add('hidden');$('runner').classList.remove('hidden');
  $('runTitle').textContent=exam.title;$('runInfo').textContent=skill?'Luyện riêng · '+SKILL_NAMES[skill]:'Toàn bộ 4 phần';
  clearInterval(tick);$('timer').textContent='00:00';tick=setInterval(()=>$('timer').textContent=time(Date.now()-run.started),500);
  renderQuestion();window.scrollTo({top:0,behavior:'smooth'});
}
function stopSpeech(){if('speechSynthesis' in window)speechSynthesis.cancel()}
function playAudio(script){
  if(!('speechSynthesis' in window)){alert('Trình duyệt này không hỗ trợ đọc tiếng Nhật. Hãy thử trình duyệt khác.');return}
  stopSpeech();
  const utterance=new SpeechSynthesisUtterance(script.replace(/(?:女|男)：/g,'').replace(/\n/g,'。'));
  utterance.lang='ja-JP';utterance.rate=.9;
  const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('ja'));
  if(voice)utterance.voice=voice;
  speechSynthesis.speak(utterance);
}
function renderQuestion(){
  stopSpeech();
  const q=run.questions[run.index],i=run.index;
  $('counter').textContent='Câu '+(i+1)+'/'+run.questions.length+' · '+SKILL_NAMES[q.skill];
  $('progressBar').style.width=((i+1)/run.questions.length*100)+'%';
  const content=$('content');content.replaceChildren();
  if(q.passage){const p=document.createElement('div');p.className='passage';p.textContent=q.passage;content.append(p)}
  if(q.skill==='listening'){
    const b=document.createElement('button');b.textContent='▶ Nghe đoạn hội thoại';b.onclick=()=>playAudio(q.audio);content.append(b);
    const hint=document.createElement('p');hint.className='audio-note';hint.textContent='Bấm để nghe lại. Lời thoại sẽ hiện khi chữa bài.';content.append(hint);
  }
  const title=document.createElement('div');title.className='question';title.textContent=q.prompt;content.append(title);
  const choices=document.createElement('div');choices.className='choices';
  q.options.forEach((option,n)=>{
    const label=document.createElement('label');label.className='choice';
    const input=document.createElement('input');input.type='radio';input.name='answer';input.checked=run.answers[i]===n;
    input.onchange=()=>{run.answers[i]=n};
    const span=document.createElement('span');span.textContent=String.fromCharCode(65+n)+'. '+option;
    label.append(input,span);choices.append(label);
  });
  content.append(choices);$('prev').disabled=i===0;$('next').disabled=i===run.questions.length-1;
}
$('prev').onclick=()=>{if(run.index>0){run.index--;renderQuestion()}};
$('next').onclick=()=>{if(run.index<run.questions.length-1){run.index++;renderQuestion()}};
$('quit').onclick=()=>{if(confirm('Thoát bài đang làm? Câu trả lời sẽ không được lưu.'))home()};
function home(){stopSpeech();clearInterval(tick);run=null;$('runner').classList.add('hidden');$('results').classList.add('hidden');$('home').classList.remove('hidden');renderHome();window.scrollTo({top:0,behavior:'smooth'})}
$('submit').onclick=()=>{
  const blanks=run.answers.filter(x=>x===null).length;
  if(blanks&&!confirm('Còn '+blanks+' câu chưa chọn đáp án. Bạn vẫn muốn nộp bài?'))return;
  stopSpeech();clearInterval(tick);
  run.elapsed=Date.now()-run.started;
  run.correct=run.questions.reduce((count,q,i)=>count+(run.answers[i]===q.answer?1:0),0);
  saveResult();$('runner').classList.add('hidden');$('results').classList.remove('hidden');
  $('score').textContent=run.correct+'/'+run.questions.length+' câu đúng · '+Math.round(run.correct/run.questions.length*100)+'%';
  $('duration').textContent='Thời gian làm bài: '+time(run.elapsed);
  $('review').replaceChildren();$('review').classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'});
};
$('showReview').onclick=()=>{
  const box=$('review');box.replaceChildren();
  run.questions.forEach((q,i)=>{
    const article=document.createElement('article');article.className='review';
    const title=document.createElement('h3');title.textContent='Câu '+(i+1)+' · '+SKILL_NAMES[q.skill];
    article.append(title);
    if(q.passage){const p=document.createElement('div');p.className='passage';p.textContent=q.passage;article.append(p)}
    if(q.audio){const p=document.createElement('div');p.className='passage';p.textContent='Lời thoại: '+q.audio;article.append(p)}
    const prompt=document.createElement('p');prompt.textContent=q.prompt;article.append(prompt);
    const answer=document.createElement('p');answer.className=run.answers[i]===q.answer?'good':'bad';
    answer.textContent='Bạn chọn: '+(run.answers[i]===null?'Chưa trả lời':String.fromCharCode(65+run.answers[i])+'. '+q.options[run.answers[i]]);
    const correct=document.createElement('p');correct.className='good';correct.textContent='Đáp án đúng: '+String.fromCharCode(65+q.answer)+'. '+q.options[q.answer];
    const explanation=document.createElement('p');explanation.className='muted';explanation.textContent='Giải thích: '+q.explanation;
    article.append(answer,correct,explanation);box.append(article);
  });
  box.classList.remove('hidden');box.scrollIntoView({behavior:'smooth'});
};
$('backHome').onclick=home;
const OFFICIAL_NAMES={kanji:'Chữ Hán',vocabulary:'Từ vựng',grammar:'Ngữ pháp',reading:'Đọc hiểu',listening:'Nghe hiểu'};
let official=null,officialTick=null;
function officialSections(exam){
  function numbered(prefix,answers,from,to){return Array.from({length:to-from+1},(_,i)=>({id:prefix+(from+i),number:from+i,answer:answers[from+i-1],label:prefix+' · câu '+(from+i)}))}
  const listening=exam.l.flatMap((answers,i)=>answers.map((answer,j)=>({id:'L'+(i+1)+'-'+(j+1),number:j+1,answer,label:'Nghe · 問題'+(i+1)+' · câu '+(j+1),audio:officialUrl(exam,'Q'+(i+1),'mp3')})));
  return [
    {key:'kanji',name:'Chữ Hán',file:'V',items:numbered('V',exam.v,1,exam.splitV)},
    {key:'vocabulary',name:'Từ vựng',file:'V',items:numbered('V',exam.v,exam.splitV+1,exam.v.length)},
    {key:'grammar',name:'Ngữ pháp',file:'G',items:numbered('G',exam.g,1,exam.splitG)},
    {key:'reading',name:'Đọc hiểu',file:'R',items:numbered('G',exam.g,exam.splitG+1,exam.g.length)},
    {key:'listening',name:'Nghe hiểu',file:'L',items:listening}
  ];
}
function renderOfficialHome(){
  const root=$('officialCards');root.replaceChildren();
  OFFICIAL_EXAMS.forEach(exam=>{
    const card=document.createElement('article');card.className='card';
    const title=document.createElement('h3');title.textContent=exam.title;card.append(title);
    const desc=document.createElement('p');desc.className='muted';desc.textContent=(exam.v.length+exam.g.length+exam.l.flat().length)+' câu · đề JLPT gốc · PDF + audio';card.append(desc);
    const actions=document.createElement('div');actions.className='actions';
    const all=document.createElement('button');all.className='primary';all.textContent='Làm toàn bộ đề';all.onclick=()=>startOfficial(exam,null);actions.append(all);
    officialSections(exam).forEach(section=>{const b=document.createElement('button');b.textContent=section.name+' ('+section.items.length+')';b.onclick=()=>startOfficial(exam,section.key);actions.append(b)});
    card.append(actions);root.append(card);
  });
}
function resourceLink(url,text){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.textContent=text;return a}
function startOfficial(exam,skill){
  const sections=officialSections(exam).filter(s=>!skill||s.key===skill);
  official={exam,skill,sections,answers:{},started:Date.now()};
  $('home').classList.add('hidden');$('results').classList.add('hidden');$('runner').classList.add('hidden');$('officialResults').classList.add('hidden');$('officialRunner').classList.remove('hidden');
  $('officialTitle').textContent=exam.title;$('officialInfo').textContent=skill?OFFICIAL_NAMES[skill]:'Toàn bộ đề';
  const root=$('officialSheets');root.replaceChildren();
  sections.forEach(section=>{
    const block=document.createElement('section'),title=document.createElement('h3');title.className='section-title';title.textContent=section.name+' · '+section.items.length+' câu';block.append(title);
    const links=document.createElement('div');links.className='resource-links';links.append(resourceLink(officialUrl(exam,section.file),'📄 Mở PDF '+section.name));
    if(section.key==='listening'){
      exam.l.forEach((_,i)=>{
        const url=officialUrl(exam,'Q'+(i+1),'mp3');
        links.append(resourceLink(url,'🔊 Audio 問題'+(i+1)));
      });
    }
    block.append(links);
    if(section.key==='listening')exam.l.forEach((_,i)=>{
      const wrap=document.createElement('div');wrap.className='audio-note';
      const name=document.createElement('strong');name.textContent='問題'+(i+1)+' · '+exam.l[i].length+' câu';
      const player=document.createElement('audio');player.controls=true;player.preload='none';player.src=officialUrl(exam,'Q'+(i+1),'mp3');
      wrap.append(name,document.createElement('br'),player);block.append(wrap);
    });
    const grid=document.createElement('div');grid.className='answer-grid';
    section.items.forEach(item=>{
      const cell=document.createElement('div');cell.className='answer-cell';const strong=document.createElement('strong');strong.textContent=item.label;cell.append(strong);
      for(let n=1;n<=4;n++){
        const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name=item.id;input.value=n;
        input.onchange=()=>official.answers[item.id]=n;label.append(input,document.createTextNode(String(n)));cell.append(label);
      }
      grid.append(cell);
    });block.append(grid);root.append(block);
  });
  clearInterval(officialTick);$('officialTimer').textContent='00:00';officialTick=setInterval(()=>$('officialTimer').textContent=time(Date.now()-official.started),500);
  window.scrollTo({top:0,behavior:'smooth'});
}
function officialHome(){clearInterval(officialTick);official=null;$('officialRunner').classList.add('hidden');$('officialResults').classList.add('hidden');$('home').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
$('officialExit').onclick=()=>{if(confirm('Thoát đề đang làm? Câu trả lời sẽ không được lưu.'))officialHome()};
$('officialBack').onclick=officialHome;
$('officialSubmit').onclick=()=>{
  const items=official.sections.flatMap(s=>s.items),blank=items.filter(item=>!official.answers[item.id]).length;
  if(blank&&!confirm('Còn '+blank+' câu chưa trả lời. Bạn vẫn muốn nộp bài?'))return;
  clearInterval(officialTick);official.elapsed=Date.now()-official.started;
  const correct=items.filter(item=>official.answers[item.id]===item.answer).length;
  $('officialRunner').classList.add('hidden');$('officialResults').classList.remove('hidden');
  $('officialScore').textContent=correct+'/'+items.length+' câu đúng · '+Math.round(correct/items.length*100)+'%';
  $('officialDuration').textContent='Thời gian làm bài: '+time(official.elapsed);
  const review=$('officialReview');review.replaceChildren();
  const links=document.createElement('div');links.className='resource-links';links.append(resourceLink(officialUrl(official.exam,'answer'),'Xem bảng đáp án chính thức'),resourceLink(officialUrl(official.exam,'script'),'Xem lời thoại nghe'));review.append(links);
  const mistakes=items.filter(item=>official.answers[item.id]!==item.answer);
  const summary=document.createElement('p');summary.textContent=mistakes.length?'Các câu cần xem lại trong PDF:':'Bạn đã trả lời đúng tất cả.';review.append(summary);
  mistakes.forEach(item=>{const p=document.createElement('p');p.className='review';p.textContent=item.label+' · Bạn chọn: '+(official.answers[item.id]||'bỏ trống')+' · Đáp án: '+item.answer;review.append(p)});
  window.scrollTo({top:0,behavior:'smooth'});
};
renderHome();renderOfficialHome();
