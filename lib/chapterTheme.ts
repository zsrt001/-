export type ChapterTheme = {
  chapterName: string;
  chapterSubtitle: string;
  accentColor: string;
  glowColor: string;
  icon: string;
};

export const chapterThemes: ChapterTheme[] = [
  {
    chapterName: "开卷入山",
    chapterSubtitle: "Q1-Q3｜山门半启，观察你面对未知时的选择方式。",
    accentColor: "#c0a05e",
    glowColor: "rgba(192, 160, 94, 0.13)",
    icon: "山"
  },
  {
    chapterName: "人间关系",
    chapterSubtitle: "Q4-Q6｜灯火与人声之间，辨认你的关系习惯。",
    accentColor: "#ba9a5f",
    glowColor: "rgba(186, 154, 95, 0.12)",
    icon: "人"
  },
  {
    chapterName: "选择试炼",
    chapterSubtitle: "Q7-Q9｜雾水与古城之间，看见你的压力应对方式。",
    accentColor: "#b28d59",
    glowColor: "rgba(178, 141, 89, 0.11)",
    icon: "试"
  },
  {
    chapterName: "照心入鉴",
    chapterSubtitle: "Q10-Q12｜铜镜照心，生成你的东方性格原型。",
    accentColor: "#ad8358",
    glowColor: "rgba(173, 131, 88, 0.11)",
    icon: "鉴"
  }
];

export function getChapterTheme(questionIndex: number): ChapterTheme {
  const safeIndex = Number.isFinite(questionIndex)
    ? Math.max(0, Math.min(11, Math.floor(questionIndex)))
    : 0;
  const chapterIndex = Math.floor(safeIndex / 3);

  return chapterThemes[chapterIndex];
}
