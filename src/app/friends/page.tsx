import Image from 'next/image';

export default function FriendsPage() {
  const friends = [
    {
      title: 'ATao-Blog',
      avatar: 'https://cdn.atao.cyou/Web/Avatar.png',
      description: '做自己喜欢的事',
      url: 'https://blog.atao.cyou',
    },
    {
      title: 'SatouのBlog',
      avatar: 'https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg',
      description: '彼女の愛は、甘くて痛い',
      url: 'https://www.matsusatou.top',
    },
  ];

  return (
    <div className="content-wrapper py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 fade-in-up">Friends</h1>
        <p
          className="text-muted-foreground mb-4 fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          友链
        </p>

        <div className="mb-4 card px-6 py-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>相识便是友人，欢迎交换友链</p>
          <p className="mt-2">
            只需要将你的友链，在主页上列出的任意联系方式申请即可。
          </p>
          <p className="mt-1">
            也可以将友链格式发送至我的邮箱：sokisama0@gmail.com，我看到后会尽快审核并添加。
          </p>
        </div>

        <div className="mb-8 card px-6 py-4 text-xs md:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>在添加友链前：</p>
          <p className="mt-1">
            有一个固定的域名，不能是托管的域名（e.g.：.github.io、.vercel.app、netlify.app.）
          </p>
          <p className="mt-1">
            仅支持个人博客，恕不接受商业类 &amp; 无原创内容的博客
          </p>
          <p className="mt-1">
            请确保内容输出，符合行为规范，无不良内容
          </p>

          <p className="mt-4 text-neutral-500 dark:text-neutral-400">
            以下是我的友链信息，你也可以参考此格式添加友链：
          </p>

          <div className="mt-2 font-mono space-y-1 break-words">
            <div>标题: SatouのBlog</div>
            <div>头像: https://cdn.jsdelivr.net/gh/SokiSama/picked@main/avatar.jpg</div>
            <div>描述: 彼女の愛は、甘くて痛い</div>
            <div>地址: https://www.matsusatou.top</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {friends.map((friend) => (
            <a
              key={friend.url}
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group card bg-none shadow-none p-10 min-h-[260px] block transform-gpu transition-all duration-300 ease-in-out hover:-translate-y-3 hover:shadow-[0_14px_45px_-12px_rgba(0,0,0,0.16)] focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="mb-6">
                <div className="relative w-24 h-24">
                  <div className="absolute -inset-3 rounded-full bg-pink-200 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70 dark:bg-pink-500/40" />
                  <div className="absolute -inset-1 rounded-full bg-pink-100 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-80 dark:bg-pink-500/30" />
                  {friend.avatar.startsWith('http') ? (
                    <Image
                      src={friend.avatar}
                      alt={friend.title}
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-full object-cover ring-2 ring-primary/30 bg-pink-50 dark:bg-pink-500/20 transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-pink-50 dark:bg-pink-500/20 flex items-center justify-center ring-2 ring-primary/30 text-4xl transition-transform duration-500 ease-out group-hover:scale-[1.08]">
                      🌸
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300 ease-in-out group-hover:text-rose-500">
                {friend.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-neutral-600">
                {friend.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
