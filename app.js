const overflowObserver = new ResizeObserver(entries => {
  for (const {target} of entries) {
    const overflow = target.scrollWidth > target.clientWidth + 1 && target.clientWidth > 0;
    target.previousElementSibling.hidden = !overflow;
    target.tabIndex = overflow ? 0 : -1;
  }
});

function addStudyNavigation() {
  const panels = Array.from(app.querySelectorAll(':scope > .panel'));
  if (!panels.length) return;
  const nav = document.createElement('nav');
  nav.className = 'section-nav';
  nav.setAttribute('aria-label', 'ページ内目次');
  const label = document.createElement('label');
  label.textContent = 'ページ内目次';
  const select = document.createElement('select');
  select.add(new Option('セクションを選ぶ', ''));
  panels.forEach((panel, index) => {
    const heading = panel.querySelector('h2');
    if (heading) select.add(new Option(heading.textContent, String(index)));
  });
  select.onchange = () => {
    if (select.value === '') return;
    const heading = panels[Number(select.value)].querySelector('h2');
    heading.tabIndex = -1;
    heading.focus({preventScroll: true});
    heading.scrollIntoView({block: 'start'});
    select.value = '';
  };
  label.append(select);
  nav.append(label);
  panels[0].before(nav);
  app.querySelectorAll('.fiscal-scroll, .jra-scroll').forEach(region => {
    const hint = document.createElement('p');
    hint.className = 'scroll-hint';
    hint.textContent = region.querySelector('svg') ? '横にスクロールして全年度を表示' : '横にスクロールして全列を表示';
    hint.hidden = true;
    region.before(hint);
    region.setAttribute('role','region');
    if (!region.hasAttribute('aria-label')) region.setAttribute('aria-label', region.querySelector('svg') ? '年度別グラフ' : 'データ表');
    overflowObserver.observe(region);
  });
  const back = document.createElement('a');
  back.className = 'back-to-results';
  back.href = '#domains';
  back.textContent = '予測結果一覧に戻る';
  app.append(back);
}

async function navigate() {
  overflowObserver.disconnect();
  const route = location.hash;
  const study = publishedStudies.find(target => target.route === route);
  document.querySelector('body > header').hidden = !study;
  document.body.dataset.view = study ? 'study' : 'home';
  document.title = study ? study.name + 'の年度予測｜日本財政アトラス'
    : '日本財政アトラス';
  if (study) {
    await study.render();
    if (location.hash !== route) return;
    addStudyNavigation();
  } else showHome();
  if (['#annual', '#topics', '#domains'].includes(route)) document.getElementById('domains').scrollIntoView();
  else window.scrollTo(0, 0);
}
window.addEventListener('hashchange', navigate);
navigate();
