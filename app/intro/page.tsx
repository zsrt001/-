import { AppShell, AtlasCard, GoldButton, SealMark } from "@/components/ui";

export default function IntroPage() {
  return (
    <AppShell accent="#c9aa66">
      <div className="intro-page">
        <AtlasCard className="intro-card p-6">
          <div className="intro-mist" aria-hidden="true" />
          <div className="intro-card__header">
            <p className="title-slip">东方意象性格测试</p>
            <SealMark label="图鉴" />
          </div>

          <h1 className="intro-title">山海图已开启</h1>

          <div className="intro-copy">
            <p>
              你将通过12道东方意象故事题，
              <br />
              生成属于你的东方性格原型。
            </p>
            <p>
              玄鸟、潜龙、白泽、青鸾、凤凰、灵狐……
              <br />
              每一种性格，都有自己的来处。
            </p>
          </div>

          <GoldButton href="/quiz">进入图鉴</GoldButton>
        </AtlasCard>
      </div>
    </AppShell>
  );
}
