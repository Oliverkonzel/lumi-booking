const store = require('../../utils/store');
const fmt = require('../../utils/format');

const CATS = ['all', '绘本共读', '韵律歌谣', '亲子活动', '启蒙起步', '情商成长'];

Page({
  data: {
    cats: CATS.map((c) => ({ key: c, label: c === 'all' ? '全部' : c })),
    active: 'all',
    list: [],
    count: 0
  },
  onShow() {
    store.refresh();
    this.applyFilter(this.data.active);
  },
  decorate(ev) {
    const left = store.seatsLeft(ev);
    return Object.assign({}, ev, {
      dateText: fmt.fmtDate(ev.date),
      timeShort: (ev.time || '').split('-')[0],
      left,
      full: left === 0
    });
  },
  onFilter(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ active: key });
    this.applyFilter(key);
  },
  applyFilter(key) {
    let list = store.openEvents().filter((e) => key === 'all' || e.cat === key);
    list = list.sort((a, b) => a.date.localeCompare(b.date)).map(this.decorate);
    this.setData({ list, count: list.length });
  },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  }
});
