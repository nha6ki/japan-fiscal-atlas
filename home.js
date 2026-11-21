const forecastDomains = [
  {
    number: 1, name: "税収と還付",
    planned: [
      "租税の受入額（対民収支）",
      "租税の還付等支払額（対民収支）",
      "源泉所得税収",
      "申告所得税収",
      "消費税収",
      "相続税収",
      "関税収入",
      "その他の税と印紙の収入"
    ],
    studies: [
      { route: "#corporate", name: "法人税収", render: showCorporate, period: "2014〜2025", baseline: "当初予算",
        meanWins: 7, feature: "経常利益の前年同期比", regressionWins: 8, total: 12 }
    ]
  },
  {
    number: 2, name: "税外収入",
    planned: [
      "税外収入の受入額（対民収支）"
    ],
    studies: [
      { route: "#jra", name: "JRA納付金", render: showJra, period: "2013〜2024", baseline: "当初予算",
        meanWins: 7, feature: "前年の売得金の伸び率", regressionWins: 7, total: 12 }
    ]
  },
  {
    number: 3, name: "年金と保険と子育て",
    planned: [
      "年金の受入額と支払額",
      "労働保険の受入額と支払額",
      "子ども・子育て支援の受入額と支払額",
      "地震再保険の受入額と支払額"
    ],
    studies: [
      { route: "#pension", name: "厚生年金保険料収入", render: showPension, period: "2013〜2025", baseline: "当初予算",
        meanWins: 9, feature: "予算額の前年比", regressionWins: 9, total: 13 }
    ]
  },
  {
    number: 4, name: "政策支出と地方への移転",
    planned: [
      "地方交付税交付金の受入額と支払額（対民収支）",
      "社会保障費の支払額（対民収支）",
      "社会保障費の歳出額（予算会計）",
      "公共事業費",
      "防衛関係費",
      "義務教育費"
    ],
    studies: [
      { route: "#allocation", name: "地方交付税", render: showAllocation, period: "2013〜2025", baseline: "当初計画",
        meanWins: 7, feature: "計画額の前年比", regressionWins: 7, total: 13 }
    ]
  },
  {
    number: 5, name: "財政投融資",
    planned: [
      "財政投融資の受入額と支払額（対民収支）"
    ],
    studies: [
      { route: "#filp", name: "財政融資額", render: showFilp, period: "2013〜2025", baseline: "当初計画",
        meanWins: 8, feature: "計画額の前年比", regressionWins: 6, total: 13 }
    ]
  },
  {
    number: 6, name: "国債と借入と利払い",
    planned: [
      "国債の発行額と償還額",
      "国庫短期証券の発行額と償還額",
      "借入金の借入額と返済額",
      "国債の利払費"
    ],
    studies: [
      { route: "#debt", name: "公債利子等支払", render: showDebt, period: "2014〜2025", baseline: "当初予算",
        meanWins: 12, feature: "10年国債の金利差", regressionWins: 12, total: 12 }
    ]
  },
  {
    number: 7, name: "外国為替資金",
    planned: [
      "外国為替資金の円貨受入額と支払額"
    ],
    studies: [
      { route: "#fx", name: "外為特会の運用収入", render: showFx, period: "2013〜2025", baseline: "当初予算",
        meanWins: 2, feature: "米国10年国債の利回り", regressionWins: 2, total: 13 }
    ]
  },
  {
    number: 8, name: "その他の資金と調整",
    planned: [
      "その他の特別会計の受入額と支払額",
      "預託金や保管金などの受入額と支払額"
    ],
    studies: [
      { route: "#patent", name: "特許料等収入", render: showPatent, period: "2013〜2025", baseline: "当初予算",
        meanWins: 2, feature: "特許出願件数", regressionWins: 6, total: 13 }
    ]
  },
];

const publishedStudies = forecastDomains.flatMap(domain => domain.studies);
function showHome() {
  const score = (wins, total, method) => `<span class="score-line ${method}"><span class="score-track" aria-hidden="true"><i style="width:${100 * wins / total}%"></i></span><b>${wins}／${total}</b></span>`;
  const groups = forecastDomains.map(domain => {
    const rows = domain.studies.map(study => `
      <tr><th scope="row"><a href="${study.route}">${study.name}</a></th>
        <td data-label="検証期間">${study.period}年度<small>${study.baseline}</small></td>
        <td data-label="平均ずれ率補正">${score(study.meanWins, study.total, 'mean')}</td>
        <td data-label="回帰">${score(study.regressionWins, study.total, 'regression')}<small>${study.feature}</small></td></tr>`).join('');
    return `<tbody><tr class="domain-title"><th scope="rowgroup" colspan="4"><span>分野 ${domain.number}</span>${domain.name}</th></tr>${rows}
      <tr class="domain-plan"><td colspan="4"><div class="plan-content">
        <strong>予定</strong><span>${domain.planned.join("、")}</span>
      </div></td></tr></tbody>`;
  }).join('');
  app.innerHTML = `<section class="home-summary">
    <div class="atlas-opening"><h1>日本財政アトラス</h1>
    <p>予算成立時点の情報で、年度の実績をどこまで見通せるか。国の収入・支出・融資について、過去のずれや経済指標で当初予算・計画を補正した結果を比較します。</p></div>
    <h2 id="domains">分野別の年度予測</h2>
    <table class="home-scores comparison"><caption>国庫の資金の動きをもとに、本サイト独自の8分野に整理しました。公開済みの予測対象を選ぶと、年度別の結果と出典を確認できます。数値は「当初予算・計画より誤差が小さかった年度数／検証年度数」、棒の長さはその割合です。「予定」は今後検討する年度予測の対象です。</caption>
    <thead><tr><th scope="col">分野・予測対象</th><th scope="col">検証期間・比較基準</th><th scope="col">平均ずれ率補正</th><th scope="col">回帰・使用した指標</th></tr></thead>${groups}</table>
    <p class="home-note">法人税収では名目GDP連動も比較し、12年度中6年度で改善しました。財政融資額の実績には、資金年度ベースの決算時点の見込値を用いています。</p>
    </section>`;
}
