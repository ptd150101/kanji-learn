// Câu hỏi luyện tập tự biên soạn theo dạng bài JLPT, không phải đề thi chính thức.
const PRACTICE_EXAMS = [
  {
    id: 'n4-mini-1', title: 'N4 · Đề luyện số 1', level: 'N4', description: '20 câu · 4 phần · đề mô phỏng',
    questions: [
      {skill:'vocabulary',prompt:'会議は来週の月曜日に（　）ます。',options:['始まり','終わり','作り','集まり'],answer:0,explanation:'会議が始まる: cuộc họp bắt đầu.'},
      {skill:'vocabulary',prompt:'雨が降りそうです。かさを（　）行きましょう。',options:['持って','置いて','忘れて','洗って'],answer:0,explanation:'かさを持って行く: mang ô theo.'},
      {skill:'vocabulary',prompt:'電車に間に合うように、（　）出かけました。',options:['早く','遅く','静かに','少なく'],answer:0,explanation:'早く出かける: đi ra sớm để kịp tàu.'},
      {skill:'vocabulary',prompt:'この問題は難しいので、先生に（　）ました。',options:['聞き','貸し','送り','呼び'],answer:0,explanation:'先生に聞く: hỏi giáo viên.'},
      {skill:'vocabulary',prompt:'薬を飲んだら、体の具合が（　）なりました。',options:['よく','高く','重く','遠く'],answer:0,explanation:'体の具合がよくなる: sức khỏe khá lên.'},
      {skill:'kanji',prompt:'「約束」の読み方はどれですか。',options:['やくそく','やっそく','やくぞく','やっぞく'],answer:0,explanation:'約束（やくそく）: lời hứa, cuộc hẹn.'},
      {skill:'kanji',prompt:'「急いで」の読み方はどれですか。',options:['いそいで','あわてて','きゅういで','はやいで'],answer:0,explanation:'急ぐ（いそぐ）→ 急いで（いそいで）.'},
      {skill:'kanji',prompt:'「荷物」の読み方はどれですか。',options:['にもつ','にぶつ','かもつ','かぶつ'],answer:0,explanation:'荷物（にもつ）: hành lý.'},
      {skill:'kanji',prompt:'「病院」の読み方はどれですか。',options:['びょういん','びょいん','びょうえん','びょえん'],answer:0,explanation:'病院（びょういん）: bệnh viện.'},
      {skill:'kanji',prompt:'「けいけん」を漢字で書くと、どれですか。',options:['経験','経検','軽験','軽検'],answer:0,explanation:'経験（けいけん）: kinh nghiệm.'},
      {skill:'reading',passage:'山田さんへ\n明日の会議は午前11時からになりました。資料は今日の午後5時までにメールで送ってください。会議室は3階です。\n田中',prompt:'会議は何時に始まりますか。',options:['午前10時','午前11時','午後5時','午後10時'],answer:1,explanation:'「午前11時からになりました」: cuộc họp bắt đầu lúc 11 giờ sáng.'},
      {skill:'reading',passage:'山田さんへ\n明日の会議は午前11時からになりました。資料は今日の午後5時までにメールで送ってください。会議室は3階です。\n田中',prompt:'資料はいつまでに送りますか。',options:['今日の午後5時まで','明日の午前10時まで','明日の午前11時まで','今日の午前5時まで'],answer:0,explanation:'「今日の午後5時までにメールで送ってください」.'},
      {skill:'reading',passage:'図書館は平日は午前9時から午後8時まで、土曜日は午後6時まで開いています。日曜日は休みです。本は一人5冊まで、2週間借りられます。',prompt:'土曜日の午後7時に図書館へ行けますか。',options:['いいえ、もう閉まっています','はい、午後8時まで開いています','はい、午後9時まで開いています','いいえ、日曜日だけ開いています'],answer:0,explanation:'土曜日は午後6時までなので、午後7時には閉まっています.'},
      {skill:'reading',passage:'図書館は平日は午前9時から午後8時まで、土曜日は午後6時まで開いています。日曜日は休みです。本は一人5冊まで、2週間借りられます。',prompt:'本は何冊まで借りられますか。',options:['5冊','2冊','6冊','9冊'],answer:0,explanation:'「一人5冊まで」: mỗi người tối đa 5 cuốn.'},
      {skill:'reading',passage:'駅前のパン屋は、朝7時から開いています。毎週水曜日は休みです。午後5時を過ぎると、サンドイッチが半額になります。',prompt:'サンドイッチが安くなるのはいつですか。',options:['午後5時を過ぎてから','朝7時から','水曜日の朝','毎日午後5時まで'],answer:0,explanation:'「午後5時を過ぎると、半額」: sau 5 giờ chiều.'},
      {skill:'listening',audio:'女：すみません、図書館はどこですか。\n男：この道をまっすぐ行って、二つ目の角を右に曲がってください。左側にあります。',prompt:'図書館へは、二つ目の角でどちらに曲がりますか。',options:['右','左','まっすぐ','戻る'],answer:0,explanation:'「二つ目の角を右に曲がってください」: rẽ phải ở góc thứ hai.'},
      {skill:'listening',audio:'男：明日の映画、何時からですか。\n女：午後三時からです。でも、二時半に駅で会いましょう。',prompt:'二人は何時に会いますか。',options:['午後2時半','午後3時','午前2時半','午後3時半'],answer:0,explanation:'Họ hẹn ở ga lúc 二時半, tức 2 giờ 30 chiều.'},
      {skill:'listening',audio:'女：お弁当はいくらですか。\n男：六百円です。お茶を一緒に買うと、全部で七百円になります。',prompt:'お弁当とお茶を買うと、いくらですか。',options:['700円','600円','100円','800円'],answer:0,explanation:'「全部で七百円」: tổng cộng 700 yên.'},
      {skill:'listening',audio:'男：週末、何をしましたか。\n女：土曜日は友達と買い物をしました。日曜日は家で日本語を勉強しました。',prompt:'女の人は日曜日に何をしましたか。',options:['日本語を勉強した','買い物をした','友達に会った','映画を見た'],answer:0,explanation:'Chủ nhật cô ấy ở nhà học tiếng Nhật.'},
      {skill:'listening',audio:'女：このバスは病院に行きますか。\n男：いいえ、病院へ行くのは次のバスです。あと五分で来ますよ。',prompt:'病院へ行くバスはいつ来ますか。',options:['あと5分','今すぐ','あと15分','明日'],answer:0,explanation:'「あと五分で来ます」: 5 phút nữa.'}
    ]
  },
  {
    id: 'n5-mini-1', title: 'N5 · Đề luyện số 1', level: 'N5', description: '16 câu · 4 phần · đề mô phỏng',
    questions: [
      {skill:'vocabulary',prompt:'きょうは とても（　）です。コートを きます。',options:['さむい','あつい','あかるい','ひろい'],answer:0,explanation:'Mặc áo khoác vì trời lạnh: さむい.'},
      {skill:'vocabulary',prompt:'まいあさ 7じに（　）を たべます。',options:['あさごはん','ばんごはん','ひるごはん','やすみ'],answer:0,explanation:'7 giờ sáng ăn 朝ごはん (bữa sáng).'},
      {skill:'vocabulary',prompt:'えきで でんしゃを（　）。',options:['まちます','たべます','のみます','かきます'],answer:0,explanation:'電車を待つ: đợi tàu.'},
      {skill:'vocabulary',prompt:'この へやは（　）です。ひとが 20にん はいれます。',options:['ひろい','せまい','みじかい','ちいさい'],answer:0,explanation:'広い: rộng.'},
      {skill:'kanji',prompt:'「学校」は どう よみますか。',options:['がっこう','がくこ','がっこ','がこう'],answer:0,explanation:'学校（がっこう）: trường học.'},
      {skill:'kanji',prompt:'「毎日」は どう よみますか。',options:['まいにち','まいひ','まいじつ','まいび'],answer:0,explanation:'毎日（まいにち）: hằng ngày.'},
      {skill:'kanji',prompt:'「大きい」は どう よみますか。',options:['おおきい','だいきい','おきい','おおい'],answer:0,explanation:'大きい（おおきい）: to, lớn.'},
      {skill:'kanji',prompt:'「みず」を かんじで かくと、どれですか。',options:['水','木','火','土'],answer:0,explanation:'水（みず）: nước.'},
      {skill:'reading',passage:'わたしは まいにち 8じに がっこうへ いきます。きょうは あめですから、バスで いきます。',prompt:'きょうは なにで がっこうへ いきますか。',options:['バス','じてんしゃ','でんしゃ','あるいて'],answer:0,explanation:'「バスで いきます」: đi bằng xe buýt.'},
      {skill:'reading',passage:'わたしは まいにち 8じに がっこうへ いきます。きょうは あめですから、バスで いきます。',prompt:'きょうは どうして バスで いきますか。',options:['あめですから','やすみですから','あついですから','バスが すきですから'],answer:0,explanation:'Vì trời mưa: あめですから.'},
      {skill:'reading',passage:'みせは 9じから 6じまでです。にちようびは やすみです。パンは ひとつ 100えんです。',prompt:'にちようびに みせは あいていますか。',options:['いいえ、やすみです','はい、9じからです','はい、6じからです','はい、いつもです'],answer:0,explanation:'「にちようびは やすみ」: chủ nhật nghỉ.'},
      {skill:'reading',passage:'みせは 9じから 6じまでです。にちようびは やすみです。パンは ひとつ 100えんです。',prompt:'パンを ふたつ かうと、いくらですか。',options:['200えん','100えん','300えん','600えん'],answer:0,explanation:'100 yên một cái, hai cái 200 yên.'},
      {skill:'listening',audio:'女：きょうは なんようびですか。\n男：げつようびです。',prompt:'きょうは なんようびですか。',options:['げつようび','かようび','すいようび','にちようび'],answer:0,explanation:'げつようび: thứ Hai.'},
      {skill:'listening',audio:'男：りんごを いくつ かいますか。\n女：みっつ ください。',prompt:'りんごを いくつ かいますか。',options:['3つ','1つ','2つ','4つ'],answer:0,explanation:'みっつ: ba cái.'},
      {skill:'listening',audio:'女：たなかさんは どこに いますか。\n男：としょかんに います。',prompt:'たなかさんは どこに いますか。',options:['としょかん','がっこう','えき','みせ'],answer:0,explanation:'としょかん: thư viện.'},
      {skill:'listening',audio:'男：なんじに ねますか。\n女：よる 11じに ねます。',prompt:'女のひとは なんじに ねますか。',options:['よる11じ','あさ11じ','よる10じ','あさ10じ'],answer:0,explanation:'よる11じ: 11 giờ đêm.'}
    ]
  }
];
