const SKILL_NAMES={vocabulary:'Từ vựng',kanji:'Chữ Hán',grammar:'Ngữ pháp',reading:'Đọc hiểu',listening:'Nghe hiểu'};
const SKILLS=['kanji','vocabulary','grammar','reading','listening'];
PRACTICE_EXAMS.forEach(exam=>{
  let number=0;
  exam.questions.forEach(q=>{if(q.skill==='listening'&&!q.audioUrl)q.audioUrl='audio/'+exam.id+'-'+String(++number).padStart(2,'0')+'.mp3'});
});
const $=id=>document.getElementById(id);
let selectedLevel='N4',run=null,tick=null;
const ACTIVE_RUN_KEY='jlptPracticeActiveV1';
function readRunSnapshot(){
  try{
    const saved=JSON.parse(localStorage.getItem(ACTIVE_RUN_KEY)||'null');
    if(!saved)return null;
    const exam=PRACTICE_EXAMS.find(e=>e.id===saved.examId);
    if(!exam||!Array.isArray(saved.questions)||!saved.questions.length||!Array.isArray(saved.answers)||saved.answers.length!==saved.questions.length||!Array.isArray(saved.sections)||!saved.sections.length||!saved.sections.every(s=>SKILLS.includes(s))||!Number.isFinite(saved.started)||!Number.isFinite(saved.duration)||saved.duration<=0||!Number.isInteger(saved.sectionIndex)||saved.sectionIndex<0||saved.sectionIndex>=saved.sections.length||saved.questions.some(q=>!q||!saved.sections.includes(q.skill)||!Array.isArray(q.options)||!q.options.length)||saved.answers.some((a,i)=>a!==null&&(!Number.isInteger(a)||a<0||a>=saved.questions[i].options.length)))return null;
    return {...saved,exam};
  }catch{return null}
}
function saveRunSnapshot(){
  if(!run||run.graded!==undefined)return;
  try{localStorage.setItem(ACTIVE_RUN_KEY,JSON.stringify({examId:run.exam.id,skill:run.skill,questions:run.questions,sections:run.sections,answers:run.answers,sectionIndex:run.sectionIndex,currentQuestion:run.currentQuestion,started:run.started,duration:run.duration}))}catch{}
}
function renderResume(){
  const saved=readRunSnapshot();$('resumePanel').classList.toggle('hidden',!saved);
  if(!saved)return;
  const remaining=saved.duration-(Date.now()-saved.started);
  $('resumeTitle').textContent=saved.exam.title;
  $('resumeInfo').textContent=saved.answers.filter(a=>a!==null).length+'/'+saved.answers.length+' câu đã làm · '+(remaining>0?'còn '+time(remaining):'đã hết giờ, có thể xem kết quả');
  $('resumeButton').textContent=remaining>0?'Tiếp tục làm bài':'Xem kết quả';
}
const mobileSidebar=window.matchMedia('(max-width:830px)');
function setSidebarOpen(open){
  $('examSidebar').classList.toggle('is-open',open);
  $('sidebarToggle').setAttribute('aria-expanded',String(open));
  $('sidebarToggle').setAttribute('aria-label',open?'Thu gọn bảng câu hỏi':'Mở bảng câu hỏi');
  $('sidebarBody').inert=mobileSidebar.matches&&!open;
}
$('sidebarToggle').onclick=()=>setSidebarOpen(!$('examSidebar').classList.contains('is-open'));
mobileSidebar.addEventListener('change',()=>setSidebarOpen(false));
setSidebarOpen(false);
function time(ms){let s=Math.max(0,Math.floor(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function durationFor(questions,level,exam){
  if(exam?.imported){const v=questions.filter(q=>q.skill==='kanji'||q.skill==='vocabulary').length,g=questions.filter(q=>q.skill==='grammar'||q.skill==='reading').length,l=questions.filter(q=>q.skill==='listening').length;return Math.round((v*25/28+g*55/29+l*35/28)*60000)}
  if(exam?.reconstructed){
    const vocabulary=questions.filter(q=>q.skill==='kanji'||q.skill==='vocabulary').length;
    const grammar=questions.filter(q=>q.skill==='grammar'||q.skill==='reading').length;
    return Math.round((vocabulary*25/28+grammar*55/29)*60000);
  }
  return questions.reduce((sum,q)=>sum+((level==='N4'?90:75)+(q.skill==='reading'?45:0)+(q.skill==='listening'?15:0))*1000,0)
}
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
  if(!run.graded)return;
  try{const data=JSON.parse(localStorage.getItem('jlptPracticeResultsV2')||'{}');data[run.exam.id+'-'+(run.skill||'all')]={score:run.correct,total:run.graded,elapsed:run.elapsed,date:new Date().toISOString()};localStorage.setItem('jlptPracticeResultsV2',JSON.stringify(data))}catch{}
}
function renderHome(){
  renderResume();
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
    const level=document.createElement('span');level.className='exam-level';level.textContent=exam.level+' · '+(exam.badge||(exam.reconstructed?'BẢN TỔNG HỢP 7/2024':exam.official?'TRÍCH ĐỀ THẬT 2018':'ĐỀ LUYỆN'));
    const title=document.createElement('span');title.className='exam-card-title';title.textContent=exam.title;
    const desc=document.createElement('span');desc.className='exam-card-desc';desc.textContent=exam.questions.length+' câu · '+time(durationFor(exam.questions,exam.level,exam));
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
  $('dialogSummary').textContent=exam.questions.length+' câu trong '+SKILLS.filter(skill=>exam.questions.some(q=>q.skill===skill)).length+' phần';
  $('dialogSource').textContent=exam.source||'';
  $('dialogSource').classList.toggle('hidden',!exam.source);
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
    $('dialogCount').textContent=checked.length+' phần · '+questions.length+' câu · '+time(durationFor(questions,exam.level,exam));
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
  if(readRunSnapshot()&&!confirm('Bài đang làm sẽ được thay bằng bài mới. Bạn muốn bắt đầu lại?'))return;
  $('examDialog').close();start(selectedExam,skills);
};
function start(exam,selectedSkills){
  const questions=exam.questions.filter(q=>selectedSkills.includes(q.skill)).map(q=>exam.reconstructed||exam.imported?{...q}:shuffle(q));
  if(!questions.length)return;
  const sections=SKILLS.filter(name=>selectedSkills.includes(name)&&questions.some(q=>q.skill===name));
  const skill=sections.length===SKILLS.length?null:sections.join('+');
  const duration=durationFor(questions,exam.level,exam);
  run={exam,skill,questions,sections,answers:Array(questions.length).fill(null),sectionIndex:0,currentQuestion:0,started:Date.now(),duration};
  showRun();saveRunSnapshot();
}
function showRun(){
  const {exam,sections,duration}=run;
  setSidebarOpen(false);
  $('home').classList.add('hidden');$('results').classList.add('hidden');$('runner').classList.remove('hidden');
  $('runTitle').textContent=exam.title;$('runInfo').textContent=sections.map(name=>SKILL_NAMES[name]).join(' · ');
  $('runSource').classList.toggle('hidden',!exam.sourceUrl);
  if(exam.sourceUrl){$('runSource').href=exam.sourceUrl;$('runSource').textContent=exam.reconstructed?'Nguồn: bản tổng hợp 7/2024 (không chính thức)':'Nguồn: JLPT Official Practice Workbook 2018'}
  clearInterval(tick);renderSection();updateTimer();
  if(run.graded===undefined)tick=setInterval(updateTimer,500);
  window.scrollTo({top:0,behavior:'smooth'});
}
function resumeRun(){
  const saved=readRunSnapshot();if(!saved)return renderHome();
  run=saved;selectedLevel=saved.exam.level;showRun();
}
$('resumeButton').onclick=resumeRun;
$('discardButton').onclick=()=>{if(confirm('Bỏ bài đang làm và các câu trả lời đã chọn?')){try{localStorage.removeItem(ACTIVE_RUN_KEY)}catch{}renderHome()}};
window.addEventListener('pagehide',saveRunSnapshot);
function updateTimer(){
  if(!run)return;const remaining=run.duration-(Date.now()-run.started);
  $('timer').textContent=time(remaining);$('timer').classList.toggle('urgent',remaining<60000);
  if(remaining<=0)submitRun(true);
}
function updateProgress(){
  const answered=run.answers.filter(x=>x!==null).length;
  $('counter').textContent=answered+'/'+run.questions.length+' câu đã trả lời';
  $('compactCounter').textContent=answered+'/'+run.questions.length+' câu';
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
  document.querySelectorAll('.audio-player').forEach(player=>player.pause());
  const skill=run.sections[run.sectionIndex],items=run.questions.flatMap((q,i)=>q.skill===skill?[{q,i}]:[]);
  $('sectionHeading').textContent=SKILL_NAMES[skill]+' · '+items.length+' câu';
  const tabs=$('skillTabs');tabs.replaceChildren();
  run.sections.forEach((name,index)=>{
    const button=document.createElement('button');button.type='button';button.className=index===run.sectionIndex?'current':'';
    button.setAttribute('aria-current',index===run.sectionIndex?'step':'false');
    button.onclick=()=>{run.sectionIndex=index;run.currentQuestion=run.questions.findIndex(q=>q.skill===name);renderSection();saveRunSnapshot();window.scrollTo({top:0,behavior:'smooth'})};tabs.append(button);
  });
  renderQuestionNav();
  const content=$('content');content.replaceChildren();
  let previousPassage=null;
  items.forEach(({q,i},localIndex)=>{
    const block=document.createElement('article');block.className='question-block';block.id='exam-q-'+i;
    const number=document.createElement('div');number.className='question-number';number.textContent=((run.exam.official||run.exam.reconstructed)&&q.mondai?'問題 '+q.mondai+' · ':'')+'Câu '+(localIndex+1);
    block.append(number);
    if(q.passage&&q.passage!==previousPassage){const p=document.createElement('div');p.className='passage';p.textContent=q.passage;block.append(p)}
    previousPassage=q.passage||null;
    if(q.audioPending){const note=document.createElement('p');note.className='audio-note';note.textContent='Đang chờ audio của đúng bộ đề. Bạn có thể xem câu hỏi, nhưng phần này chưa thể chấm.';block.append(note)}
    else if(q.skill==='listening'){
      const player=document.createElement('audio');player.className='audio-player';player.controls=true;player.preload='metadata';player.src=q.audioUrl;player.setAttribute('aria-label','Âm thanh câu '+(localIndex+1));
      const error=document.createElement('p');error.className='audio-note hidden';error.textContent='Không tải được âm thanh. Vui lòng thử tải lại trang.';
      player.addEventListener('error',()=>error.classList.remove('hidden'));
      block.append(player,error);
    }
    if(q.kanjiSentence){const guide=document.createElement('p');guide.className='muted';guide.textContent=q.kanjiWriting?'下線のことばを漢字で書くと、どれですか。':'下線のことばの読み方はどれですか。';block.append(guide)}
    block.append(questionStem(q));
    if(q.imageUrls)q.imageUrls.forEach((url,index)=>{const img=document.createElement('img');img.className='question-scan';img.loading='lazy';img.src=url;img.alt='Bản scan chứa câu '+q.originalNumber+(q.imageUrls.length>1?' · trang '+(index+1):'');block.append(img)});
    const choices=document.createElement('div');choices.className='choices';
    q.options.forEach((option,n)=>{
      const label=document.createElement('label');label.className='choice';
      const input=document.createElement('input');input.type='radio';input.name='answer-'+i;input.checked=run.answers[i]===n;
      input.onchange=()=>{run.answers[i]=n;updateProgress();saveRunSnapshot()};
      const span=document.createElement('span');span.textContent=q.scanMode?option:String.fromCharCode(65+n)+'. '+option;
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
      const button=document.createElement('button');button.type='button';button.className='nav-question'+(i===run.currentQuestion?' visible':'');
      button.dataset.question=i;button.textContent=run.questions.slice(0,i+1).filter(item=>item.skill===skill).length;
      button.onclick=()=>{
        run.currentQuestion=i;
        if(run.sectionIndex!==sectionIndex){run.sectionIndex=sectionIndex;renderSection()}
        else nav.querySelectorAll('.nav-question').forEach(item=>item.classList.toggle('visible',Number(item.dataset.question)===i));
        saveRunSnapshot();
        if(mobileSidebar.matches)setSidebarOpen(false);
        const target=$('exam-q-'+i);
        setTimeout(()=>{if(!run)return;target.scrollIntoView({behavior:'smooth',block:'start'});target.classList.add('jump-focus');setTimeout(()=>target.classList.remove('jump-focus'),1700)},mobileSidebar.matches?640:0);
      };grid.append(button);
    });group.append(grid);nav.append(group);
  });
}
$('prev').onclick=()=>{if(run.sectionIndex>0){run.sectionIndex--;run.currentQuestion=run.questions.findIndex(q=>q.skill===run.sections[run.sectionIndex]);renderSection();saveRunSnapshot();window.scrollTo({top:0,behavior:'smooth'})}};
$('next').onclick=()=>{if(run.sectionIndex<run.sections.length-1){run.sectionIndex++;run.currentQuestion=run.questions.findIndex(q=>q.skill===run.sections[run.sectionIndex]);renderSection();saveRunSnapshot();window.scrollTo({top:0,behavior:'smooth'})}};
$('quit').onclick=()=>{saveRunSnapshot();home()};
function home(){document.querySelectorAll('.audio-player').forEach(player=>player.pause());clearInterval(tick);run=null;$('runner').classList.add('hidden');$('results').classList.add('hidden');$('home').classList.remove('hidden');renderHome();window.scrollTo({top:0,behavior:'smooth'})}
$('submit').onclick=()=>submitRun(false);
function submitRun(expired){
  if(!run)return;
  const blanks=run.answers.filter(x=>x===null).length;
  if(!expired&&blanks&&!confirm('Còn '+blanks+' câu chưa chọn đáp án. Bạn vẫn muốn nộp bài?'))return;
  document.querySelectorAll('.audio-player').forEach(player=>player.pause());clearInterval(tick);
  run.elapsed=Math.min(Date.now()-run.started,run.duration);
  run.graded=run.questions.filter(q=>q.answer!==null&&q.answer!==undefined&&!q.audioPending).length;
  run.correct=run.questions.reduce((count,q,i)=>count+(q.answer!==null&&q.answer!==undefined&&!q.audioPending&&run.answers[i]===q.answer?1:0),0);
  try{localStorage.removeItem(ACTIVE_RUN_KEY)}catch{}
  saveResult();$('runner').classList.add('hidden');$('results').classList.remove('hidden');
  const pendingListening=run.questions.some(q=>q.audioPending);
  $('score').textContent=run.graded?run.correct+'/'+run.graded+' câu đúng · '+Math.round(run.correct/run.graded*100)+'%'+(run.exam.imported?' · Đáp án tham khảo':'')+(pendingListening?' · chưa tính nghe':''):run.answers.filter(x=>x!==null).length+'/'+run.questions.length+' câu đã trả lời · Chưa tính điểm phần nghe';
  $('duration').textContent=(expired?'Hết giờ · ':'')+'Thời gian làm bài: '+time(run.elapsed)+' / '+time(run.duration);
  $('review').replaceChildren();$('review').classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'});
}
$('showReview').onclick=()=>renderReview('wrong');
function renderReview(filter){
  const box=$('review');box.replaceChildren();
  const toolbar=document.createElement('div');toolbar.className='review-toolbar';
  for(const [mode,label] of [['wrong','Câu sai / chưa làm'],['all','Tất cả câu']]){
    const button=document.createElement('button');button.type='button';button.textContent=label;
    if(mode===filter)button.classList.add('active-filter');
    button.onclick=()=>renderReview(mode);toolbar.append(button);
  }
  box.append(toolbar);
  let shown=0,previousPassage=null;
  run.questions.forEach((q,i)=>{
    if(filter==='wrong'&&(q.answer===null||q.answer===undefined||q.audioPending||run.answers[i]===q.answer))return;
    shown++;
    const article=document.createElement('article');article.className='review';
    const title=document.createElement('h3');title.textContent='Câu '+(i+1)+' · '+SKILL_NAMES[q.skill];
    article.append(title);
    if(q.passage&&q.passage!==previousPassage){const p=document.createElement('div');p.className='passage';p.textContent=q.passage;article.append(p)}
    previousPassage=q.passage||null;
    if(q.imageUrls)q.imageUrls.forEach(url=>{const img=document.createElement('img');img.className='question-scan';img.loading='lazy';img.src=url;img.alt='Bản scan câu '+q.originalNumber;article.append(img)});
    if(q.audio){const p=document.createElement('div');p.className='passage';p.textContent='Lời thoại: '+q.audio;article.append(p)}
    article.append(questionStem(q));
    const answer=document.createElement('p');answer.className=run.answers[i]===q.answer?'good':'bad';
    answer.textContent='Bạn chọn: '+(run.answers[i]===null?'Chưa trả lời':(q.scanMode?'':String.fromCharCode(65+run.answers[i])+'. ')+q.options[run.answers[i]]);
    const correct=document.createElement('p');correct.className='good';correct.textContent=q.answer===null||q.answer===undefined?'Đáp án: đang đối chiếu đúng bộ đề.':(run.exam.imported?'Đáp án tham khảo: ':'Đáp án đúng: ')+(q.scanMode?'':String.fromCharCode(65+q.answer)+'. ')+q.options[q.answer];
    const explanation=document.createElement('p');explanation.className='muted';explanation.textContent='Giải thích: '+(q.explanation||'Đang cập nhật lời giải.');
    article.append(answer,correct,explanation);box.append(article);
  });
  if(!shown){const empty=document.createElement('p');empty.className='review-empty';empty.textContent='Không có câu sai hoặc chưa làm trong phần đã chấm.';box.append(empty)}
  box.classList.remove('hidden');box.scrollIntoView({behavior:'smooth'});
}
$('backHome').onclick=home;
renderHome();
