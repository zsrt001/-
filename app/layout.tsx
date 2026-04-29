import type { Metadata, Viewport } from "next";
import "@fontsource/noto-serif-sc/chinese-simplified-400.css";
import "@fontsource/noto-serif-sc/chinese-simplified-600.css";
import "@fontsource/zcool-xiaowei/chinese-simplified-400.css";
import "@fontsource/ma-shan-zheng/chinese-simplified-400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "灵魂图鉴｜东方意象性格测试",
  description:
    "通过12道东方意象故事题，生成你的专属人格图鉴结果。测试结果仅供娱乐、自我探索与社交分享参考。"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060504"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
