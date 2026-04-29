import { questions, type QuestionOptionId } from "@/data/questions";

export type SoulArchetype =
  | "白泽型人格"
  | "玄鸟型人格"
  | "青鸾型人格"
  | "潜龙型人格"
  | "灵狐型人格"
  | "白虎型人格"
  | "凤凰型人格"
  | "玄武型人格"
  | "麒麟型人格"
  | "貔貅型人格"
  | "精卫型人格"
  | "混沌型人格";

export type AnswerMap = Record<number, QuestionOptionId>;

export type ResultPayload = {
  archetype: SoulArchetype;
  subtype: string;
  rarity: string;
  quote: string;
  tags: string[];
  portrait: string;
  blindspot: string;
  relationship: string;
  growthTask: string;
  cardText: string;
  image: string;
};

type ResultProfile = {
  name: SoulArchetype;
  rarity: string;
  traits: string[];
  quote: string;
  portrait: string;
  hiddenTendency: string;
  relationship: string;
  growthTask: string;
};

const archetypeOrder: SoulArchetype[] = [
  "白泽型人格",
  "玄鸟型人格",
  "青鸾型人格",
  "潜龙型人格",
  "灵狐型人格",
  "白虎型人格",
  "凤凰型人格",
  "玄武型人格",
  "麒麟型人格",
  "貔貅型人格",
  "精卫型人格",
  "混沌型人格"
];

const tieBreakerQuestionIds = [1, 3, 11, 12];

