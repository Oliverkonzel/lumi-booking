/* 日期与金额格式化 */
function fmtDate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '待定';
  const p = iso.split('-');
  const dt = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  return Number(p[1]) + '月' + Number(p[2]) + '日 周' + '日一二三四五六'[dt.getDay()];
}
function money(n) {
  return '¥' + Number(n || 0).toLocaleString('zh-CN');
}
function nowStr() {
  const d = new Date();
  const p = (n) => (n < 10 ? '0' + n : '' + n);
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
module.exports = { fmtDate, money, nowStr };
