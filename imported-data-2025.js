// User-supplied July 2025 N4 scan. Answer key and audio are pending.
(function(){
const page=n=>'exam-assets/n4-2025/page-'+String(n).padStart(2,'0')+'.webp';
const questions=[];
function add(skill,n,mondai,pages){questions.push({skill,mondai,originalNumber:n,scanMode:true,prompt:'Câu '+n+' — chọn phương án tương ứng trong ảnh đề.',imageUrls:pages.map(page),options:['1','2','3','4'],answer:null,explanation:'Đang đối chiếu đáp án tham khảo đúng với bản scan này.',audioPending:skill==='listening'})}
const vp={1:3,2:3,3:3,4:3,5:3,6:3,7:3,8:4,9:4,10:4,11:4,12:4,13:5,14:5,15:5,16:5,17:5,18:5,19:5,20:6,21:7,22:7,23:7,24:8,25:9,26:9,27:9,28:10};
for(let n=1;n<=28;n++)add(n<=12?'kanji':'vocabulary',n,n<=7?1:n<=12?2:n<=20?3:n<=24?4:5,[vp[n]]);
const gp={1:13,2:13,3:13,4:13,5:13,6:13,7:14,8:14,9:14,10:14,11:14,12:15,13:15,14:16,15:16,16:16,17:17,18:18,19:18,20:18,21:18,22:20,23:21,24:22,25:24,26:25,27:25,28:26,29:26};
for(let n=1;n<=29;n++)add(n<=21?'grammar':'reading',n,n<=13?1:n<=17?2:n<=21?3:n<=24?4:n<=27?5:6,n>=18&&n<=21?[18,19]:n>=28?[26,27]:[gp[n]]);
const lp1=[30,31,32,33,33,34,34,35],lp2=[37,37,38,38,39,39,40],lp3=[42,42,43,43,44];
lp1.forEach((p,i)=>add('listening',i+1,1,[p]));lp2.forEach((p,i)=>add('listening',i+1,2,[p]));lp3.forEach((p,i)=>add('listening',i+1,3,[p]));
for(let n=1;n<=8;n++)add('listening',n,4,[45]);
if(questions.length!==85)throw Error('Expected 85 N4 July 2025 question slots');
// July 2025 reference key matched to this scan by question wording and layout.
// Answers are 1-based here; the quiz engine stores zero-based option indexes.
const vocabulary=['3412231','23421','42132144','2233','1142'].join('');
const grammarReading=['4332442121234','3411','1423','342','132','12'].join('');
const listening=['14312212','3221421','31212','22132312'];
if(vocabulary.length!==28||grammarReading.length!==29||listening.map(s=>s.length).join(',')!=='8,7,5,8')throw Error('Incomplete July 2025 reference key');
questions.forEach((q,i)=>{
  const key=i<28?vocabulary[i]:i<57?grammarReading[i-28]:listening[q.mondai-1][i-57-(q.mondai===1?0:q.mondai===2?8:q.mondai===3?15:20)];
  if(q.skill==='listening'&&q.mondai>=3)q.options=['1','2','3'];
  const answer=Number(key)-1;
  if(!Number.isInteger(answer)||answer<0||answer>=q.options.length)throw Error('Invalid July 2025 answer at '+i);
  q.answer=answer;
  q.explanation='Đáp án tham khảo đối chiếu với đúng đề N4 tháng 7/2025. Phần nghe cần kiểm tra lại khi có audio gốc.';
});
PRACTICE_EXAMS.push({id:'imported-2025-07-n4',title:'N4 · Đề 7/2025 (bản scan)',level:'N4',badge:'ĐỀ 7/2025 · CHỜ AUDIO',imported:true,description:'85 câu từ PDF người dùng cung cấp',source:'PDF do người dùng cung cấp. Đáp án tham khảo tháng 7/2025 đã đối chiếu với câu chữ và thứ tự đề; không phải đáp án chính thức JLPT. Phần nghe chờ audio gốc để luyện và kiểm tra lại.',questions});
})();