const resultProfiles: Record<SoulArchetype, ResultProfile> = {
  白泽型人格: {
    name: "白泽型人格",
    rarity: "★★★★★",
    traits: ["清醒", "敏锐", "内耗"],
    quote: "你懂太多，所以很累。",
    portrait:
      "白泽型人格像夜里的书。你对信息、细节和情绪变化非常敏感，常常能看见事情表面之下的第二层意思。别人一句话、一次停顿、一个眼神，你都可能在心里反复推演。你很适合做分析、内容、研究、咨询、策略类事情，因为你有很强的理解力和洞察力。你的清醒很珍贵，但也容易变成负担。很多时候，你并非脆弱，只是接收的信息太多，心里很难安静下来。",
    hiddenTendency:
      "你最容易困住自己的地方，是想明白一切。你越想找到答案，越容易把自己困在反复复盘里。",
    relationship:
      "你在关系里很敏感，也很容易察觉细微变化。你需要能认真沟通的人，也需要能把你从脑海里拉回生活的人。",
    growthTask:
      "学会允许一些事情暂时没有答案。清醒可以帮助你理解世界，也可以用来安顿自己。"
  },
  玄鸟型人格: {
    name: "玄鸟型人格",
    rarity: "★★★★☆",
    traits: ["洞察", "孤高", "预判"],
    quote: "看透很多事，却很少说出口。",
    portrait:
      "玄鸟型人格像高处的风。你习惯先观察全局，再决定是否靠近。很多事情别人还在情绪里打转，你已经提前感到风向变化。你不喜欢无效社交，也不喜欢解释太多，因为你知道有些话说出口，对方也未必能听懂。你身上有很强的判断力和前瞻感，适合做趋势判断、内容判断、策略规划和需要独立思考的事情。你的冷静给你带来优势，也容易让你显得疏离。",
    hiddenTendency:
      "你容易提前撤离。你怕投入太深之后，发现自己的判断错了。",
    relationship:
      "你需要能听懂你沉默的人。对你来说，真正的亲近来自理解，而非频繁打扰。",
    growthTask:
      "把你看见的东西说出来。你的力量既在预判，也在表达。"
  },
  青鸾型人格: {
    name: "青鸾型人格",
    rarity: "★★★★☆",
    traits: ["深情", "忠诚", "理想爱"],
    quote: "深情是天赋，边界是修行。",
    portrait:
      "青鸾型人格很重视关系里的真诚、回应和精神连接。你愿意认真对待一个人，也很难轻易放下一段已经投入过的关系。你对情感有很高的理想感，期待一场双向奔赴，也愿意为在意的人付出很多。你的珍贵在于深情，你的辛苦也常常来自深情。",
    hiddenTendency:
      "你容易把执着误以为值得，把等待误以为深情。",
    relationship:
      "你需要被认真回应，而非独自维持一段关系的体面。",
    growthTask: "把深情交给值得的人。爱可以很深，也可以有边界。"
  },
  潜龙型人格: {
    name: "潜龙型人格",
    rarity: "★★★★☆",
    traits: ["蛰伏", "积累", "后发"],
    quote: "他不争，但他都记得。",
    portrait:
      "潜龙型人格外表安静，内里一直在积蓄力量。你不喜欢把计划挂在嘴边，也很少急着证明自己。你相信真正重要的事情，需要时间托底，需要实力支撑。别人看你慢，你心里很清楚自己在等什么。你的优势是沉稳，你的风险也在沉稳。",
    hiddenTendency:
      "你容易把谨慎和害怕混在一起。你想等到万无一失，可生活很少给人完全确定的时机。",
    relationship:
      "你喜欢可靠、稳定、能陪你熬过低谷的人。你不轻易打开自己，一旦信任，就会放得很深。",
    growthTask:
      "判断时机，也要敢于行动。真正的积累，最终要走向出手。"
  },
  灵狐型人格: {
    name: "灵狐型人格",
    rarity: "★★★☆☆",
    traits: ["共情", "机敏", "敏感"],
    quote: "太懂别人，所以常常忘了自己。",
    portrait:
      "灵狐型人格很会感知气氛，也很容易读懂别人的情绪。你能很快捕捉到别人没说出口的意思，也擅长用柔和的方式化解尴尬。你有灵活的一面，懂得转圜，也懂得照顾场面。可你也容易因为太懂别人，把自己放到最后。",
    hiddenTendency: "你容易把别人的情绪当成自己的责任。",
    relationship:
      "你容易被需要你的人吸引，也容易在关系里承担太多。你需要学会分清共情和自我消耗。",
    growthTask:
      "理解别人之前，先确认自己的感受。温柔可以给出去，也要留一部分给自己。"
  },
  白虎型人格: {
    name: "白虎型人格",
    rarity: "★★★☆☆",
    traits: ["边界", "力量", "独立"],
    quote: "边界清楚的人，很难被拿捏。",
    portrait:
      "白虎型人格有清晰的边界感。你不喜欢拖泥带水，也不喜欢被人试探底线。你遇到问题时更倾向于直接面对，判断快，执行强。你身上有一种干净利落的力量，容易让人尊重，也容易让人误会你很难靠近。",
    hiddenTendency:
      "你习惯用强势保护脆弱，久了会连自己也不太习惯表达柔软。",
    relationship:
      "你需要尊重边界的人，也需要能看见你柔软一面的人。",
    growthTask:
      "力量可以用来保护自己，也可以用来建立更稳定的连接。"
  },
  凤凰型人格: {
    name: "凤凰型人格",
    rarity: "★★★★☆",
    traits: ["重生", "高标准", "强韧"],
    quote: "每次崩溃，都是下一次重生。",
    portrait:
      "凤凰型人格有很强的自我更新能力。你对自己要求高，也很难接受敷衍和停滞。你的人生里可能经历过明显低谷，但很多痛苦都会被你转化成新的力量。你会跌落，也会一次次把自己点亮。",
    hiddenTendency: "你害怕自己普通，所以常常把自己逼得太紧。",
    relationship:
      "你需要欣赏你光芒的人，也需要能陪你穿过低谷的人。只看见你强大的人，很难真正靠近你。",
    growthTask: "变强可以温和发生。你可以进步，也可以休息。"
  },
  玄武型人格: {
    name: "玄武型人格",
    rarity: "★★★☆☆",
    traits: ["稳定", "耐压", "守护"],
    quote: "表面慢热，其实最能扛事。",
    portrait:
      "玄武型人格外表慢热，内在坚固。你不轻易表达情绪，也不轻易被环境击倒。你擅长承压、复盘、守住底线，很适合需要长期坚持、稳定输出和可靠执行的事情。别人可能觉得你反应慢，其实你是在确认安全感和长期价值。",
    hiddenTendency: "你太能忍，常常错过表达真实需求的时机。",
    relationship:
      "你适合细水长流的关系，需要稳定、踏实、少消耗的人。你对安全感的要求很高，只是很少直接说出来。",
    growthTask:
      "承受力很珍贵，表达需求同样珍贵。你可以稳，也可以被照顾。"
  },
  麒麟型人格: {
    name: "麒麟型人格",
    rarity: "★★★☆☆",
    traits: ["温厚", "守护", "长期主义"],
    quote: "慢慢成事的人，自有安定感。",
    portrait:
      "麒麟型人格温厚、稳重、可靠。你常常给人一种“有你在就安心”的感觉。你不急着抢风头，更看重长期关系、真实积累和稳定价值。你做事不浮，待人不薄，能把很多散乱的人和事慢慢安顿下来。",
    hiddenTendency:
      "你太习惯扛事，容易把别人的依赖变成自己的义务。",
    relationship:
      "你适合和懂得回应、愿意共同承担的人在一起。你需要被珍惜，而非被默认。",
    growthTask: "守护别人之前，也要让自己被好好守护。"
  },
  貔貅型人格: {
    name: "貔貅型人格",
    rarity: "★★★☆☆",
    traits: ["目标", "专注", "聚势"],
    quote: "认准一件事，就会持续靠近。",
    portrait:
      "貔貅型人格目标感强，知道自己想要什么，也愿意为结果投入时间和精力。你对机会、资源、效率和回报很敏感。你不喜欢把能量浪费在无意义的事情上，一旦确认方向，就会持续吸纳资源，慢慢把局面推向自己想要的位置。",
    hiddenTendency:
      "你害怕停下来，因为一停下来就会怀疑自己是否落后。",
    relationship:
      "你适合和有行动力、目标感、能互相成就的人同行。你很看重共同成长。",
    growthTask: "会聚势，也要会松手。真正的富足，也包括心里的余地。"
  },
  精卫型人格: {
    name: "精卫型人格",
    rarity: "★★★★☆",
    traits: ["执着", "抗争", "不认输"],
    quote: "放不下的人，往往也最有生命力。",
    portrait:
      "精卫型人格心里有一股很强的“不甘”。你可能看起来并不张扬，但只要认定一件事，就会反复靠近，持续投入。你不喜欢轻易认输，也很难随便放下自己认真过的东西。你身上最动人的地方，是即使起点很小，也会认真对待自己的愿望。",
    hiddenTendency:
      "你害怕放下，因为放下像是在否定过去所有努力。",
    relationship:
      "你需要坚定支持，也需要温和提醒。你适合能陪你坚持，也能帮你看清方向的人。",
    growthTask: "执着可以成就你，也需要被方向感照亮。"
  },
  混沌型人格: {
    name: "混沌型人格",
    rarity: "★★★★★",
    traits: ["松弛", "通透", "反常识"],
    quote: "看似随意，其实自有答案。",
    portrait:
      "混沌型人格不太喜欢被定义，也不喜欢被固定规则框住。你看起来随意，内心却有一套自己的秩序。你常常能从别人忽略的角度看问题，也能在混乱里找到轻松的出口。你的优势是通透，盲区是有时太松弛，容易让别人看不见你的认真。",
    hiddenTendency:
      "你害怕被固定，所以有时也会错过沉淀带来的力量。",
    relationship:
      "你适合尊重自由、能一起玩也能一起成长的人。你需要空间，也需要被认真看见。",
    growthTask: "保持松弛，也为真正重要的事建立自己的节奏。"
  }
};

