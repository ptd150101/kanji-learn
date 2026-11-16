// Câu hỏi mô phỏng tự biên soạn. Không trích chép đề thi JLPT chính thức.
PRACTICE_EXAMS.find(e=>e.level==='N4').questions.push(
  {skill:'grammar',prompt:'日本へ行く（　）、日本語を勉強しています。',options:['ために','ながら','まで','そうに'],answer:0,explanation:'V辞書形＋ために: để làm gì. Học tiếng Nhật để đi Nhật.'},
  {skill:'grammar',prompt:'この本は読み（　）です。',options:['やすい','そう','ながら','ところ'],answer:0,explanation:'Vます bỏ ます＋やすい: dễ làm. 読みやすい: dễ đọc.'},
  {skill:'grammar',prompt:'雨が降っている（　）、出かけます。',options:['のに','ので','から','まで'],answer:0,explanation:'のに diễn tả sự trái với dự đoán: dù trời đang mưa vẫn ra ngoài.'},
  {skill:'grammar',prompt:'駅に着いたら、電話（　）ください。',options:['して','する','した','しない'],answer:0,explanation:'Vて＋ください: hãy gọi điện sau khi đến ga.'},
  {skill:'grammar',prompt:'この部屋ではたばこを吸って（　）。',options:['はいけません','もいいです','あります','みます'],answer:0,explanation:'Vてはいけません: không được phép hút thuốc ở phòng này.'},
  {skill:'grammar',prompt:'先生の話を聞き（　）メモを取りました。',options:['ながら','ために','までに','そうで'],answer:0,explanation:'Vます bỏ ます＋ながら: vừa nghe vừa ghi chép.'}
);
PRACTICE_EXAMS.find(e=>e.level==='N5').questions.push(
  {skill:'grammar',prompt:'これは だれ（　）かばんですか。',options:['の','に','で','を'],answer:0,explanation:'N1 の N2 thể hiện sở hữu: cặp của ai.'},
  {skill:'grammar',prompt:'きのう ともだち（　）えいがを みました。',options:['と','を','が','へ'],answer:0,explanation:'友だちと: cùng với bạn; 映画を見ます: xem phim.'},
  {skill:'grammar',prompt:'つくえの うえ（　）ほんが あります。',options:['に','を','へ','で'],answer:0,explanation:'Nơi tồn tại＋に＋ものが あります: có sách trên bàn.'},
  {skill:'grammar',prompt:'あしたは がっこうへ（　）。',options:['いきません','いきませんでした','いきました','いかなかった'],answer:0,explanation:'あした là ngày mai; いきません là phủ định tương lai.'},
  {skill:'grammar',prompt:'ここで しゃしんを とっても（　）ですか。',options:['いい','よくない','だめ','いけない'],answer:0,explanation:'Vてもいいですか hỏi xin phép: chụp ảnh ở đây có được không?'},
  {skill:'grammar',prompt:'わたしは まいにち にほんご（　）べんきょうします。',options:['を','に','へ','が'],answer:0,explanation:'日本語を勉強します: học tiếng Nhật; を đánh dấu tân ngữ.'}
);
PRACTICE_EXAMS.push(
  {id:'n4-mini-2',title:'N4 · Đề luyện số 2',level:'N4',description:'20 câu · 5 phần · làm và chữa trên web',questions:[
    {skill:'kanji',prompt:'「準備」の読み方はどれですか。',options:['じゅんび','じゅんぴ','じゅうび','じょうび'],answer:0,explanation:'準備（じゅんび）: chuẩn bị.'},
    {skill:'kanji',prompt:'「住所」の読み方はどれですか。',options:['じゅうしょ','じゅうじょ','じゅしょ','じょうしょ'],answer:0,explanation:'住所（じゅうしょ）: địa chỉ.'},
    {skill:'kanji',prompt:'「しゅっぱつ」を漢字で書くと、どれですか。',options:['出発','出初','発出','出髪'],answer:0,explanation:'出発（しゅっぱつ）: xuất phát.'},
    {skill:'kanji',prompt:'「工場」の読み方はどれですか。',options:['こうじょう','こうちょう','くじょう','こうしょう'],answer:0,explanation:'工場（こうじょう）: nhà máy.',},
    {skill:'vocabulary',prompt:'このペンはもう使いませんから、（　）ください。',options:['捨てて','見せて','直して','探して'],answer:0,explanation:'Không dùng bút nữa nên hãy vứt đi: 捨てる.'},
    {skill:'vocabulary',prompt:'試験の前に、漢字をよく（　）ください。',options:['復習して','予約して','運転して','案内して'],answer:0,explanation:'復習する: ôn tập lại chữ Hán trước kỳ thi.'},
    {skill:'vocabulary',prompt:'この店は値段が（　）ので、学生に人気があります。',options:['安い','高い','重い','遠い'],answer:0,explanation:'Giá rẻ (安い) nên cửa hàng được học sinh ưa thích.'},
    {skill:'vocabulary',prompt:'道がわからなかったので、近くの人に（　）ました。',options:['たずね','ならべ','かざり','はこび'],answer:0,explanation:'道を尋ねる: hỏi đường.'},
    {skill:'grammar',prompt:'毎日練習すれば、もっと上手に（　）でしょう。',options:['なる','なって','なり','なった'],answer:0,explanation:'Vば là điều kiện; 上手になる: trở nên giỏi hơn.'},
    {skill:'grammar',prompt:'母に買い物を（　）ました。',options:['頼まれ','頼み','頼んで','頼む'],answer:0,explanation:'頼まれました là bị nhờ; 母に là người nhờ.'},
    {skill:'grammar',prompt:'この漢字は難しすぎて、（　）。',options:['読めません','読みます','読んでいます','読めます'],answer:0,explanation:'難しすぎる: quá khó, nên không thể đọc.'},
    {skill:'grammar',prompt:'電車が遅れた（　）、会議に間に合いませんでした。',options:['ため','のに','なら','まで'],answer:0,explanation:'N/Vた＋ため: vì tàu đến muộn nên không kịp họp.'},
    {skill:'reading',passage:'佐藤さんへ\n土曜日の午前10時に駅の東口で会いましょう。雨なら駅の中の喫茶店で待っています。映画は11時半からです。\n鈴木',prompt:'雨が降ったら、鈴木さんはどこで待ちますか。',options:['駅の中の喫茶店','駅の東口','映画館の前','駅の西口'],answer:0,explanation:'「雨なら駅の中の喫茶店で待っています」.'},
    {skill:'reading',passage:'佐藤さんへ\n土曜日の午前10時に駅の東口で会いましょう。雨なら駅の中の喫茶店で待っています。映画は11時半からです。\n鈴木',prompt:'映画は何時からですか。',options:['11時半','10時','10時半','12時'],answer:0,explanation:'「映画は11時半からです」: phim chiếu từ 11 giờ 30.'},
    {skill:'reading',passage:'市民プールは火曜日から日曜日まで開いています。平日は午後9時まで、土日は午後6時までです。月曜日は休みです。大人は500円、子どもは200円です。',prompt:'日曜日の午後7時にプールを利用できますか。',options:['いいえ、午後6時に閉まります','はい、午後9時までです','はい、毎日開いています','いいえ、日曜日は休みです'],answer:0,explanation:'土日は午後6時までなので、日曜の19 giờ đã đóng cửa.'},
    {skill:'reading',passage:'市民プールは火曜日から日曜日まで開いています。平日は午後9時まで、土日は午後6時までです。月曜日は休みです。大人は500円、子どもは200円です。',prompt:'大人一人と子ども一人で、いくらですか。',options:['700円','500円','600円','1000円'],answer:0,explanation:'500円＋200円＝700円.'},
    {skill:'listening',audio:'女：明日の遠足は九時に学校を出ます。八時半までに教室に集まってください。\n男：わかりました。',prompt:'何時までに教室に集まりますか。',options:['8時半','9時','9時半','8時'],answer:0,explanation:'「八時半までに教室に集まってください」: tập trung trước 8:30.'},
    {skill:'listening',audio:'男：新しいスーパーへはどうやって行きますか。\n女：駅から歩いて十分です。バスより歩いたほうが早いですよ。',prompt:'スーパーへは何で行くのが早いですか。',options:['歩いて','バスで','電車で','車で'],answer:0,explanation:'「バスより歩いたほうが早い」: đi bộ nhanh hơn xe buýt.'},
    {skill:'listening',audio:'女：このシャツ、青いのはありますか。\n男：青は売り切れました。白と黒ならあります。\n女：では、白をください。',prompt:'女の人は何色のシャツを買いますか。',options:['白','青','黒','赤'],answer:0,explanation:'Cô ấy chọn áo trắng: 白をください.'},
    {skill:'listening',audio:'男：今日は何時まで働きますか。\n女：いつもは五時ですが、今日は忙しいので六時までです。',prompt:'女の人は今日何時まで働きますか。',options:['6時','5時','7時','4時'],answer:0,explanation:'Hôm nay cô ấy làm đến 6 giờ: 今日は六時まで.'}
  ]},
  {id:'n5-mini-2',title:'N5 · Đề luyện số 2',level:'N5',description:'20 câu · 5 phần · làm và chữa trên web',questions:[
    {skill:'kanji',prompt:'「先生」は どう よみますか。',options:['せんせい','せいせん','せんさい','せいさい'],answer:0,explanation:'先生（せんせい）: giáo viên.'},
    {skill:'kanji',prompt:'「来週」は どう よみますか。',options:['らいしゅう','こんしゅう','せんしゅう','らいじゅう'],answer:0,explanation:'来週（らいしゅう）: tuần sau.'},
    {skill:'kanji',prompt:'「やま」を かんじで かくと、どれですか。',options:['山','川','田','木'],answer:0,explanation:'山（やま）: núi.'},
    {skill:'kanji',prompt:'「小さい」は どう よみますか。',options:['ちいさい','しょうさい','こさい','ちさい'],answer:0,explanation:'小さい（ちいさい）: nhỏ.'},
    {skill:'vocabulary',prompt:'あついですから、まどを（　）ください。',options:['あけて','しめて','けして','きいて'],answer:0,explanation:'Vì nóng nên hãy mở cửa sổ: まどをあける.'},
    {skill:'vocabulary',prompt:'きょうは げつようびです。あしたは（　）です。',options:['かようび','にちようび','すいようび','きんようび'],answer:0,explanation:'Ngày sau thứ Hai là thứ Ba: 火曜日.'},
    {skill:'vocabulary',prompt:'おちゃを のみたいです。（　）は どこですか。',options:['コップ','くつ','かさ','えんぴつ'],answer:0,explanation:'コップ: cốc dùng để uống trà.'},
    {skill:'vocabulary',prompt:'この かばんは とても（　）です。ひとりで もてません。',options:['おもい','かるい','ちいさい','あかるい'],answer:0,explanation:'Nặng đến mức không thể tự xách: 重い（おもい）.'},
    {skill:'grammar',prompt:'わたしは えき（　）でんしゃに のります。',options:['で','を','へ','が'],answer:0,explanation:'Nơi xảy ra hành động＋で: lên tàu ở ga.'},
    {skill:'grammar',prompt:'きのう ほんを（　）。',options:['よみました','よみます','よみません','よんでいます'],answer:0,explanation:'きのう là hôm qua, dùng quá khứ 読みました.'},
    {skill:'grammar',prompt:'この りんごは（　）おいしいです。',options:['とても','たくさん','あまり','いつ'],answer:0,explanation:'とても bổ nghĩa cho tính từ: rất ngon.'},
    {skill:'grammar',prompt:'ここに なまえを（　）ください。',options:['かいて','かきます','かく','かいた'],answer:0,explanation:'Vて＋ください: hãy viết tên ở đây.'},
    {skill:'reading',passage:'きょうは どようびです。あさ 9じに ともだちと こうえんで テニスを します。ごごは うちで ほんを よみます。',prompt:'ごごは なにを しますか。',options:['ほんを よみます','テニスを します','がっこうへ いきます','ともだちと あいます'],answer:0,explanation:'「ごごは うちで ほんを よみます」.'},
    {skill:'reading',passage:'きょうは どようびです。あさ 9じに ともだちと こうえんで テニスを します。ごごは うちで ほんを よみます。',prompt:'どこで テニスを しますか。',options:['こうえん','うち','がっこう','えき'],answer:0,explanation:'「こうえんで テニスを します」: chơi ở công viên.'},
    {skill:'reading',passage:'パンやは あさ 8じから ごご 5じまでです。げつようびは やすみです。パンは ひとつ 120えんです。',prompt:'げつようびに パンを かえますか。',options:['いいえ、みせは やすみです','はい、8じからです','はい、5じまでです','はい、いつも かえます'],answer:0,explanation:'「げつようびは やすみ」: thứ Hai cửa hàng nghỉ.'},
    {skill:'reading',passage:'パンやは あさ 8じから ごご 5じまでです。げつようびは やすみです。パンは ひとつ 120えんです。',prompt:'パンを みっつ かうと、いくらですか。',options:['360えん','240えん','120えん','300えん'],answer:0,explanation:'120 × 3 = 360 yên.'},
    {skill:'listening',audio:'男：あしたは なんじに おきますか。\n女：6じに おきます。',prompt:'女のひとは あした なんじに おきますか。',options:['6じ','7じ','8じ','9じ'],answer:0,explanation:'「6じに おきます」: dậy lúc 6 giờ.'},
    {skill:'listening',audio:'女：きょうの ひるごはんは なんですか。\n男：カレーです。',prompt:'ひるごはんは なんですか。',options:['カレー','ラーメン','パン','すし'],answer:0,explanation:'Bữa trưa là cà ri: カレー.'},
    {skill:'listening',audio:'男：やまださんの かばんは どれですか。\n女：あの あかい かばんです。',prompt:'かばんは なにいろですか。',options:['あか','あお','くろ','しろ'],answer:0,explanation:'「あかい かばん」: cặp màu đỏ.'},
    {skill:'listening',audio:'女：この バスは えきに いきますか。\n男：はい、えきに いきます。',prompt:'バスは どこへ いきますか。',options:['えき','びょういん','がっこう','としょかん'],answer:0,explanation:'Xe buýt đi đến ga: 駅に行きます.'}
  ]}
);
