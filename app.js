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

async function navigate(event) {
  overflowObserver.disconnect();
  const route = location.hash;
  const study = publishedStudies.find(target => target.route === route);
  const page = ['#annual', '#topics', '#domains'].includes(route) ? 'annual'
    : route === '#outlook' ? 'outlook' : 'home';
  document.querySelector('body > header').hidden = !study && page === 'home';
  document.body.dataset.view = study ? 'study' : page;
  if (study) {
    await study.render();
    if (location.hash !== route) return;
    addStudyNavigation();
  } else if (page === 'annual') {
    showAnnual();
  } else if (page === 'outlook') {
    showOutlook();
  } else {
    showHome();
  }
  const heading = app.querySelector('h1');
  document.title = page === 'home' && !study ? '日本財政アトラス'
    : heading.textContent + '｜日本財政アトラス';
  if (event && !study) {
    heading.tabIndex = -1;
    heading.focus({preventScroll: true});
  }
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', navigate);
navigate();
