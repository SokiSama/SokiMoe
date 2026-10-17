import gameDetails from "../../data/game-details.json";
import additionalSteamGames from "../../data/additional-steam-games.json";

const gameDescriptions: Record<string, { summary: string; sourceUrl: string }> = gameDetails;

export type CollectionKind = "books" | "manga" | "anime" | "games";
export type GamePlatform = "PS3" | "PS4" | "PS5" | "PSPC" | "Steam";
export type CollectionEntry = {
  id: string;
  kind: CollectionKind;
  title: string;
  cover: string;
  category: string;
  status: string;
  progress: string;
  url: string;
  summary: string;
  originalTitle?: string;
  summaryUnavailable?: boolean;
  platforms?: GamePlatform[];
  edition?: string;
  steamAppId?: number;
};

export type AnimeResponseItem = {
  id: number;
  title: string;
  originalTitle: string;
  cover: string;
  statusText: string;
  watchedEpisodes: number;
  totalEpisodes: number;
  summary: string;
  summaryUnavailable?: boolean;
  tags: string[];
};

const genres = ["音乐", "偶像", "日常", "奇幻", "科幻", "校园", "悬疑", "恋爱", "搞笑", "治愈", "战斗"];

export function toCollectionEntry(item: AnimeResponseItem): CollectionEntry {
  return {
    id: String(item.id), kind: "anime", title: item.title, originalTitle: item.originalTitle,
    cover: item.cover, category: genres.find(genre => item.tags.includes(genre)) || "其他",
    status: item.statusText === "看过" ? "看过" : "未看", progress: "",
    url: `https://bgm.tv/subject/${item.id}`, summary: item.summary, summaryUnavailable: item.summaryUnavailable,
  };
}

