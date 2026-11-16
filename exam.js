const SKILL_NAMES={vocabulary:'Từ vựng',kanji:'Chữ Hán',grammar:'Ngữ pháp',reading:'Đọc hiểu',listening:'Nghe hiểu'};
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
    const desc=document.createElement('p');desc.className='muted';desc.textContent=exam.questions.length+' câu · 5 phần · làm và chữa trên web';
    const chips=document.createElement('div');chips.className='chips';
    SKILLS.forEach(skill=>{const count=exam.questions.filter(q=>q.skill===skill).length;if(!count)return;const chip=document.createElement('span');chip.className='chip';chip.textContent=SKILL_NAMES[skill]+' '+count;chips.append(chip)});
    const actions=document.createElement('div');actions.className='actions';
    const all=document.createElement('button');all.className='primary';all.textContent='Làm toàn bộ đề';all.onclick=()=>start(exam,null);actions.append(all);
    SKILLS.forEach(skill=>{
      const count=exam.questions.filter(q=>q.skill===skill).length;if(!count)return;
      const b=document.createElement('button');b.textContent=SKILL_NAMES[skill]+' ('+count+')';b.onclick=()=>start(exam,skill);actions.append(b);
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
  const sections=(skill?[skill]:SKILLS).filter(name=>questions.some(q=>q.skill===name));
  run={exam,skill,questions,sections,answers:Array(questions.length).fill(null),sectionIndex:0,started:Date.now()};
  $('home').classList.add('hidden');$('results').classList.add('hidden');$('runner').classList.remove('hidden');
  $('runTitle').textContent=exam.title;$('runInfo').textContent=skill?'Luyện riêng · '+SKILL_NAMES[skill]:'Toàn bộ '+SKILLS.length+' phần';
  clearInterval(tick);$('timer').textContent='00:00';tick=setInterval(()=>$('timer').textContent=time(Date.now()-run.started),500);
  renderSection();window.scrollTo({top:0,behavior:'smooth'});
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
function updateProgress(){
  const answered=run.answers.filter(x=>x!==null).length;
  $('counter').textContent=answered+'/'+run.questions.length+' câu đã trả lời';
  $('progressBar').style.width=(answered/run.questions.length*100)+'%';
  [...$('skillTabs').children].forEach((button,index)=>{
    const name=run.sections[index],indexes=run.questions.flatMap((q,i)=>q.skill===name?[i]:[]);
    button.textContent=SKILL_NAMES[name]+' · '+indexes.filter(i=>run.answers[i]!==null).length+'/'+indexes.length;
  });
}
function renderSection(){
  stopSpeech();
  const skill=run.sections[run.sectionIndex],items=run.questions.flatMap((q,i)=>q.skill===skill?[{q,i}]:[]);
  $('sectionHeading').textContent=SKILL_NAMES[skill]+' · '+items.length+' câu';
  const tabs=$('skillTabs');tabs.replaceChildren();
  run.sections.forEach((name,index)=>{
    const button=document.createElement('button');button.type='button';button.className=index===run.sectionIndex?'current':'';
    button.setAttribute('aria-current',index===run.sectionIndex?'step':'false');
    button.onclick=()=>{run.sectionIndex=index;renderSection();window.scrollTo({top:0,behavior:'smooth'})};tabs.append(button);
  });
  const content=$('content');content.replaceChildren();
  let previousPassage=null;
  items.forEach(({q,i},localIndex)=>{
    const block=document.createElement('article');block.className='question-block';
    const number=document.createElement('div');number.className='question-number';number.textContent='Câu '+(localIndex+1);
    block.append(number);
    if(q.passage&&q.passage!==previousPassage){const p=document.createElement('div');p.className='passage';p.textContent=q.passage;block.append(p)}
    previousPassage=q.passage||null;
    if(q.skill==='listening'){
      const b=document.createElement('button');b.type='button';b.textContent='▶ Nghe đoạn hội thoại';b.onclick=()=>playAudio(q.audio);block.append(b);
      const hint=document.createElement('p');hint.className='audio-note';hint.textContent='Bấm để nghe lại. Lời thoại sẽ hiện khi chữa bài.';block.append(hint);
    }
    const title=document.createElement('div');title.className='question';title.textContent=q.prompt;block.append(title);
    const choices=document.createElement('div');choices.className='choices';
    q.options.forEach((option,n)=>{
      const label=document.createElement('label');label.className='choice';
      const input=document.createElement('input');input.type='radio';input.name='answer-'+i;input.checked=run.answers[i]===n;
      input.onchange=()=>{run.answers[i]=n;updateProgress()};
      const span=document.createElement('span');span.textContent=String.fromCharCode(65+n)+'. '+option;
      label.append(input,span);choices.append(label);
    });
    block.append(choices);content.append(block);
  });
  $('prev').disabled=run.sectionIndex===0;$('next').disabled=run.sectionIndex===run.sections.length-1;
  $('prev').textContent=run.sectionIndex?'← '+SKILL_NAMES[run.sections[run.sectionIndex-1]]:'← Kỹ năng trước';
  $('next').textContent=run.sectionIndex<run.sections.length-1?SKILL_NAMES[run.sections[run.sectionIndex+1]]+' →':'Kỹ năng tiếp →';
  updateProgress();
}
$('prev').onclick=()=>{if(run.sectionIndex>0){run.sectionIndex--;renderSection();window.scrollTo({top:0,behavior:'smooth'})}};
$('next').onclick=()=>{if(run.sectionIndex<run.sections.length-1){run.sectionIndex++;renderSection();window.scrollTo({top:0,behavior:'smooth'})}};
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
renderHome();
