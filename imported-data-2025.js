// User-supplied July 2025 N4 scan. Answer key and audio are pending.
(function(){
const page=n=>'exam-assets/n4-2025/page-'+String(n).padStart(2,'0')+'.webp';
const questions=[];
function add(skill,n,mondai,pages){questions.push({skill,mondai,originalNumber:n,prompt:'Câu '+n+' — xem nội dung và bốn lựa chọn trong ảnh đề bên dưới.',imageUrls:pages.map(page),options:['①','②','③','④'],answer:null,explanation:'Đang đối chiếu đáp án tham khảo đúng với bản scan này.',audioPending:skill==='listening'})}
const vp={1:3,2:3,3:3,4:3,5:3,6:3,7:3,8:4,9:4,10:4,11:4,12:4,13:5,14:5,15:5,16:5,17:5,18:5,19:5,20:6,21:7,22:7,23:7,24:8,25:9,26:9,27:9,28:10};
for(let n=1;n<=28;n++)add(n<=12?'kanji':'vocabulary',n,n<=7?1:n<=12?2:n<=20?3:n<=24?4:5,[vp[n]]);
const gp={1:13,2:13,3:13,4:13,5:13,6:13,7:14,8:14,9:14,10:14,11:14,12:15,13:15,14:16,15:16,16:16,17:17,18:18,19:18,20:18,21:18,22:20,23:21,24:22,25:24,26:25,27:25,28:26,29:26};
for(let n=1;n<=29;n++)add(n<=21?'grammar':'reading',n,n<=13?1:n<=17?2:n<=21?3:n<=24?4:n<=27?5:6,n>=18&&n<=21?[18,19]:n>=28?[26,27]:[gp[n]]);
const lp1=[30,31,32,33,33,34,34,35],lp2=[37,37,38,38,39,39,40],lp3=[42,42,43,43,44];
lp1.forEach((p,i)=>add('listening',i+1,1,[p]));lp2.forEach((p,i)=>add('listening',i+1,2,[p]));lp3.forEach((p,i)=>add('listening',i+1,3,[p]));
for(let n=1;n<=8;n++)add('listening',n,4,[45]);
if(questions.length!==85)throw Error('Expected 85 N4 July 2025 question slots');
PRACTICE_EXAMS.push({id:'imported-2025-07-n4',title:'N4 · Đề 7/2025 (bản scan)',level:'N4',badge:'PDF ĐÃ NHẬP · CHỜ AUDIO',imported:true,description:'85 câu từ PDF người dùng cung cấp',source:'PDF do người dùng cung cấp. 28 câu chữ Hán/từ vựng, 29 câu ngữ pháp/đọc hiểu, 28 câu nghe. Chưa có đáp án và audio khớp bản scan; các câu này chưa được chấm.',questions});
})();
