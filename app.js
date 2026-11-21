function navigate() {
  if (location.hash === '#corporate') {
    document.title = '法人税収の年度予測｜日本財政アトラス';
    showCorporate();
  } else if (location.hash === '#jra') {
    document.title = 'JRA納付金の年度予測｜日本財政アトラス';
    showJra();
  } else if (location.hash === '#pension') {
    document.title = '厚生年金保険料収入の年度予測｜日本財政アトラス';
    showPension();
  } else if (location.hash === '#allocation') {
    document.title = '地方交付税の年度予測｜日本財政アトラス';
    showAllocation();
  } else if (location.hash === '#filp') {
    document.title = '財政融資額の年度予測｜日本財政アトラス';
    showFilp();
  } else if (location.hash === '#debt') {
    document.title = '公債利子等支払の年度予測｜日本財政アトラス';
    showDebt();
  } else if (location.hash === '#fx') {
    document.title = '外為特会の運用収入の年度予測｜日本財政アトラス';
    showFx();
  } else if (location.hash === '#patent') {
    document.title = '特許料等収入の年度予測｜日本財政アトラス';
    showPatent();
  } else {
    document.title = '日本財政アトラス';
    showHome();
  }
  if (location.hash === '#domains') document.getElementById('domains').scrollIntoView();
  else window.scrollTo(0, 0);
}
window.addEventListener('hashchange', navigate);
navigate();
