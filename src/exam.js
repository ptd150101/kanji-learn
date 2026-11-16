const SKILL_NAMES={vocabulary:'Từ vựng',kanji:'Chữ Hán',grammar:'Ngữ pháp',reading:'Đọc hiểu',listening:'Nghe hiểu'};
const SKILLS=Object.keys(SKILL_NAMES);
const $=id=>document.getElementById(id);
let selectedLevel='N4',run=null,tick=null;
function time(ms){let s=Math.max(0,Math.floor(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function durationFor(questions,level){return questions.reduce((sum,q)=>sum+((level==='N4'?90:75)+(q.skill==='reading'?45:0)+(q.skill==='listening'?15:0))*1000,0)}
function subset(exam,skills){return exam.questions.filter(q=>skills.includes(q.skill))}
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
    const card=document.createElement('button');card.type='button';card.className='card exam-card';
    card.setAttribute('aria-label','Chọn '+exam.title+', '+exam.questions.length+' câu');
    card.onclick=()=>openExamDialog(exam);
    const level=document.createElement('span');level.className='exam-level';level.textContent=exam.level+' · ĐỀ LUYỆN';
    const title=document.createElement('span');title.className='exam-card-title';title.textContent=exam.title;
    const desc=document.createElement('span');desc.className='exam-card-desc';desc.textContent=exam.questions.length+' câu · '+time(durationFor(exam.questions,exam.level)); 
    const affordance=document.createElement('span');affordance.className='exam-card-arrow';affordance.setAttribute('aria-hidden','true');affordance.textContent='↗';
    const previous=lastResult(exam.id,null);
    card.append(level,title,desc,affordance);
    if(previous){const p=document.createElement('span');p.className='exam-last';p.textContent='Lần gần nhất: '+previous.score+'/'+previous.total+' · '+time(previous.elapsed);card.append(p)}
    $('cards').append(card);
  });
}
let selectedExam=null;
function openExamDialog(exam){
  selectedExam=exam;$('dialogTitle').textContent=exam.title;
  $('dialogSummary').textContent=exam.questions.length+' câu trong '+SKILLS.filter(skill=>exam.questions.some(q=>q.skill===skill)).length+' phần · Thời gian toàn đề '+time(durationFor(exam.questions,exam.level));
  const choices=$('dialogSkills');choices.replaceChildren();
  SKILLS.forEach(skill=>{
    const count=exam.questions.filter(q=>q.skill===skill).length;if(!count)return;
    const label=document.createElement('label');label.className='skill-check';
    const input=document.createElement('input');input.type='checkbox';input.value=skill;input.checked=true;
    const name=document.createElement('span');name.className='skill-check-name';name.textContent=SKILL_NAMES[skill];
    const number=document.createElement('span');number.className='skill-check-count';number.textContent=count+' câu';
    label.append(input,name,number);choices.append(label);
  });
  const update=()=>{const checked=[...choices.querySelectorAll('input:checked')];$('dialogStart').disabled=!checked.length;
    const questions=subset(exam,checked.map(input=>input.value));
    $('dialogCount').textContent=checked.length+' phần · '+questions.length+' câu · '+time(durationFor(questions,exam.level)); 
  };
  choices.onchange=update;update();$('examDialog').showModal();
}
$('dialogClose').onclick=()=>$('examDialog').close();
$('examDialog').addEventListener('click',event=>{
  const rect=event.currentTarget.getBoundingClientRect();
  if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.currentTarget.close();
});
$('dialogStart').onclick=()=>{
  const skills=[...$('dialogSkills').querySelectorAll('input:checked')].map(input=>input.value);
  if(!selectedExam||!skills.length)return;
  $('examDialog').close();start(selectedExam,skills);
};
function start(exam,selectedSkills){
  const questions=exam.questions.filter(q=>selectedSkills.includes(q.skill)).map(shuffle);
  if(!questions.length)return;
  const sections=SKILLS.filter(name=>selectedSkills.includes(name)&&questions.some(q=>q.skill===name));
  const skill=sections.length===SKILLS.length?null:sections.join('+');
  const duration=durationFor(questions,exam.level);
  run={exam,skill,questions,sections,answers:Array(questions.length).fill(null),sectionIndex:0,started:Date.now(),duration};
  $('home').classList.add('hidden');$('results').classList.add('hidden');$('runner').classList.remove('hidden');
  $('runTitle').textContent=exam.title;$('runInfo').textContent=sections.map(name=>SKILL_NAMES[name]).join(' · ');
  clearInterval(tick);$('timeBudget').textContent='Tổng thời gian: '+time(duration);
  updateTimer();tick=setInterval(updateTimer,500);
  renderSection();window.scrollTo({top:0,behavior:'smooth'});
}
function updateTimer(){
  if(!run)return;const remaining=run.duration-(Date.now()-run.started);
  $('timer').textContent=time(remaining);$('timer').classList.toggle('urgent',remaining<60000);
  if(remaining<=0)submitRun(true);
}
function stopSpeech(){if('speechSynthesis' in window)speechSynthesis.cancel()}
const audioCache=new Map();
async function prepareAudio(q,player,button,status,fallback){
  button.disabled=true;status.textContent='Đang tạo âm thanh tiếng Nhật…';
  try{
    let url=audioCache.get(q.audio);
    if(!url){
      const script=q.audio.replace(/(?:女|男)：/g,'').replace(/\n/g,'。');
      const response=await fetch('/api/tts?text='+encodeURIComponent(script));
      if(!response.ok)throw Error('Dịch vụ âm thanh không phản hồi');
      const blob=await response.blob();
      if(!blob.type.includes('audio')||blob.size<1000)throw Error('Tệp âm thanh không hợp lệ');
      url=URL.createObjectURL(blob);audioCache.set(q.audio,url);
    }
    player.src=url;player.classList.remove('hidden');button.classList.add('hidden');
    status.textContent='Có thể tạm dừng, tua và nghe lại câu này.';
    player.load();player.play().catch(()=>{status.textContent='Âm thanh đã sẵn sàng. Bấm nút phát để nghe và tua.'});
  }catch(error){
    player.classList.add('hidden');button.classList.add('hidden');fallback.classList.remove('hidden');
    status.textContent='Chưa tải được MP3. Dùng giọng đọc của trình duyệt để nghe lại.';
  }finally{button.disabled=false}
}
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
  $('questionNav').querySelectorAll('[data-question]').forEach(button=>{
    const i=Number(button.dataset.question);button.classList.toggle('answered',run.answers[i]!==null);
    button.setAttribute('aria-label',SKILL_NAMES[run.questions[i].skill]+' câu '+button.textContent+(run.answers[i]===null?' chưa làm':' đã làm'));
  });
  [...$('skillTabs').children].forEach((button,index)=>{
    const name=run.sections[index],indexes=run.questions.flatMap((q,i)=>q.skill===name?[i]:[]);
    button.textContent=SKILL_NAMES[name]+' · '+indexes.filter(i=>run.answers[i]!==null).length+'/'+indexes.length;
  });
}
function questionStem(q){
  const node=document.createElement('div');node.className='question';
  if(q.kanjiSentence){
    const [before,target,after]=q.kanjiSentence.split(/[【】]/);
    node.append(document.createTextNode(before));const u=document.createElement('u');u.textContent=target;node.append(u,document.createTextNode(after));
  }else node.textContent=q.prompt;
  return node;
}
function renderSection(){
  stopSpeech();document.querySelectorAll('.audio-player').forEach(player=>player.pause());
  const skill=run.sections[run.sectionIndex],items=run.questions.flatMap((q,i)=>q.skill===skill?[{q,i}]:[]);
  $('sectionHeading').textContent=SKILL_NAMES[skill]+' · '+items.length+' câu';
  const tabs=$('skillTabs');tabs.replaceChildren();
  run.sections.forEach((name,index)=>{
    const button=document.createElement('button');button.type='button';button.className=index===run.sectionIndex?'current':'';
    button.setAttribute('aria-current',index===run.sectionIndex?'step':'false');
    button.onclick=()=>{run.sectionIndex=index;renderSection();window.scrollTo({top:0,behavior:'smooth'})};tabs.append(button);
  });
  renderQuestionNav();
  const content=$('content');content.replaceChildren();
  let previousPassage=null;
  items.forEach(({q,i},localIndex)=>{
    const block=document.createElement('article');block.className='question-block';block.id='exam-q-'+i;
    const number=document.createElement('div');number.className='question-number';number.textContent='Câu '+(localIndex+1);
    block.append(number);
    if(q.passage&&q.passage!==previousPassage){const p=document.createElement('div');p.className='passage';p.textContent=q.passage;block.append(p)}
    previousPassage=q.passage||null;
    if(q.skill==='listening'){
      const status=document.createElement('p');status.className='audio-note';status.textContent='Âm thanh tiếng Nhật cho câu này · tạo một lần, nghe và tua lại tùy ý.';
      const button=document.createElement('button');button.type='button';button.className='audio-generate';button.textContent='▶ Tạo âm thanh và nghe';
      const fallback=document.createElement('div');fallback.className='audio-fallback hidden';
      const play=document.createElement('button');play.type='button';play.textContent='▶ Nghe bằng giọng máy';play.onclick=()=>playAudio(q.audio);
      const replay=document.createElement('button');replay.type='button';replay.textContent='↺ Nghe lại từ đầu';replay.onclick=()=>playAudio(q.audio);
      fallback.append(play,replay);
      const player=document.createElement('audio');player.className='audio-player hidden';player.controls=true;player.preload='none';player.setAttribute('aria-label','Âm thanh câu '+(localIndex+1));
      player.addEventListener('error',()=>{player.classList.add('hidden');fallback.classList.remove('hidden');status.textContent='Không tải được MP3. Dùng giọng đọc của trình duyệt để nghe lại.'});
      button.onclick=()=>prepareAudio(q,player,button,status,fallback);
      block.append(button,player,fallback,status);
    }
    if(q.kanjiSentence){const guide=document.createElement('p');guide.className='muted';guide.textContent=q.kanjiWriting?'下線のことばを漢字で書くと、どれですか。':'下線のことばの読み方はどれですか。';block.append(guide)}
    block.append(questionStem(q));
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
function renderQuestionNav(){
  const nav=$('questionNav');nav.replaceChildren();
  run.sections.forEach((skill,sectionIndex)=>{
    const group=document.createElement('div');group.className='nav-group';
    const title=document.createElement('h3');title.className='nav-group-title';title.textContent=SKILL_NAMES[skill];group.append(title);
    const grid=document.createElement('div');grid.className='nav-grid';
    run.questions.forEach((q,i)=>{if(q.skill!==skill)return;
      const button=document.createElement('button');button.type='button';button.className='nav-question'+(sectionIndex===run.sectionIndex?' visible':'');
      button.dataset.question=i;button.textContent=run.questions.slice(0,i+1).filter(item=>item.skill===skill).length;
      button.onclick=()=>{
        if(run.sectionIndex!==sectionIndex){run.sectionIndex=sectionIndex;renderSection()}
        const target=$('exam-q-'+i);target.scrollIntoView({behavior:'smooth',block:'start'});
        target.classList.add('jump-focus');setTimeout(()=>target.classList.remove('jump-focus'),1700);
      };grid.append(button);
    });group.append(grid);nav.append(group);
  });
}
$('prev').onclick=()=>{if(run.sectionIndex>0){run.sectionIndex--;renderSection();window.scrollTo({top:0,behavior:'smooth'})}};
$('next').onclick=()=>{if(run.sectionIndex<run.sections.length-1){run.sectionIndex++;renderSection();window.scrollTo({top:0,behavior:'smooth'})}};
$('quit').onclick=()=>{if(confirm('Thoát bài đang làm? Câu trả lời sẽ không được lưu.'))home()};
function home(){stopSpeech();clearInterval(tick);run=null;$('runner').classList.add('hidden');$('results').classList.add('hidden');$('home').classList.remove('hidden');renderHome();window.scrollTo({top:0,behavior:'smooth'})}
$('submit').onclick=()=>submitRun(false);
function submitRun(expired){
  if(!run)return;
  const blanks=run.answers.filter(x=>x===null).length;
  if(!expired&&blanks&&!confirm('Còn '+blanks+' câu chưa chọn đáp án. Bạn vẫn muốn nộp bài?'))return;
  stopSpeech();clearInterval(tick);
  run.elapsed=Math.min(Date.now()-run.started,run.duration);
  run.correct=run.questions.reduce((count,q,i)=>count+(run.answers[i]===q.answer?1:0),0);
  saveResult();$('runner').classList.add('hidden');$('results').classList.remove('hidden');
  $('score').textContent=run.correct+'/'+run.questions.length+' câu đúng · '+Math.round(run.correct/run.questions.length*100)+'%';
  $('duration').textContent=(expired?'Hết giờ · ':'')+'Thời gian làm bài: '+time(run.elapsed)+' / '+time(run.duration);
  $('review').replaceChildren();$('review').classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'});
}
$('showReview').onclick=()=>{
  const box=$('review');box.replaceChildren();
  run.questions.forEach((q,i)=>{
    const article=document.createElement('article');article.className='review';
    const title=document.createElement('h3');title.textContent='Câu '+(i+1)+' · '+SKILL_NAMES[q.skill];
    article.append(title);
    if(q.passage){const p=document.createElement('div');p.className='passage';p.textContent=q.passage;article.append(p)}
    if(q.audio){const p=document.createElement('div');p.className='passage';p.textContent='Lời thoại: '+q.audio;article.append(p)}
    article.append(questionStem(q));
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