const readingCollection: CollectionEntry[] = [
  {
    id: "manga-gochiusa", kind: "manga", title: "请问您今天要来点兔子吗？",
    originalTitle: "ご注文はうさぎですか？ 点兔 Is the Order a Rabbit?",
    cover: "/images/collection/manga-gochiusa.webp", category: "日常", status: "已收录",
    progress: "Koi · 漫画",
    url: "https://houbunsha.co.jp/comics/detail.php?p=%A4%B4%C3%ED%CA%B8%A4%CF%A4%A6%A4%B5%A4%AE%A4%C7%A4%B9%A4%AB%A1%A9",
    summary: "为了上学来到木结构街道的少女心爱，寄住在咖啡店 Rabbit House，并与店里的智乃、理世等人相识。上学、打工和朋友间的小插曲，渐渐成为她在这座小镇上的日常。\n\nKoi 以四格漫画的节奏描绘少女们的友情与成长，让咖啡香、兔子与温柔的相伴，串起一个个轻松的片刻。",
  },
  {
    id: "manga-atri", kind: "manga", title: "ATRI -My Dear Moments-",
    originalTitle: "アトリ ATRI My Dear Moments 亚托莉",
    cover: "/images/collection/manga-atri.webp", category: "科幻", status: "已收录",
    progress: "ANIPLEX.EXE / じゃこ · 漫画",
    url: "https://www.kadokawa.co.jp/product/322211000846/",
    summary: "海平面不断上升的近未来，少年夏生回到海边的小镇，在寻找海底遗物时遇见了沉睡的仿生少女亚托莉。失去一条腿的夏生与拥有丰富表情的她，由此开始共同生活。\n\n这部由じゃこ绘制的同名游戏改编漫画，在逐渐沉没的世界中，描绘人与仿生少女的相遇，以及那些值得珍藏的时光。",
  },
  {
    id: "book-villainess-99", kind: "books", title: "恶役千金LV99～我是隐藏BOSS但不是魔王～",
    originalTitle: "悪役令嬢レベル99 ～私は裏ボスですが魔王ではありません～ 反派千金 反派大小姐等级99",
    cover: "/images/collection/novel-villainess-99.webp", category: "奇幻", status: "已收录",
    progress: "七夕さとり · 轻小说",
    url: "https://www.kadokawa.co.jp/product/321901000608/",
    summary: "转生成乙女游戏中反派千金的尤蜜拉，发现自己其实是主线结束后登场的隐藏首领。为了平静生活，她决定远离故事，却因热衷练级，在入学前就达到了等级99。\n\n实力暴露后，同学们甚至怀疑她就是魔王。七夕さとり以带有喜剧色彩的叙述，描绘这位过于强大、却不擅长与人相处的少女如何度过校园生活。",
  },
  {
    id: "book-alya", kind: "books", title: "不时轻声地以俄语遮羞的邻座艾莉同学",
    originalTitle: "時々ボソッとロシア語でデレる隣のアーリャさん Alya Sometimes Hides Her Feelings in Russian 以俄语遮羞的艾莉同学",
    cover: "/images/collection/novel-alya.webp", category: "校园", status: "已收录",
    progress: "燦燦SUN · 轻小说",
    url: "https://www.kadokawa.co.jp/product/322011000027/",
    summary: "成绩优秀、看起来难以亲近的艾莉，偶尔会用俄语向邻座的久世政近流露真实心情。她不知道的是，政近其实听得懂俄语，只是一直装作没有理解。\n\n从只有两人才知晓的对话开始，课堂、学生会与日常相处让彼此逐渐走近。这是燦燦SUN 创作、ももこ绘制插画的校园恋爱小说。",
  },
  {
    id: "book-oregairu", kind: "books", title: "我的青春恋爱物语果然有问题",
    originalTitle: "やはり俺の青春ラブコメはまちがっている。 春物 春物语 果然我的青春恋爱喜剧搞错了 Oregairu",
    cover: "/images/collection/novel-oregairu.webp", category: "校园", status: "已收录",
    progress: "渡航 · 轻小说",
    url: "https://e-comi.shogakukan.co.jp/books/094512620000d0000000",
    summary: "习惯独来独往的比企谷八幡，被老师带进了帮助他人解决烦恼的奉仕部。在那里，他遇见了雪之下雪乃，随后由比滨结衣也加入其中。\n\n面对同学们的委托，三人常常给出截然不同的答案。随着相处渐深，八幡也开始重新审视自己与他人的距离。这是渡航创作、ぽんかん⑧绘制插画的校园青春小说。",
  },
  {
    id: "book-anohana", kind: "books", title: "未闻花名",
    originalTitle: "あの日見た花の名前を僕達はまだ知らない。 我们仍未知道那天所看见的花的名字 Anohana",
    cover: "/images/collection/novel-anohana.webp", category: "奇幻", status: "已收录",
    progress: "冈田麿里 · 小说",
    url: "https://www.kadokawa.co.jp/product/321603000119/",
    summary: "曾经亲密无间的童年伙伴，因为一场意外渐渐疏远。多年后，只有仁太能够看见的面码突然出现，希望大家帮她完成一个愿望。\n\n为了找出这个愿望，早已各自生活的伙伴再次聚到一起，也重新面对那段没有说出口的回忆。小说由动画编剧冈田麿里执笔，描绘友情、遗憾与告别。",
  },
  {
    id: "book-your-name", kind: "books", title: "你的名字。",
    originalTitle: "小説 君の名は。 Your Name",
    cover: "/images/collection/novel-your-name.webp", category: "奇幻", status: "已收录",
    progress: "新海诚 · 小说",
    url: "https://www.kadokawa.co.jp/product/321603000121/",
    summary: "住在山间小镇的三叶与生活在东京的泷，开始在梦中交换身体。两个从未见过面的人，通过留下的讯息逐渐认识彼此，也走进对方的生活。\n\n当交换突然停止，一段寻找彼此的旅程随之展开。新海诚亲自执笔的小说，以文字描绘距离、记忆与命运交错中的相遇。",
  },
  {
    id: "book-weathering-with-you", kind: "books", title: "天气之子",
    originalTitle: "小説 天気の子 Weathering With You",
    cover: "/images/collection/novel-weathering-with-you.webp", category: "奇幻", status: "已收录",
    progress: "新海诚 · 小说",
    url: "https://www.kadokawa.co.jp/product/321903000333/",
    summary: "离开故乡来到东京的少年帆高，在连绵的雨中遇见了少女阳菜。她拥有通过祈祷让天空放晴的力量，两人由此开始帮助需要晴天的人们。\n\n然而，这份能力也让他们面对意想不到的抉择。新海诚亲自创作的小说，在都市、天气与少年的成长之间，描绘想要守护重要之人的心情。",
  },
  {
    id: "manga-saint-cecilia", kind: "manga", title: "白圣女与黑牧师",
    originalTitle: "白聖女と黒牧師 白圣女与黑巫师 Saint Cecilia and Pastor Lawrence",
    cover: "/images/collection/manga-saint-cecilia.webp", category: "恋爱", status: "已收录",
    progress: "和武叶佐乃 · 漫画",
    url: "https://www.kodansha.co.jp/comic/products/0000052443",
    summary: "一座小小的教会里，圣女塞西莉亚与牧师劳伦斯共同生活。在人们面前温柔可靠的圣女，私下却喜欢放松偷懒；擅长照顾人的牧师，则总是没有察觉她的心意。\n\n和武叶佐乃以柔和的画风，描绘两人在奇幻小镇里的日常，以及这段缓慢靠近、令人着急又温暖的恋情。",
  },
  {
    id: "manga-umaru", kind: "manga", title: "干物妹！小埋",
    originalTitle: "干物妹！うまるちゃん Himouto! Umaru-chan 干物妹小埋",
    cover: "/images/collection/manga-umaru.webp", category: "日常", status: "已收录",
    progress: "三角头 · 漫画",
    url: "https://books.shueisha.co.jp/items/contents.html?jdcn=08879706879706315501",
    summary: "在学校里，土间埋是成绩出色、举止得体的完美女高中生。可一回到家，她就披上仓鼠斗篷，抱着零食和游戏，变成依赖哥哥太平的懒散妹妹。\n\n围绕兄妹二人的生活，以及小埋与朋友们的相处，三角头描绘了充满小插曲的日常喜剧，也留下彼此照顾的温柔片刻。",
  },
  {
    id: "book-mushoku-tensei", kind: "books", title: "无职转生",
    originalTitle: "無職転生 ～異世界行ったら本気だす～ 到了异世界就拿出真本事",
    cover: "/images/collection/novel-mushoku-tensei.jpg", category: "奇幻", status: "已收录",
    progress: "理不尽な孫の手 · 轻小说",
    url: "https://store.kadokawa.co.jp/shop/g/g301312000360/",
    summary: "一名对过去人生充满遗憾的男子，在意外后转生到剑与魔法的世界，成为名叫鲁迪乌斯的孩子。他保留着前世的记忆，也决定认真对待这次重新开始的机会。\n\n从学习语言与魔法，到结识家人、老师和伙伴，他在旅途中面对自己的软弱，逐渐寻找生活的意义。这是一段关于成长、选择与重新出发的异世界故事。",
  },
  {
    id: "book-wandering-witch", kind: "books", title: "魔女之旅",
    originalTitle: "魔女の旅々 Majo no Tabitabi",
    cover: "/images/collection/novel-wandering-witch.jpg", category: "奇幻", status: "已收录",
    progress: "白石定规 · 轻小说",
    url: "https://www.ching-win.com.tw/product-detail/40115701",
    summary: "灰之魔女伊蕾娜独自踏上旅途，随心所欲地走过一个又一个国家。每个地方都有自己的规则与故事，每次相遇也可能带来截然不同的风景。\n\n她既会见到温柔美好的日常，也会遇上荒诞、悲伤与难以改变的现实。作品以一个个短篇串起魔女的见闻，在相逢和离别之间，留下旅人对世界的观察。",
  },
  {
    id: "book-lovelive-diary", kind: "books", title: "LoveLive 学园偶像日记",
    originalTitle: "ラブライブ！ School idol diary 校园偶像日记 高坂穗乃果 公野樱子",
    cover: "/images/collection/novel-lovelive-diary.webp", category: "校园", status: "已收录",
    progress: "公野樱子 · 小说",
    url: "https://www.kadokawa.co.jp/product/311849300000/",
    summary: "μ's 的九位成员以轮流记录日记的方式，写下学园偶像活动和校园生活中的点点滴滴。练习时的小插曲、朋友间的交流，以及舞台之外的心事，都成为活动日志的一部分。\n\n这套由公野樱子创作的小说从成员各自的视角展开，展现她们的性格、烦恼和梦想，以及共同度过的青春时光。",
  },
  {
    id: "book-makeine", kind: "books", title: "败北女角太多了！",
    originalTitle: "負けヒロインが多すぎる！ 败北女主太多了 Too Many Losing Heroines",
    cover: "/images/collection/novel-makeine.jpg", category: "校园", status: "已收录",
    progress: "雨森焚火 · 轻小说",
    url: "https://www.shogakukan.co.jp/books/09453017",
    summary: "自认只是班级背景人物的温水和彦，偶然撞见八奈见杏菜失恋的现场。从一次倾诉与一份便当开始，他被卷入几位没能赢得恋情的少女的日常。\n\n八奈见杏菜、烧盐柠檬和小鞠知花，各自带着遗憾继续向前。围绕她们展开的校园恋爱喜剧，描写失恋之后的友情、成长，以及尚未说出口的心意。",
  },
  {
    id: "manga-happy-sugar-life", kind: "manga", title: "Happy Sugar Life",
    originalTitle: "ハッピーシュガーライフ 幸福甜蜜生活 砂糖的幸福生活",
    cover: "/images/collection/happy-sugar-life-manga.jpg", category: "悬疑", status: "已收录",
    progress: "键空富烧 · 漫画",
    url: "https://www.ching-win.com.tw/product-detail/10513401",
    summary: "松坂砂糖一直不明白爱是什么，直到遇见神户盐。与盐一起生活的日子，让她第一次感受到甜蜜的幸福。\n\n然而，平静的日常背后藏着秘密。为了守住这份感情，砂糖逐渐越过一道道界限。键空富烧以甜美画风描绘爱与执念交织的心理悬疑故事。",
  },
  {
    id: "manga-oshi-no-ko", kind: "manga", title: "我推的孩子",
    originalTitle: "【推しの子】 Oshi no Ko",
    cover: "/images/collection/manga-oshi-no-ko.jpg", category: "悬疑", status: "已收录",
    progress: "赤坂明 × 横枪萌果 · 漫画",
    url: "https://www.ching-win.com.tw/product-detail/10264501",
    summary: "在地方医院工作的医生五郎，一直支持着偶像星野爱。一次意外的相遇，让原本相隔甚远的两个人产生联系，也将他的命运带向意想不到的方向。\n\n由赤坂明负责原作、横枪萌果作画，作品围绕偶像、演员与演艺行业展开，在聚光灯照不到的地方，描绘谎言、梦想与复杂的人际关系。",
  },
  {
    id: "manga-watanare", kind: "manga", title: "我们不可能成为恋人！绝对不行。（※似乎可行？）",
    originalTitle: "わたしが恋人になれるわけないじゃん、ムリムリ！（※ムリじゃなかった!?） 我恋不行",
    cover: "/images/collection/manga-watanare.jpg", category: "恋爱", status: "已收录",
    progress: "みかみてれん / むっしゅ · 漫画",
    url: "https://dash.shueisha.co.jp/bookDetail/index/978-4-08-891719-1",
    summary: "为了告别不擅长社交的过去，甘织玲奈子努力开启理想中的高中生活。她与校园里的风云人物王冢真唯互相倾诉烦恼，本以为终于交到了能够信赖的朋友。\n\n然而，真唯突如其来的告白打乱了一切：玲奈子想要的是朋友，真唯追求的却是恋人。两人围绕友情与恋爱的距离展开拉锯。这是由むっしゅ作画的同名轻小说改编漫画。",
  },
  {
    id: "manga-hello-sweetheart", kind: "manga", title: "Hello，甜心！",
    originalTitle: "HELLO甜心 Hello Sweetheart ROCKY君",
    cover: "/images/collection/manga-hello-sweetheart.jpg", category: "校园", status: "已收录",
    progress: "ROCKY 君 · 漫画",
    url: "https://book.douban.com/subject/10515188/",
    summary: "喜欢摄影的少年易晨，在转学后与 Cosplay 社团“蓝瑟”的成员相遇。原本安静的生活，因为性格各异的伙伴而逐渐热闹起来。\n\n围绕社团活动、校园日常和共同的梦想，少年少女们在相处中经历友情与朦胧的心动。ROCKY 君以轻快的节奏和明亮的画风，描绘这段充满活力的青春生活。",
  },
];

