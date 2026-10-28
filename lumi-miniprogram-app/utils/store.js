/* ===================================================================
   数据层：活动 / 订单 / 报名
   当前用本机存储 wx.setStorageSync 模拟后端。
   上线时把本文件的增删改查替换为云开发数据库或自建接口即可，
   页面层不需要改动。
   =================================================================== */
const KEY = 'lumi_store_v1';

const CHILD = { name: '林小满', age: '6 岁', level: 'EL1', parent: '林女士', phone: '18858444116' };

const SEED_EVENTS = [
  {
    id: 'ev101',
    title: '绘本对话式共读 ·「The Very Hungry Caterpillar」',
    cat: '绘本共读', level: 'LL1', age: '3-4 岁',
    date: '2026-11-01', time: '10:00-11:00', dur: '60 分钟',
    place: '探索教室 A',
    price: 128, capacity: 8, baseEnrolled: 4,
    teacher: 'Ms. Emily', teacherDesc: '美籍母语伙伴 · 6 年幼儿英语启蒙经验',
    emoji: '🐛', c1: '#DCEBFC', c2: '#9CC8F0',
    status: 'open',
    intro: '一只很饿的毛毛虫，一周吃掉七种食物。我们不急着教单词，而是先让孩子猜：它明天会吃什么？\n在猜和说的过程中，孩子会自然地说出 Monday、apple、still hungry —— 不是背出来的，是想说。',
    highlights: [
      '用「猜下一页」的方式，让孩子主动开口而不是被点名',
      '一周七天的韵律重复，孩子听两遍就能跟上节奏',
      '每位孩子有 3-4 次单独对话机会，老师只回应不纠正',
      '结束前一起做一只属于自己的毛毛虫，带回家讲给爸妈听'
    ],
    agenda: [
      { t: '10:00', n: '暖场歌谣', d: '用《Hello Song》认识彼此，孩子可以先只挥手不说话' },
      { t: '10:10', n: '绘本共读', d: '对话式提问，一页一个问题，孩子用手指、单词或整句回应都可以' },
      { t: '10:40', n: '手工延伸', d: '做一只会「吃东西」的毛毛虫，边做边重复本周句型' },
      { t: '10:55', n: '家长沟通', d: '老师用 5 分钟反馈每个孩子的开口情况' }
    ],
    notes: ['适合零基础或刚开始接触英文的孩子', '家长可在教室后排旁听', '活动前一天可免费取消并全额退款']
  },
  {
    id: 'ev102',
    title: '韵律歌谣 · 用节奏把嘴巴打开',
    cat: '韵律歌谣', level: 'LL2', age: '4-5 岁',
    date: '2026-11-07', time: '15:00-16:00', dur: '60 分钟',
    place: '探索教室 B',
    price: 128, capacity: 10, baseEnrolled: 6,
    teacher: 'Ms. Grace', teacherDesc: '美籍母语伙伴 · 音乐剧背景',
    emoji: '🎵', c1: '#D6E9FB', c2: '#8FC4EE',
    status: 'open',
    intro: '孩子记不住句子，但一定记得住节奏。\n这一小时我们用拍手、跺脚、绕口令，把句子的重音变成身体的记忆。等孩子发现「说英语」和「唱歌」一样好玩，嘴巴就自己打开了。',
    highlights: [
      '每首歌谣配一套动作，孩子不动嘴也能先动身体',
      '绕口令从 2 个词开始，逐轮加长，难度刚好够得着',
      '双人接龙环节，孩子要和伙伴完成一句对话',
      '全程无考核、无比较，只记录每个孩子今天多说了几个词'
    ],
    agenda: [
      { t: '15:00', n: '节奏热身', d: '拍手接龙，先让身体进入状态' },
      { t: '15:10', n: '歌谣学唱', d: '两首经典 nursery rhyme，配动作逐句拆解' },
      { t: '15:35', n: '绕口令挑战', d: '从易到难三轮，成功一次盖一个章' },
      { t: '15:50', n: '集体表演', d: '一起完整唱一遍，录成小视频发给家长' }
    ],
    notes: ['适合有英文输入但不愿开口的孩子', '穿宽松衣物，需要跑跳', '活动前一天可免费取消并全额退款']
  },
  {
    id: 'ev103',
    title: '亲子英语探索日 · 秋天的颜色',
    cat: '亲子活动', level: 'LL1-EL1', age: '3-7 岁（1 大 1 小）',
    date: '2026-11-08', time: '09:30-11:00', dur: '90 分钟',
    place: '户外草坪 + 绘本角',
    price: 168, capacity: 12, baseEnrolled: 9,
    teacher: 'Ms. Emily & Ms. Grace', teacherDesc: '双师带领 · 家长全程参与',
    emoji: '🍂', c1: '#E7F4D9', c2: '#B9DE8B',
    status: 'open',
    intro: '这一次，家长不是旁观者，而是同桌。\n我们把课堂搬到户外，用落叶、石头、树枝当教具。家长会学到一套「不纠正、只回应」的对话方式 —— 回家以后还能继续用。',
    highlights: [
      '户外寻宝：用英文找到五种颜色的自然物',
      '家长工作坊：如何在孩子说错时不打断、还能接下去',
      '亲子共读一本秋天主题绘本，家长开口示范',
      '带走一份「家庭对话卡」，回家每天 5 分钟'
    ],
    agenda: [
      { t: '09:30', n: '草坪集合', d: '热身游戏 + 发放探索任务卡' },
      { t: '09:45', n: '自然寻宝', d: '亲子组队完成颜色收集任务' },
      { t: '10:20', n: '绘本共读', d: '围坐共读，家长和孩子轮流说一句' },
      { t: '10:50', n: '家长小课堂', d: '老师演示三种回应方式，现场演练' }
    ],
    notes: ['一位家长陪同，建议穿运动鞋', '雨天改至室内，会提前一天通知', '含一份亲子材料包']
  },
  {
    id: 'ev104',
    title: '零基础起步 · EL0 说出第一句完整英语',
    cat: '启蒙起步', level: 'EL0', age: '6-9 岁 零基础',
    date: '2026-11-14', time: '10:00-11:30', dur: '90 分钟',
    place: '探索教室 A',
    price: 158, capacity: 8, baseEnrolled: 2,
    teacher: 'Mr. Daniel', teacherDesc: '美籍母语伙伴 · 小学阶段教学经验',
    emoji: '🌱', c1: '#E3F5EC', c2: '#9FDCC0',
    status: 'open',
    intro: '很多 6 岁以上的孩子不是不会，是「怕说错」。\nEL0 专门为从没系统学过、或者学过但不敢开口的孩子设计。我们不从字母表开始，从「我想说」开始 —— 第一节课结束，每个孩子都能完整说出一句自我介绍。',
    highlights: [
      '不从字母和音标开始，先建立「说英语是安全的」这个感受',
      '用孩子自己的兴趣做素材：恐龙、足球、乐高都可以',
      '每节课只锁定 3 个句型，反复用到不用想就能说',
      '结课给家长一份孩子的「开口记录」'
    ],
    agenda: [
      { t: '10:00', n: '破冰', d: '用图片选兴趣，孩子只需要指，不需要说' },
      { t: '10:15', n: '句型搭建', d: 'I like ___. 从单词填空到完整句子' },
      { t: '10:50', n: '双人对话', d: '两两练习，老师逐组旁听记录' },
      { t: '11:20', n: '展示', d: '每个孩子向全组说一句，全组击掌' }
    ],
    notes: ['适合 6-9 岁零基础或基础薄弱的孩子', '第一节课可先试听，不满意全额退', '不需要提前准备任何材料']
  },
  {
    id: 'ev105',
    title: '绘本对话式共读 ·「We are Going on a Bear Hunt」',
    cat: '绘本共读', level: 'EL1', age: '6-7 岁',
    date: '2026-11-15', time: '14:00-15:30', dur: '90 分钟',
    place: '探索教室 B',
    price: 158, capacity: 10, baseEnrolled: 5,
    teacher: 'Mr. Daniel', teacherDesc: '美籍母语伙伴 · 小学阶段教学经验',
    emoji: '🐻', c1: '#FFE6DC', c2: '#FFB99E',
    status: 'open',
    intro: '我们要去捉熊，我们要捉一只大的。\n长句、重复、拟声词 —— 这本绘本天生适合「一起喊出来」。孩子在集体里喊出声，比单独面对老师容易得多。',
    highlights: [
      '重复句式 + 拟声词，孩子跟两遍就能整段复述',
      '场景表演：草地、河流、泥地、森林，全身参与',
      '引导孩子用 because 说出自己的选择',
      '结尾反转讨论：如果是你，你会继续走吗？'
    ],
    agenda: [
      { t: '14:00', n: '故事导入', d: '看封面猜情节，孩子用中文说也没关系' },
      { t: '14:10', n: '共读 + 动作', d: '每到一个场景就做对应动作和音效' },
      { t: '14:40', n: '分组表演', d: '三人一组演一段，老师只做旁白' },
      { t: '15:10', n: '讨论', d: '用 because 说一个理由，写在便签上' }
    ],
    notes: ['适合已能听懂简单指令的孩子', '活动前一天可免费取消并全额退款']
  },
  {
    id: 'ev106',
    title: '儿童情商工作坊 · 说出我的感受',
    cat: '情商成长', level: 'EL1-EL2', age: '5-7 岁',
    date: '2026-11-22', time: '10:00-11:30', dur: '90 分钟',
    place: '探索教室 A',
    price: 198, capacity: 10, baseEnrolled: 10,
    teacher: 'Ms. Emily', teacherDesc: '心理师咨询背景教研团队设计',
    emoji: '💛', c1: '#FFF2CF', c2: '#FFD98F',
    status: 'open',
    intro: '语言不只是词汇量，还是「我能不能说清楚我现在怎么了」。\n这一场由心理师背景的教研团队设计，用英语做载体，带孩子认识情绪、描述感受、学会求助。',
    highlights: [
      '用颜色和表情卡认识 6 种基础情绪',
      '学会 I feel ___ because ___ 的完整表达',
      '情景演练：被抢玩具时，可以怎么说',
      '教孩子一句「我需要帮忙」，比背 100 个单词更重要'
    ],
    agenda: [
      { t: '10:00', n: '情绪签到', d: '进门选一张今天的心情卡，说一个词' },
      { t: '10:15', n: '情绪认知', d: '六种情绪配表情和动作' },
      { t: '10:45', n: '情景演练', d: '三人一组演冲突场景，练习表达' },
      { t: '11:15', n: '家长反馈', d: '老师给每位家长一句观察记录' }
    ],
    notes: ['本场已满，可加入候补名单', '适合 5-7 岁，无需英文基础']
  }
];

