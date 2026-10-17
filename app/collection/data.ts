import { animeProgress } from "../lib/bangumiCollection";

export type CollectionKind = "books" | "manga" | "anime";
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
    status: item.statusText, progress: animeProgress(item.statusText, item.watchedEpisodes, item.totalEpisodes),
    url: `https://bgm.tv/subject/${item.id}`, summary: item.summary, summaryUnavailable: item.summaryUnavailable,
  };
}

export const collection: CollectionEntry[] = [
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