function createEmptyScores() {
  return archetypeOrder.reduce<Record<SoulArchetype, number>>((scores, key) => {
    scores[key] = 0;
    return scores;
  }, {} as Record<SoulArchetype, number>);
}

function isSoulArchetype(value: string): value is SoulArchetype {
  return archetypeOrder.includes(value as SoulArchetype);
}

function getSelectedOption(questionId: number, answers: AnswerMap) {
  const question = questions[questionId - 1];
  const optionId = answers[questionId] ?? "A";

  return question?.options.find((option) => option.id === optionId);
}

function scoreAnswers(answers: AnswerMap) {
  const scores = createEmptyScores();

  questions.forEach((question) => {
    const option = getSelectedOption(question.id, answers);

    option?.scores.forEach((archetype) => {
      if (isSoulArchetype(archetype)) {
        scores[archetype] += 1;
      }
    });
  });

  return scores;
}

function resolveTieByPriority(
  candidates: SoulArchetype[],
  answers: AnswerMap
) {
  for (const questionId of tieBreakerQuestionIds) {
    const option = getSelectedOption(questionId, answers);
    const matched = option?.scores.find(
      (archetype): archetype is SoulArchetype =>
        isSoulArchetype(archetype) && candidates.includes(archetype)
    );

    if (matched) {
      return matched;
    }
  }

  return archetypeOrder.find((archetype) => candidates.includes(archetype))!;
}

function resolveArchetype(answers: AnswerMap) {
  const scores = scoreAnswers(answers);
  const highestScore = Math.max(...Object.values(scores));
  const candidates = archetypeOrder.filter(
    (archetype) => scores[archetype] === highestScore
  );

  return candidates.length === 1
    ? candidates[0]
    : resolveTieByPriority(candidates, answers);
}

export function calculateResult(answers: AnswerMap): ResultPayload {
  const archetype = resolveArchetype(answers);
  const profile = resultProfiles[archetype];
  const cardText = `${profile.name}\n${profile.quote.replace("。", "")}\n${profile.traits.join("｜")}`;

  return {
    archetype: profile.name,
    subtype: "东方性格原型",
    rarity: profile.rarity,
    quote: profile.quote,
    tags: profile.traits,
    portrait: profile.portrait,
    blindspot: profile.hiddenTendency,
    relationship: profile.relationship,
    growthTask: profile.growthTask,
    cardText,
    image: "/images/shanhai-unified-bg-v2.png"
  };
}