const SEED_ORDERS = [
  { id: 'LM202610180001', eventId: 'ev105', childName: '林小满', childAge: '6 岁', level: 'EL1', phone: '18858444116', note: '', amount: 158, status: 'paid', createdAt: '2026-10-18 20:14', code: 'A7K2Q9' },
  { id: 'LM202610200002', eventId: 'ev103', childName: '林小满', childAge: '6 岁', level: 'EL1', phone: '18858444116', note: '希望和同班的小伙伴分在一组', amount: 168, status: 'paid', createdAt: '2026-10-20 09:32', code: 'M3D8F1' },
  { id: 'LM202610250003', eventId: 'ev104', childName: '林小满', childAge: '6 岁', level: 'EL0', phone: '18858444116', note: '', amount: 158, status: 'pending', createdAt: '2026-10-25 18:05', code: '' }
];

const LEVELS = [
  { group: '启蒙阶段 · Little Learners（3-5 岁）', lv: 'LL1', age: '3-4 岁' },
  { group: '', lv: 'LL2', age: '4-5 岁' },
  { group: '', lv: 'LL3', age: '5 岁' },
  { group: '提升阶段 · English Learners（6-9 岁）', lv: 'EL0', age: '6-9 岁 零基础' },
  { group: '', lv: 'EL1', age: '6-7 岁' },
  { group: '', lv: 'EL2', age: '7-8 岁' },
  { group: '', lv: 'EL3', age: '8-9 岁' }
];

