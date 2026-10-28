const store = require('../../utils/store');
const fmt = require('../../utils/format');

Page({
  data: {
    ev: null,
    done: 0,
    pct: 0,
    full: false,
    left: 0,
    introArr: [],
    highlights: [],
    agenda: [],
    notes: []
  },
  onLoad(q) {
    this.eventId = q.id;
  },
  onShow() {
    store.refresh();
    const ev = store.getEvent(this.eventId);
    if (!ev) {
      wx.showToast({ title: '活动不存在', icon: 'none' });
      return;
    }
    const done = store.enrolled(ev);
    const left = store.seatsLeft(ev);
    this.setData({
      ev: Object.assign({}, ev, { dateText: fmt.fmtDate(ev.date) }),
      done,
      left,
      full: left === 0,
      pct: Math.min(100, Math.round((done / ev.capacity) * 100)),
      introArr: (ev.intro || '').split('\n').filter(Boolean),
      highlights: ev.highlights || [],
      agenda: ev.agenda || [],
      notes: ev.notes || []
    });
  },
  startSignup() {
    if (this.data.full) {
      wx.showModal({
        title: '名额已满',
        content: '留个电话，有孩子请假我们会第一时间联系你。\n也可直接拨打 188 5844 4116',
        confirmText: '拨打',
        success: (r) => {
          if (r.confirm) wx.makePhoneCall({ phoneNumber: '18858444116' });
        }
      });
      return;
    }
    const ev = store.getEvent(this.eventId);
    store.setDraft({
      eventId: ev.id,
      childName: store.CHILD.name,
      childAge: store.CHILD.age,
      level: ev.level.indexOf('-') > -1 ? ev.level.split('-')[0] : ev.level,
      phone: store.CHILD.phone,
      note: ''
    });
    wx.navigateTo({ url: '/pages/signup/signup?id=' + this.eventId });
  }
});
