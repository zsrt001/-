import { AppShell, AtlasCard, SealMark, SoftDivider } from "@/components/ui";
import { chapters } from "@/data/chapters";
import { RedeemForm } from "@/components/redeem/redeem-form";

const themeMarks = ["星宿", "山海", "云雾", "朱砂"];

export default function HomePage() {
  return (
    <AppShell className="atlas-shell--home" contentClassName="home-page">
      <div className="home-stack">
        <section className="home-hero" aria-label="灵魂图鉴兑换码入口">
          <div className="home-hero__copy">
            <p className="home-hero__eyebrow">山海十二象 · 人格入鉴</p>
            <h1>灵魂图鉴</h1>
            <p>输入兑换码，开启你的东方意象性格测试。</p>
            <div className="home-hero__beasts" aria-hidden="true">
              <span>玄鸟</span>
              <span>潜龙</span>
              <span>白泽</span>
              <span>青鸾</span>
            </div>
            <RedeemForm />
          </div>
        </section>

        <AtlasCard className="p-5">
          <div className="home-manuscript">
            <div className="vertical-title">人格图鉴</div>
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="title-slip">卷首题跋</p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold text-mist-100">
                    山海有象，请静一息
                  </h2>
                </div>
                <SealMark label="图鉴" />
              </div>

              <p className="ancient-copy mt-4">
                通过12道东方意象故事题，生成你的专属人格图鉴结果。
                这份性格测试适合娱乐分享，也适合做一次轻量的自我探索。
              </p>
            </div>
          </div>

          <div className="oracle-strip" aria-hidden="true">
            {themeMarks.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>

          <SoftDivider className="my-5" />

          <div className="chapter-scroll-list">
            {chapters.map((chapter) => (
              <div className="chapter-scroll-row" key={chapter.id}>
                <span
                  aria-hidden="true"
                  className={`chapter-scroll-index chapter-scroll-index--${chapter.id}`}
                />
                <div>
                  <p className="chapter-scroll-name">{chapter.name}</p>
                  <p className="chapter-scroll-omen">{chapter.omen}</p>
                </div>
              </div>
            ))}
          </div>
        </AtlasCard>
      </div>
    </AppShell>
  );
}
