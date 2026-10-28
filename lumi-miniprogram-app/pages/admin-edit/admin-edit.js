const store = require('../../utils/store');

Page({
  data: {
    isEdit: false,
    cats: ['绘本共读', '韵律歌谣', '亲子活动', '启蒙起步', '情商成长', '主题活动'],
    levels: ['LL1', 'LL2', 'LL3', 'EL0', 'EL1', 'EL2', 'EL3', 'LL1-EL1'],
    places: ['探索教室 A', '探索教室 B', '绘本角', '户外草坪 + 绘本角'],
    emojis: store.EMOJIS,
    palettes: store.PALETTES,
    catIndex: 0,
    levelIndex: 0,
    placeIndex: 0,
    emojiIndex: 6,
    palIndex: 0,
    form: {
      title: '', age: '3-4 岁', dur: '60 分钟',
      date: '', time: '10:00-11:00',
      price: '128', capacity: '8',
      teacher: 'Ms. Emily', intro: '', highlights: ''
    }
  },
  onLoad(q) {
    this.editId = q.id || '';
    const defaults = {
      date: this.defaultDate()
    };
    if (this.editId) {
      const ev = store.getEvent(this.editId);
      if (ev) {
        this.setData({
          isEdit: true,
          catIndex: Math.max(0, this.data.cats.indexOf(ev.cat)),
          levelIndex: Math.max(0, this.data.levels.indexOf(ev.level)),
          placeIndex: Math.max(0, this.data.places.indexOf(ev.place)),
          emojiIndex: Math.max(0, this.data.emojis.indexOf(ev.emoji)),
          palIndex: Math.max(0, this.data.palettes.findIndex((p) => p[0] === ev.c1)),
          form: {
            title: ev.title, age: ev.age, dur: ev.dur,
            date: ev.date, time: ev.time,
            price: String(ev.price), capacity: String(ev.capacity),
            teacher: ev.teacher,
            intro: ev.intro || '',
            highlights: (ev.highlights || []).join('\n')
          }
        });
        return;
      }
    }
    this.setData({ 'form.date': defaults.date });
  },
  defaultDate() {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    const p = (n) => (n < 10 ? '0' + n : '' + n);
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  },
  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ ['form.' + key]: e.detail.value });
  },
  onCat(e) { this.setData({ catIndex: Number(e.detail.value) }); },
  onLevel(e) { this.setData({ levelIndex: Number(e.detail.value) }); },
  onPlace(e) { this.setData({ placeIndex: Number(e.detail.value) }); },
  onDate(e) { this.setData({ 'form.date': e.detail.value }); },
  onTime(e) { this.setData({ 'form.time': e.detail.value }); },
  pickEmoji(e) { this.setData({ emojiIndex: Number(e.currentTarget.dataset.i) }); },
  pickPal(e) { this.setData({ palIndex: Number(e.currentTarget.dataset.i) }); },
  save(e) {
    const mode = e.currentTarget.dataset.mode; // open | draft
    const f = this.data.form;
    if (!(f.title || '').trim()) { wx.showToast({ title: '请填写活动名称', icon: 'none' }); return; }
    if (mode === 'open') {
      if (!f.date) { wx.showToast({ title: '请选择活动日期', icon: 'none' }); return; }
      if (!(Number(f.price) >= 0)) { wx.showToast({ title: '请填写正确的价格', icon: 'none' }); return; }
      if (!(Number(f.capacity) > 0)) { wx.showToast({ title: '名额至少 1 人', icon: 'none' }); return; }
    }
    const old = this.editId ? store.getEvent(this.editId) : null;
    const pal = this.data.palettes[this.data.palIndex];
    store.upsertEvent({
      id: this.editId || '',
      title: f.title.trim(),
      cat: this.data.cats[this.data.catIndex],
      level: this.data.levels[this.data.levelIndex],
      age: f.age || '3-9 岁',
      date: f.date,
      time: f.time || '10:00-11:00',
      dur: f.dur || '60 分钟',
      place: this.data.places[this.data.placeIndex],
      price: Number(f.price) || 0,
      capacity: Number(f.capacity) || 8,
      teacher: f.teacher || 'Ms. Emily',
      teacherDesc: old ? old.teacherDesc : '美籍母语伙伴带领',
      emoji: this.data.emojis[this.data.emojiIndex],
      c1: pal[0], c2: pal[1],
      status: mode,
      intro: f.intro || '活动介绍待补充。',
      highlights: (f.highlights || '').split('\n').map((s) => s.trim()).filter(Boolean),
      agenda: old ? (old.agenda || []) : [],
      notes: old ? (old.notes || []) : ['活动前一天可免费取消并全额退款']
    });
    wx.showToast({
      title: mode === 'open' ? '已发布，家长端可见' : '已存为草稿',
      icon: 'none'
    });
    setTimeout(() => {
      wx.redirectTo({ url: '/pages/admin-events/admin-events' });
    }, 900);
  }
});