const EMOJIS = ['🐛', '🎵', '🍂', '🌱', '🐻', '💛', '🎨', '📚', '🌻', '🚀', '🐣', '🎭'];
const PALETTES = [
  ['#DCEBFC', '#9CC8F0'], ['#D6E9FB', '#8FC4EE'], ['#E3F5EC', '#9FDCC0'],
  ['#E7F4D9', '#B9DE8B'], ['#FFE6DC', '#FFB99E'], ['#FFF2CF', '#FFD98F'],
  ['#EFE7FA', '#C7B0EA'], ['#FFE3EC', '#FFAFC7']
];

let db = null;

function load() {
  if (db) return db;
  try {
    const raw = wx.getStorageSync(KEY);
    if (raw && raw.events && raw.events.length) {
      db = raw;
      return db;
    }
  } catch (e) { /* ignore */ }
  db = {
    events: JSON.parse(JSON.stringify(SEED_EVENTS)),
    orders: JSON.parse(JSON.stringify(SEED_ORDERS))
  };
  save();
  return db;
}
function save() {
  try { wx.setStorageSync(KEY, db); } catch (e) { /* ignore */ }
}
function refresh() { db = null; load(); }

/* ---------- 查询 ---------- */
function getEvent(id) { return load().events.find((e) => e.id === id); }
function openEvents() { return load().events.filter((e) => e.status === 'open'); }
function allEvents() { return load().events; }
function getOrders() { return load().orders.slice(); }
function getOrder(id) { return load().orders.find((o) => o.id === id); }
function eventOrders(evId) { return load().orders.filter((o) => o.eventId === evId); }
function paidCount(evId) {
  return load().orders.filter((o) => o.eventId === evId && o.status === 'paid').length;
}
function enrolled(ev) { return (ev.baseEnrolled || 0) + paidCount(ev.id); }
function seatsLeft(ev) { return Math.max(0, ev.capacity - enrolled(ev)); }
function isFull(ev) { return seatsLeft(ev) <= 0; }
function revenue() {
  return load().orders.filter((o) => o.status === 'paid')
    .reduce((s, o) => s + Number(o.amount || 0), 0);
}

