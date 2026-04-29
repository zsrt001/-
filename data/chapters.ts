export type Chapter = {
  id: string;
  name: string;
  omen: string;
  atmosphere: string;
};

export const chapters: Chapter[] = [
  {
    id: "stars",
    name: "星宿",
    omen: "观星入卷，看见你的选择方式",
    atmosphere: "星线微明，金线如旧卷轻启"
  },
  {
    id: "mist",
    name: "云雾",
    omen: "雾里听心，辨认情绪与关系",
    atmosphere: "雾气稍深，声息如灯烟缓散"
  },
  {
    id: "mountains",
    name: "山海",
    omen: "山海藏形，映出你的性格底色",
    atmosphere: "山纹更沉，海线如古墨洇开"
  },
  {
    id: "seal",
    name: "朱砂",
    omen: "一点成印，生成你的图鉴结果",
    atmosphere: "朱砂微暖，只在暗处轻轻回光"
  }
];
