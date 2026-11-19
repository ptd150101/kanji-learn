// The JLPT Official Practice Workbook Vol. 2 (2018), Language Knowledge (Vocabulary), N4/N5.
// Source: Official Worldwide Japanese-Language Proficiency Test Website (https://www.jlpt.jp/)
// https://www.jlpt.jp/e/samples/sampleindex.html
// These questions were selected from previously administered JLPT tests. Listening audio is excluded.
const OFFICIAL_2018_SOURCE='Source: Official Worldwide Japanese-Language Proficiency Test Website (https://www.jlpt.jp/)';
function officialKanji(sentence,target,options,note,writing=false){
  const at=sentence.indexOf(target);
  if(at<0)throw Error('Missing underlined word: '+target);
  return {skill:'kanji',kanjiSentence:sentence.slice(0,at)+'【'+target+'】'+sentence.slice(at+target.length),kanjiWriting:writing,options,explanation:note};
}
function officialVocab(prompt,options,note){return {skill:'vocabulary',prompt,options,explanation:note}}
const N4_OFFICIAL_2018=[
  officialKanji('今日はとても楽しかったですね。','楽しかった',['いそがしかった','すずしかった','たのしかった','かなしかった'],'楽しかった（たのしかった）: đã vui.'),
  officialKanji('わたしはこの味がすきです。','味',['かたち','いろ','におい','あじ'],'味（あじ）: vị, hương vị.'),
  officialKanji('このあたりはちょっと不便ですね。','不便',['ふべん','ぶべん','ふへん','ぶへん'],'不便（ふべん）: bất tiện.'),
  officialKanji('やさいを切ってください。','切って',['とって','きって','あらって','もって'],'切って（きって）: cắt.'),
  officialKanji('はやしさん以外はみんな来ました。','以外',['にそと','にがい','いそと','いがい'],'以外（いがい）: ngoài, ngoại trừ.'),
  officialKanji('まどからずっと雲を見ていました。','雲',['ほし','ゆき','くも','そら'],'雲（くも）: mây.'),
  officialKanji('その電車は急行ですよ。','急行',['きゅこ','きゅこう','きゅうこ','きゅうこう'],'急行（きゅうこう）: tàu tốc hành.'),
  officialKanji('これは写さないでください。','写さないで',['おさないで','うつさないで','けさないで','おとさないで'],'写す（うつす）: chép lại, chụp.'),
  officialKanji('そのいけんには反対です。','反対',['はんたい','ほんたい','はんだい','ほんだい'],'反対（はんたい）: phản đối.'),
  officialKanji('くろいくつしたがほしいです。','くろい',['白い','黒い','赤い','青い'],'くろい → 黒い: màu đen.',true),
  officialKanji('なつやすみのけいかくはまだきまっていません。','けいかく',['計書','訂画','計画','訂書'],'けいかく → 計画: kế hoạch.',true),
  officialKanji('わたしはいしゃになりたいです。','いしゃ',['匠員','医員','匠者','医者'],'いしゃ → 医者: bác sĩ.',true),
  officialKanji('あしたのよるかぞくと出かけます。','よる',['夜','昼','夕','朝'],'よる → 夜: buổi tối.',true),
  officialKanji('かさをかしてください。','かして',['貨して','資して','貸して','質して'],'かして → 貸して: cho mượn.',true),
  officialKanji('あしたはサッカーのしあいがあります。','しあい',['誡会','誡合','試会','試合'],'しあい → 試合: trận đấu.',true),
  officialVocab('さとうさんがけがをしたと聞いて、みんな（　）しました。',['しんぱい','けいけん','しつれい','おじぎ'],'しんぱい: lo lắng khi nghe tin bị thương.'),
  officialVocab('わたしには、しょうらいかしゅになるという（　）があります。',['けしき','ゆめ','おもいで','せわ'],'ゆめ: ước mơ trở thành ca sĩ.'),
  officialVocab('リーさんもこんどのパーティーに（　）来てくださいね。',['ひじょうに','ぜひ','じゅうぶん','いつも'],'ぜひ: nhất định hãy đến.'),
  officialVocab('これからきかいのつかいかたを（　）しますから、よく聞いてください。',['じゅんび','りよう','せつめい','せいさん'],'せつめい: giải thích cách dùng máy.'),
  officialVocab('はがわるいので、（　）ものは食べられません。',['きびしい','かたい','はやい','ふかい'],'かたい: đồ cứng, khó ăn khi răng yếu.'),
  officialVocab('もりさんをデートに（　）が、行けないと言われました。',['さそいました','つたえました','あんないしました','しょうかいしました'],'さそう: rủ ai đó đi chơi.'),
  officialVocab('わたしのむすこは、3年で7（　）くらいせが高くなりました。',['グラム','ばん','けん','センチ'],'センチ: đơn vị đo chiều cao.'),
  officialVocab('お店で3だいのパソコンを（　）、いちばんかるいパソコンをえらびました。',['かたづけて','かぞえて','くらべて','はらって'],'くらべる: so sánh các máy tính.'),
  officialVocab('たなかさんのいえの電気がついていませんね。たなかさんは（　）のようです。',['うそ','じゆう','ちゅうし','るす'],'るす: vắng nhà.'),
  officialVocab('へやのかぎをさがしていますが、まだ（　）。',['見つかりません','つかまえません','しりません','さわりません'],'見つかりません: vẫn chưa tìm thấy chìa khóa.'),
  officialVocab('おとうとはあのきっさてんでアルバイトをしています。',['おとうとはあのきっさてんでまっています。','おとうとはあのきっさてんではたらいています。','おとうとはあのきっさてんでコーヒーを飲んでいます。','おとうとはあのきっさてんで友だちと話しています。'],'アルバイトをする ≈ はたらく: làm thêm.'),
  officialVocab('わたしはすいえいがすきです。',['わたしははしるのがすきです。','わたしはおよぐのがすきです。','わたしはごはんを食べるのがすきです。','わたしは本を読むのがすきです。'],'すいえい ≈ およぐこと: bơi lội.'),
  officialVocab('それを聞いてびっくりしました。',['それを聞いてわらいました。','それを聞いてこまりました。','それを聞いておこりました。','それを聞いておどろきました。'],'びっくりする ≈ おどろく: ngạc nhiên.'),
  officialVocab('あの人はうつくしいですね。',['あの人はきれいですね。','あの人は元気ですね。','あの人はおもしろいですね。','あの人はわかいですね。'],'うつくしい ≈ きれい: đẹp.'),
  officialVocab('この国はこめをゆにゅうしています。',['この国はこめをほかの国にうっています。','この国はこめをほかの国からもらっています。','この国はこめをほかの国から買っています。','この国はこめをほかの国にあげています。'],'ゆにゅう: nhập khẩu, mua từ nước khác.'),
  officialVocab('さいきん',['さいきんりょうりができたので、いっしょに食べましょう。','さいきんしゅくだいを出してください。','きむらさんはさいきんけっこんしたそうです。','さいきん電車が来ますから、いそいでえきに行きましょう。'],'さいきん: gần đây, dùng với sự việc đã xảy ra.'),
  officialVocab('おと',['ラジオのおとが大きいので、もう少し小さくしてください。','日本語のおとがじょうずになりたいので、毎日たくさん話します。','店の人に大きなおとで名前をよばれました。','すずきさんがギターでゆうめいなおとをひいてくれました。'],'おと: âm thanh; ラジオのおとが大きい.'),
  officialVocab('けんがく',['かばんがほしいので、デパートに行ってけんがくします。','わからないかんじはじしょでけんがくしてください。','先生や友だちとこうじょうをけんがくしました。','まいばんテレビでニュースをけんがくしています。'],'見学（けんがく）: đi tham quan, quan sát nhà máy.'),
  officialVocab('かざる',['やまだ先生はテストのおしらせをきょうしつにかざりました。','おきゃくさんが来ますから、へやに花をかざりましょう。','天気がわるいので、せんたくものはうちの中にかざります。','こっちのエアコンは、となりのへやのかべにかざってください。'],'かざる: trang trí bằng hoa.'),
  officialVocab('こうじ',['はがいたかったので、はいしゃでこうじをしてもらいました。','このセーターは古いですが、こうじをして、ずっときています。','ほんだながこわれてしまったので、こうじをしました。','このみちはこうじをしているので、とおれません。'],'工事（こうじ）: thi công đường.'),
];
const N5_OFFICIAL_2018=[
  officialKanji('あしたは雨ですか。','雨',['ゆき','はれ','くもり','あめ'],'雨（あめ）: mưa.'),
  officialKanji('きょうしつで書いてください。','書いて',['かいて','きいて','はいて','ひいて'],'書く（かく）: viết.'),
  officialKanji('しゃしんははこの中にあります。','中',['そば','そと','なか','よこ'],'中（なか）: bên trong.'),
  officialKanji('このいすは小さいです。','小さい',['ちいさい','ちさい','しいさい','しさい'],'小さい（ちいさい）: nhỏ.'),
  officialKanji('あしたは火よう日です。','火',['どようび','すいようび','かようび','にちようび'],'火よう日（かようび）: thứ Ba.'),
  officialKanji('きれいな空ですね。','空',['いえ','うみ','にわ','そら'],'空（そら）: bầu trời.'),
  officialKanji('せいとは百人います。','百人',['ひゃくにん','びゃくにん','ひゃくじん','びゃくじん'],'百人（ひゃくにん）: một trăm người.'),
  officialKanji('魚がたくさんいますよ。','魚',['ねこ','とり','いぬ','さかな'],'魚（さかな）: cá.'),
  officialKanji('パンを半分ともだちにあげました。','半分',['はんふん','はんぶん','ほんぶん','ほんふん'],'半分（はんぶん）: một nửa.'),
  officialKanji('ぎんこうとスーパーの間にほそいみちがあります。','間',['あいた','となり','あいだ','どなり'],'間（あいだ）: ở giữa.'),
  officialKanji('たまごを三つとってください。','三つ',['いつつ','みっつ','さんつ','ごつ'],'三つ（みっつ）: ba cái.'),
  officialKanji('きょうは元気がいいですね。','元気',['けんき','げんき','でんき','てんき'],'元気（げんき）: khỏe, có sức sống.'),
  officialKanji('このわいしゃつをください。','わいしゃつ',['ウイシャソ','ウイシャツ','ワイシャソ','ワイシャツ'],'わいしゃつ → ワイシャツ: áo sơ mi.',true),
  officialKanji('わたしのくにはかわがおおいです。','かわ',['花','山','川','木'],'かわ → 川: sông.',true),
  officialKanji('ヤンさんのがっこうはどこですか。','がっこう',['宇校','学校','宇枚','学枚'],'がっこう → 学校: trường học.',true),
  officialKanji('このざっしをみてください。','みて',['見て','買て','貝て','目て'],'みて → 見て: hãy xem.',true),
  officialKanji('このカメラはたかいですね。','たかい',['高い','安い','古い','新い'],'たかい → 高い: đắt.',true),
  officialKanji('きのうはかいしゃをやすみました。','かいしゃ',['公仕','公社','会仕','会社'],'かいしゃ → 会社: công ty.',true),
  officialKanji('まだいわないでください。','いわないで',['行わないで','立わないで','言わないで','食わないで'],'いわないで → 言わないで: đừng nói.',true),
  officialKanji('らいげつけっこんします。','らいげつ',['今月','来月','来週','今週'],'らいげつ → 来月: tháng sau.',true),
  officialVocab('わたしのへやはこのアパートの4（　）です。',['ほん','さつ','だい','かい'],'4かい: tầng bốn.'),
  officialVocab('そのナイフでりんごを（　）ください。',['おきて','つけて','しめて','きって'],'きって: cắt quả táo bằng dao.'),
  officialVocab('（　）をわすれましたから、じかんがわかりません。',['じしょ','ちず','とけい','さいふ'],'とけい: đồng hồ, cần để biết giờ.'),
  officialVocab('わたしのうちはえきにちかいですから、（　）です。',['べんり','じょうぶ','いっぱい','へた'],'べんり: tiện lợi vì nhà gần ga.'),
  officialVocab('なつやすみはまいにち（　）でおよぎました。',['レストラン','プール','エレベーター','ビル'],'プール: bể bơi.'),
  officialVocab('しらないことばがありましたから、せんせいに（　）しました。',['しつもん','べんきょう','れんしゅう','じゅぎょう'],'しつもんする: hỏi giáo viên.'),
  officialVocab('このへやはあついですから、（　）をあけましょう。',['おふろ','まど','エアコン','テーブル'],'まどをあける: mở cửa sổ.'),
  officialVocab('きのうはがっこうでたくさんかんじを（　）。',['うりました','もちました','おぼえました','こまりました'],'おぼえました: đã học thuộc nhiều chữ Hán.'),
  officialVocab('このコーヒーは、さとうをたくさんいれましたから、（　）です。',['わかい','くろい','まるい','あまい'],'あまい: ngọt vì cho nhiều đường.'),
  officialVocab('つよいかぜが（　）います。',['ふいて','いそいで','とんで','はしって'],'かぜがふく: gió thổi.'),
  officialVocab('これはりょうしんのしゃしんです。',['これはそふとそぼのしゃしんです。','これはちちとははのしゃしんです。','これはあにとおとうとのしゃしんです。','これはあねといもうとのしゃしんです。'],'りょうしん ≈ ちちとはは: bố mẹ.'),
  officialVocab('このダンスはやさしいです。',['このダンスはかんたんです。','このダンスはたいへんです。','このダンスはたのしいです。','このダンスはつまらないです。'],'やさしい ≈ かんたん: dễ.'),
  officialVocab('ふくをせんたくしました。',['ふくをぬぎました。','ふくをわたしました。','ふくをあらいました。','ふくをきました。'],'せんたくする ≈ あらう: giặt quần áo.'),
  officialVocab('このへやはくらいですね。',['このへやはあかるいですね。','このへやはあかるくないですね。','このへやはしずかじゃないですね。','このへやはしずかですね。'],'くらい ≈ あかるくない: tối.'),
  officialVocab('リーさんはもりさんにペンをかしました。',['リーさんはもりさんにペンをもらいました。','もりさんはリーさんにペンをもらいました。','リーさんはもりさんにペンをかりました。','もりさんはリーさんにペンをかりました。'],'リーさんが貸す → もりさんが借りる: cho mượn → mượn.'),
];
function officialGrammar(prompt,options,note){return {skill:'grammar',prompt,options,explanation:note,mondai:1}}
function officialReading(passage,prompt,options,answer,note){return {skill:'reading',passage,prompt,options,answer:answer-1,explanation:note,mondai:4}}
const N4_OFFICIAL_GRAMMAR=[
  officialGrammar('きのうのしゅくだいは少なかったので、（　）終わりました。',['20分','20分しか','20分で','20分を'],'20分で: hoàn thành trong 20 phút.'),
  officialGrammar('このロボットは人（　）会話することができます。',['や','を','へ','と'],'人と会話する: trò chuyện với người.'),
  officialGrammar('弟は小さいときよくけがをして、両親（　）心配させました。',['で','を','の','や'],'使役形: 両親を心配させる, khiến bố mẹ lo lắng.'),
  officialGrammar('ホテルの朝ご飯のパンがとてもおいしかったので、八つ（　）食べました。',['も','に','が','で'],'八つも: ăn tới tám cái bánh.'),
  officialGrammar('この日本語のじしょは、150年前に外国人（　）作られました。',['から','を','について','によって'],'受け身＋によって: được làm bởi người nước ngoài.'),
  officialGrammar('Ａ市の運動場は（　）使えますが、予約がひつようです。',['だれでも','だれを','だれに','だれが'],'だれでも: bất kỳ ai cũng sử dụng được.'),
  officialGrammar('前田「リーさん、いつも（　）国のかぞくにれんらくしますか。」リー「メールを書くことが多いです。」',['どのぐらい','どの','どうやって','どういう'],'どうやって: hỏi cách thức liên lạc.'),
  officialGrammar('娘は先月高校を卒業しました。（　）大学の入学式です。',['だんだん','あまり','だいたい','もうすぐ'],'もうすぐ: lễ nhập học sắp đến.'),
  officialGrammar('今朝は駅に行くバスが（　）来なかったので、タクシーで行きました。',['やっと','なかなか','きっと','いつか'],'なかなか＋否定: mãi mà xe buýt không tới.'),
  officialGrammar('山下「あしたかあさって、カラオケに行かない？」南「あしたは都合が悪いけど、あさって（　）大丈夫だよ。」',['なのに','だから','でも','なら'],'あさってなら: nếu là ngày kia thì được.'),
  officialGrammar('私は（　）間、スーパーでアルバイトをしていました。',['夏休みに','夏休みで','夏休みの','夏休み'],'名詞＋の間: trong kỳ nghỉ hè.'),
  officialGrammar('先週庭の木のえだを切りました。ぜんぶ（　）2時間かかりました。',['切ったり','切るのに','切りに','切るかどうか'],'切るのに: mất hai giờ để cắt.'),
  officialGrammar('木村「あしたの午後、サッカーの練習に行きますか。」山田「行きます。でも午前中に用事があるので、（　）。」',['遅れないでください','遅れないほうがいいです','遅れるかもしれません','遅れてはいけません'],'かもしれません: có thể sẽ đến muộn.'),
  officialGrammar('森「空いている席がありませんね。」田中「あ、でも、あそこの席が（　）よ。」森「本当ですね。空くまで待ちましょう。」',['空きそうです','空きました','空いています','空いたようです'],'空きそうです: chỗ đó có vẻ sắp trống.'),
  officialGrammar('林「会議のじゅんびは終わりましたか。てつだいましょうか。」上田「いすが一つ足りないので、となりの会議室から（　）。」',['持ってこなくてもいいですか','持ってきてもらえますか','持ってこないといけませんか','持ってきていませんか'],'～てもらえますか: nhờ mang giúp một chiếc ghế.'),
];
const N5_OFFICIAL_GRAMMAR=[
  officialGrammar('私はあしたのひこうき（　）国へ帰ります。',['に','で','か','を'],'ひこうきで: về nước bằng máy bay.'),
  officialGrammar('先週デパートでかばん（　）くつなどを買いました。',['は','も','へ','や'],'や: liệt kê một số đồ đã mua.'),
  officialGrammar('私は毎朝8時ごろ家（　）出ます。',['を','と','が','で'],'家を出る: rời khỏi nhà.'),
  officialGrammar('きのうスーパーで田中さん（　）会いました。',['を','の','で','に'],'人に会う: gặp ai đó.'),
  officialGrammar('私のうちのほんだなは、きょねん父（　）作りました。',['や','が','を','で'],'父が作りました: bố đã làm chiếc giá sách.'),
  officialGrammar('今日やおやでりんごを買いました。五つ（　）300円でした。',['に','と','で','や'],'五つで: năm quả hết 300 yên.'),
  officialGrammar('きのう（　）少し寒かったですが、今日（　）寒くないです。',['は／は','に／に','も／も','を／を'],'は／は: đối chiếu hôm qua và hôm nay.'),
  officialGrammar('南町は海がきれい（　）、静かです。',['も','や','で','と'],'きれいで: nối tính từ な với 静か.'),
  officialGrammar('前川「林さん、（　）にあるカメラは林さんのですか。」林「いいえ。田中さんのですよ。」',['そこ','どこ','その','どの'],'そこにある: chiếc máy ảnh ở chỗ đó.'),
  officialGrammar('Ａ「先週はじめてスキーをしました。」Ｂ「そうですか。（　）でしたか。」Ａ「とても楽しかったです。」',['いくつ','いかが','どなた','どちら'],'いかがでしたか: thế nào?' ),
  officialGrammar('森「大学のじゅぎょうは始まりましたか。」ケン「いいえ、（　）です。来週始まります。」',['よく','もう','ちょっと','まだ'],'まだです: vẫn chưa bắt đầu.'),
  officialGrammar('いしゃ「今日から一週間薬を飲んで、来週の月曜日に（　）来てください。」',['たくさん','あまり','また','だんだん'],'また来てください: hãy quay lại.'),
  officialGrammar('父は毎朝コーヒーを（　）ながら新聞を読みます。',['飲む','飲み','飲んで','飲んだ'],'Vます bỏ ます＋ながら: vừa uống cà phê vừa đọc báo.'),
  officialGrammar('私は小さいとき、なっとうが好き（　）でした。',['ない','じゃない','ありません','じゃありません'],'好きじゃありませんでした: trước đây không thích natto.'),
  officialGrammar('山下「いちごのケーキを二つ（　）。」店の人「はい。ありがとうございます。」',['ありますか','どうぞ','ください','ほしいですか'],'二つください: cho tôi hai chiếc.'),
  officialGrammar('リー「日曜日に私の家でべんきょうをします。キムさんも（　）。」キム「行きたいです。」',['来ませんか','来ていますか','来ませんでしたか','来ていましたか'],'来ませんか: lời mời đến học cùng.'),
];
const N4_G_ANSWER=[3,4,2,1,4,1,3,4,2,4,3,2,3,1,2];
const N5_G_ANSWER=[2,4,1,4,2,3,1,3,1,2,4,3,2,4,3,1];
const N4_OFFICIAL_READING=[
  officialReading('アイスクリームは、夏に食べるととてもおいしいですが、私は寒い冬でも時々食べます。夏は毎日食べるので安いものしか買いませんが、冬は高いものを買います。暖かい部屋でいいアイスクリームを食べるのが、私の楽しみなのです。','私の楽しみは何ですか。',['冬に暖かい部屋で毎日アイスクリームを食べること','冬に暖かい部屋で高いアイスクリームを食べること','夏に毎日アイスクリームを食べること','夏に高いアイスクリームを食べること'],2,'冬に暖かい部屋で高いアイスクリームを食べること。'),
  officialReading('昨日初めて黒い消しゴムを買いました。レジの人が「白いのは、使うと消しゴムが黒く汚れて嫌だと言う人が多いから、黒いのを作ったそうですよ。」と教えてくれました。私は色がかっこいいから買ったので、理由を聞いて面白いなと思いました。','「私」はどうして黒い消しゴムを買いましたか。',['黒い消しゴムは、使った後で消しゴムが黒く汚れないから','黒い消しゴムを買う人が多いと店の人に聞いたから','黒い消しゴムのほうが字をきれいに消せるから','黒い消しゴムは、色がかっこいいと思ったから'],4,'Người kể mua vì thấy màu đen đẹp/ngầu.'),
];
const N5_OFFICIAL_READING=[
  officialReading('わたしは毎朝ご飯となっとうか、パンとたまごを食べて、学校へ行きます。でも、けさはなにも食べませんでした。バナナを学校へ持っていきました。起きた時間がおそかったからです。','けさ「わたし」は学校へ行く前に、何を食べましたか。',['ご飯となっとうを食べました。','パンとたまごを食べました。','なにも食べませんでした。','バナナを食べました。'],3,'けさはなにも食べませんでした: sáng nay không ăn gì.'),
];
const N4_ANSWER=[3,4,1,2,4,3,4,2,1,2,3,4,1,3,4,1,2,2,3,2,1,4,3,4,1,2,2,4,1,3,3,1,3,2,4];
const N5_ANSWER=[4,1,3,1,3,4,1,4,2,3,2,2,4,3,2,1,1,4,3,2,4,4,3,1,2,1,2,3,4,1,2,1,3,2,4];
for(const [level,questions,answers] of [['N4',N4_OFFICIAL_2018,N4_ANSWER],['N5',N5_OFFICIAL_2018,N5_ANSWER]]){
  if(questions.length!==35||answers.length!==35)throw Error('Incomplete official '+level+' vocabulary section');
  questions.forEach((question,index)=>{question.answer=answers[index]-1;question.mondai=index<(level==='N4'?9:12)?1:index<(level==='N4'?15:20)?2:index<(level==='N4'?25:30)?3:index<(level==='N4'?30:35)?4:5});
  const grammar=level==='N4'?N4_OFFICIAL_GRAMMAR:N5_OFFICIAL_GRAMMAR;
  const grammarAnswers=level==='N4'?N4_G_ANSWER:N5_G_ANSWER;
  if(grammar.length!==grammarAnswers.length)throw Error('Incomplete grammar section');
  grammar.forEach((question,index)=>{question.answer=grammarAnswers[index]-1});
  const reading=level==='N4'?N4_OFFICIAL_READING:N5_OFFICIAL_READING;
  const selected=[...questions,...grammar,...reading];
  PRACTICE_EXAMS.push({id:'official-2018-'+level.toLowerCase()+'-v',title:level+' · Trích đề chính thức 2018',level,description:selected.length+' câu · từ đề từng dùng trong kỳ thi',official:true,source:OFFICIAL_2018_SOURCE,sourceUrl:'https://www.jlpt.jp/e/samples/sampleindex.html',questions:selected});
}