/* ---------- 写入 ---------- */
function upsertEvent(data) {
  const d = load();
  if (data.id && d.events.find((e) => e.id === data.id)) {
    d.events = d.events.map((e) => (e.id === data.id ? Object.assign({}, e, data) : e));
  } else {
    data.id = data.id || 'ev' + Date.now();
    data.baseEnrolled = data.baseEnrolled || 0;
    d.events.unshift(data);
  }
  save();
  return data;
}
function toggleEvent(id) {
  const d = load();
  const ev = d.events.find((e) => e.id === id);
  if (ev) {
    ev.status = ev.status === 'open' ? 'closed' : 'open';
    save();
  }
  return ev;
}
function addOrder(order) {
  const d = load();
  d.orders.unshift(order);
  save();
  return order;
}
function markPaid(orderId) {
  const o = getOrder(orderId);
  if (o && o.status === 'pending') {
    o.status = 'paid';
    o.code = Math.random().toString(36).slice(2, 8).toUpperCase();
    save();
  }
  return o;
}
function payOrder(orderId) {
  const o = getOrder(orderId);
  if (o) {
    o.status = 'paid';
    o.code = o.code || Math.random().toString(36).slice(2, 8).toUpperCase();
    save();
  }
  return o;
}
function resetAll() {
  try { wx.removeStorageSync(KEY); } catch (e) { /* ignore */ }
  db = null;
  load();
}

/* ---------- 报名草稿（signup → pay 传递） ---------- */
let draft = null;
function setDraft(d) { draft = d; }
function getDraft() { return draft; }
function clearDraft() { draft = null; }

module.exports = {
  CHILD, LEVELS, EMOJIS, PALETTES,
  refresh, save, resetAll,
  getEvent, openEvents, allEvents,
  getOrders, getOrder, eventOrders,
  paidCount, enrolled, seatsLeft, isFull, revenue,
  upsertEvent, toggleEvent, addOrder, markPaid, payOrder,
  setDraft, getDraft, clearDraft
};
