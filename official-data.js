// Đáp án từ các bảng chính thức của JLPT Official Practice Workbook Vol. 2 (2018).
// PDF/audio được mở trực tiếp từ jlpt.jp; không sao chép nội dung đề hoặc tệp âm thanh.
const OFFICIAL_EXAMS=[
 {id:'official-n4-2018',level:'N4',title:'JLPT chính thức · N4 · 2018',v:[3,4,1,2,4,3,4,2,1,2,3,4,1,3,4,1,2,2,3,2,1,4,3,4,1,2,2,4,1,3,3,1,3,2,4],g:[3,4,2,1,4,1,3,4,2,4,3,2,3,1,2,1,2,3,1,4,3,1,4,2,3,4,2,3,4,3,1,2,3,4,1],l:[[1,3,2,4,3,3,3,1],[1,2,4,2,2,4,3],[2,2,1,3,2],[1,3,3,1,2,3,2,1]],splitV:15,splitG:25},
 {id:'official-n5-2018',level:'N5',title:'JLPT chính thức · N5 · 2018',v:[4,1,3,1,3,4,1,4,2,3,2,2,4,3,2,1,1,4,3,2,4,4,3,1,2,1,2,3,4,1,2,1,3,2,4],g:[2,4,1,4,2,3,1,3,1,2,4,3,2,4,3,1,4,2,3,2,1,2,1,4,3,3,3,2,1,2,3,4],l:[[3,1,4,2,1,4,3],[4,1,3,1,2,2],[3,3,1,2,2],[1,3,3,2,1,2]],splitV:18,splitG:20}
];
function officialUrl(exam,suffix,ext='pdf'){return 'https://www.jlpt.jp/samples/sample2018/'+ext+'/'+exam.level+suffix+'.'+ext}
