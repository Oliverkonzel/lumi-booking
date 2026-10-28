const store = require('../../utils/store');
const fmt = require('../../utils/format');

Page({
  data: {
    ev: null,
    childName: '',
    childAge: '6 岁',
    level: 'EL1',
    phone: '',
    note: '',
    ages: ['3 岁', '4 岁', '5 岁', '6 岁', '7 岁', '8 岁', '9 岁'],
    levels: ['未测过', 'LL1', 'LL2', 'LL3', 'EL0', 'EL1', 'EL2', 'EL3'],
    ageIndex: 3,
    levelIndex: 5,
    dateText: ''
  },
  onLoad(q) {
    store.refresh();
    const ev = store.getEvent(q.id);
    const draft = store.getDraft() || {};
    const defLevel = ev.level.indexOf('-') > -1 ? ev.level.split('-')[0] : ev.level;
    const level = draft.level || defLevel || store.CHILD.level;
    const age = draft.childAge || store.CHILD.age;
    this.setData({
      ev: Object.assign({}, ev, { dateText: fmt.fmtDate(ev.date) }),
      childName: draft.childName || store.CHILD.name,
      phone: draft.phone || store.CHILD.phone,
      note: draft.note || '',
      ageIndex: Math.max(0, this.data.ages.indexOf(age)),
      levelIndex: Math.max(0, this.data.levels.indexOf(level))
    });
  },
  onName(e) { this.setData({ childName: e.detail.value }); },
  onPhone(e) { this.setData({ phone: e.detail.value }); },
  onNote(e) { this.setData({ note: e.detail.value }); },
  onAge(e) { this.setData({ ageIndex: Number(e.detail.value) }); },
  onLevel(e) { this.setData({ levelIndex: Number(e.detail.value) }); },
  submit() {
    const d = this.data;
    const name = (d.childName || '').trim();
    const phone = (d.phone || '').trim();
    if (!name) { wx.showToast({ title: '请填写孩子姓名', icon: 'none' }); return; }
    if (!/^1\d{10}$/.test(phone)) { wx.showToast({ title: '请填写正确的手机号', icon: 'none' }); return; }
    store.setDraft({
      eventId: d.ev.id,
      childName: name,
      childAge: d.ages[d.ageIndex],
      level: d.levels[d.levelIndex],
      phone,
      note: (d.note || '').trim()
    });
    wx.navigateTo({ url: '/pages/pay/pay?id=' + d.ev.id });
  }
});