// Titles, editions and owned platforms follow the supplied collection screenshots.
// These are collection entries, without inferred playtime or completion status.
const existingGames: Array<{
  id: string; title: string; originalTitle: string; category: string;
  platforms: GamePlatform[]; edition?: string; steamAppId?: number;
}> = [
  { id: "memories-off", title: "秋之回忆 -无垢少女-", originalTitle: "メモリーズオフ -Innocent Fille- Memories Off", category: "视觉小说", platforms: ["PS4", "Steam"], steamAppId: 738510 },
  { id: "persona-5-strikers", title: "女神异闻录5 乱战 魅影攻手", originalTitle: "Persona 5 Strikers ペルソナ5 スクランブル", category: "角色扮演", platforms: ["PS4"], edition: "港版 · 中文" },
  { id: "ghost-of-yotei", title: "羊蹄山之魂", originalTitle: "Ghost of Yōtei Ghost of Yotei", category: "动作冒险", platforms: ["PS5"] },
  { id: "spider-man-remastered", title: "漫威蜘蛛侠 Remastered", originalTitle: "Marvel's Spider-Man Remastered", category: "动作冒险", platforms: ["PS5"] },
  { id: "007-first-light", title: "007 初露锋芒", originalTitle: "007 First Light", category: "动作冒险", platforms: ["PS5"] },
  { id: "yohane-deepblue", title: "幻日夜羽 湛海耀光", originalTitle: "YOHANE THE PARHELION -BLAZE in the DEEPBLUE- 幻日のヨハネ", category: "动作冒险", platforms: ["PS5"] },
  { id: "final-fantasy-7-remake", title: "最终幻想7 重制版", originalTitle: "FINAL FANTASY VII REMAKE", category: "角色扮演", platforms: ["PS5"], edition: "港版 · 中文" },
  { id: "life-is-strange-reunion", title: "奇异人生 重逢", originalTitle: "Life is Strange: Reunion", category: "剧情冒险", platforms: ["PS5"] },
  { id: "gran-turismo-7", title: "跑车浪漫旅7", originalTitle: "Gran Turismo 7 GT7", category: "竞速模拟", platforms: ["PS5"] },
  { id: "death-stranding-directors-cut", title: "死亡搁浅 导演剪辑版", originalTitle: "DEATH STRANDING DIRECTOR'S CUT", category: "动作冒险", platforms: ["PS5"] },
  { id: "granblue-fantasy-relink", title: "碧蓝幻想 Relink", originalTitle: "Granblue Fantasy: Relink", category: "角色扮演", platforms: ["PS5"] },
  { id: "the-last-of-us-part-1", title: "最后生还者 第一幕", originalTitle: "The Last of Us Part I", category: "动作冒险", platforms: ["PS5"] },
  { id: "spider-man-2", title: "漫威蜘蛛侠2", originalTitle: "Marvel's Spider-Man 2", category: "动作冒险", platforms: ["PS5", "PSPC"] },
  { id: "black-myth-wukong", title: "黑神话 悟空", originalTitle: "Black Myth: Wukong", category: "角色扮演", platforms: ["PS5"] },
  { id: "umamusume-party-dash", title: "赛马娘 Pretty Derby 热血喧闹大感谢祭！", originalTitle: "Umamusume: Pretty Derby – Party Dash", category: "休闲派对", platforms: ["PS4"] },
  { id: "uncharted-legacy-of-thieves", title: "神秘海域 盗贼传奇合辑", originalTitle: "UNCHARTED: Legacy of Thieves Collection", category: "动作冒险", platforms: ["PS5"] },
  { id: "persona-3-reload", title: "女神异闻录3 Reload", originalTitle: "Persona 3 Reload ペルソナ3 リロード", category: "角色扮演", platforms: ["PS5"], edition: "港版 · 中文" },
  { id: "cyberpunk-2077", title: "赛博朋克2077", originalTitle: "Cyberpunk 2077", category: "角色扮演", platforms: ["PS5"] },
  { id: "doki-doki-literature-club-plus", title: "心跳文学部Plus!", originalTitle: "Doki Doki Literature Club Plus!", category: "视觉小说", platforms: ["PS5"], edition: "港版 · 日版 · 中文" },
  { id: "spider-man-miles-morales", title: "漫威蜘蛛侠 迈尔斯 莫拉莱斯", originalTitle: "Marvel's Spider-Man: Miles Morales", category: "动作冒险", platforms: ["PS5"] },
  { id: "persona-5-royal", title: "女神异闻录5 皇家版", originalTitle: "Persona 5 Royal ペルソナ5 ザ・ロイヤル", category: "角色扮演", platforms: ["PS5"], edition: "港版 · 中文" },
  { id: "sabbat-of-the-witch", title: "魔女的夜宴", originalTitle: "Sabbat of the Witch サノバウィッチ", category: "视觉小说", platforms: ["Steam"], steamAppId: 888790 },
  { id: "senren-banka", title: "千恋＊万花", originalTitle: "Senren Banka 千恋＊万花", category: "视觉小说", platforms: ["Steam"], steamAppId: 1144400 },
  { id: "melancholy-love", title: "千面 Melancholy Love", originalTitle: "Melancholy Love", category: "视觉小说", platforms: ["Steam"], steamAppId: 1168470 },
  { id: "hookah-haze", title: "水烟水雾", originalTitle: "Hookah Haze", category: "视觉小说", platforms: ["Steam"], steamAppId: 2470300 },
  { id: "make-butter-together", title: "我的纸片人女友", originalTitle: "Make butter together!", category: "视觉小说", platforms: ["Steam"], steamAppId: 1070020 },
  { id: "koi-x-shin-ai-kanojo", title: "想要传达给你的爱恋", originalTitle: "Koi x Shin Ai Kanojo 恋×シンアイ彼女", category: "视觉小说", platforms: ["Steam"], steamAppId: 2242710 },
  { id: "cafe-stella", title: "星光咖啡馆与死神之蝶", originalTitle: "Cafe Stella and the Reaper's Butterflies 喫茶ステラと死神の蝶", category: "视觉小说", platforms: ["Steam"], steamAppId: 1829980 },
  { id: "christmas-tina", title: "泡沫冬景", originalTitle: "Christmas Tina", category: "视觉小说", platforms: ["Steam"], steamAppId: 1049100 },
  { id: "karakara", title: "KARAKARA", originalTitle: "カラカラ", category: "视觉小说", platforms: ["Steam"], steamAppId: 487430 },
  { id: "lamunation", title: "LAMUNATION! -international-", originalTitle: "ラムネーション！", category: "视觉小说", platforms: ["Steam"], steamAppId: 1025140 },
  { id: "nekopara-extra", title: "NEKOPARA Extra", originalTitle: "猫娘乐园 Extra ネコぱらExtra", category: "视觉小说", platforms: ["Steam"], steamAppId: 899970 },
  { id: "nekopara-vol-0", title: "NEKOPARA Vol. 0", originalTitle: "猫娘乐园 Vol. 0 ネコぱら", category: "视觉小说", platforms: ["Steam"], steamAppId: 385800 },
  { id: "nekopara-vol-1", title: "NEKOPARA Vol. 1", originalTitle: "猫娘乐园 Vol. 1 ネコぱら", category: "视觉小说", platforms: ["Steam"], steamAppId: 333600 },
  { id: "nekopara-vol-2", title: "NEKOPARA Vol. 2", originalTitle: "猫娘乐园 Vol. 2 ネコぱら", category: "视觉小说", platforms: ["Steam"], steamAppId: 420110 },
  { id: "nekopara-vol-3", title: "NEKOPARA Vol. 3", originalTitle: "猫娘乐园 Vol. 3 ネコぱら", category: "视觉小说", platforms: ["Steam"], steamAppId: 602520 },
  { id: "nekopara-vol-4", title: "NEKOPARA Vol. 4", originalTitle: "猫娘乐园 Vol. 4 ネコぱら", category: "视觉小说", platforms: ["Steam"], steamAppId: 1406990 },
  { id: "riddle-joker", title: "RIDDLE JOKER", originalTitle: "リドルジョーカー", category: "视觉小说", platforms: ["Steam"], steamAppId: 1277930 },
  { id: "tricolour-lovestory", title: "三色绘恋", originalTitle: "Tricolour Lovestory", category: "视觉小说", platforms: ["Steam"], steamAppId: 668630 },
  { id: "vampires-melody", title: "Vampires' Melody", originalTitle: "吸血鬼的旋律", category: "视觉小说", platforms: ["Steam"], steamAppId: 1377360 },
  { id: "vampires-melody-2", title: "Vampires' Melody 2", originalTitle: "吸血鬼的旋律2", category: "视觉小说", platforms: ["Steam"], steamAppId: 2532050 },
  { id: "heaven-burns-red", title: "绯染天空 Heaven Burns Red", originalTitle: "ヘブンバーンズレッド", category: "视觉小说", platforms: ["Steam"], steamAppId: 1973710 },
];

const games = [
  ...existingGames,
  ...additionalSteamGames.map(game => ({ ...game, platforms: ["Steam"] as GamePlatform[] })),
];

export const collection: CollectionEntry[] = [...readingCollection, ...games.map(game => ({
  ...game,
  id: `game-${game.id}`,
  kind: "games" as const,
  cover: `/images/collection/games/${game.id}-cover.webp`,
  status: "已收录",
  progress: ("edition" in game && game.edition) || game.category,
  summary: gameDescriptions[game.id]?.summary || "",
  url: game.steamAppId ? `https://store.steampowered.com/app/${game.steamAppId}/` : `https://store.playstation.com/zh-hant-hk/search/${encodeURIComponent(game.title)}`,
}))];
