const outlookMetrics = [
  {
    name: "税収",
    projections: [[83.7, 83.7, 83.7], [87.8, 92.2, 95.5], [86.3, 89.0, 90.6]],
    errors: [[4.946, 6.73, 9.672], [4.95, 5.285, 6.888], [5.266, 5.331, 7.901]],
  },
  {
    name: "利払費",
    projections: [[13.0, 13.0, 13.0], [15.5, 18.5, 21.6], [15.4, 18.1, 20.7]],
    errors: [[1.343, 1.305, 1.353], [2.193, 3.038, 3.635], [2.143, 2.955, 3.402]],
  },
];
const outlookMethods = ["政府案を据え置き", "財務省の試算1", "財務省の試算2"];

function outlookTable(caption, columns, series) {
  const groups = outlookMetrics.map(({name, [series]: values}) => `<tbody>
    <tr class="outlook-metric"><th scope="rowgroup" colspan="4">${name}</th></tr>
    ${values.map((row, i) => `<tr><th scope="row">${outlookMethods[i]}</th>
      ${row.map(value => `<td>${value.toFixed(series === "errors" ? 3 : 1)}</td>`).join("")}</tr>`).join("")}
  </tbody>`).join("");
  return `<table class="outlook-table"><caption>${caption}</caption>
    <thead><tr><th scope="col">比較方式</th>
      ${columns.map(label => `<th scope="col">${label}</th>`).join("")}</tr></thead>${groups}
  </table>`;
}

function showOutlook() {
  app.innerHTML = `<h1>財政の中期見通し</h1>
    <p>国の一般会計の税収（租税及印紙収入）と利払費を対象に、今後3年度の試算と過去の予測誤差を比べます。</p>
    <section class="panel">
      <h2>2027〜2029年度の試算</h2>
      <p>2026年2月公表の財務省試算です。試算1は名目成長率3.0％、試算2は1.5％を置き、金利の前提も異なります。比較のため、2026年度政府案を据え置いた場合も示します。</p>
      ${outlookTable("各年度の試算額（兆円）", ["2027年度", "2028年度", "2029年度"], "projections")}
      <p><a href="https://www.mof.go.jp/policy/budget/topics/outlook/sy2026a.htm">財務省の後年度影響試算と前提</a></p>
    </section>
    <section class="panel">
      <h2>何年度先まで見通せたか</h2>
      <p>2016・2017・2019〜2022年度を起点とする6回分の試算を、後から公表された決算と照合しました。金額は予測と実績の差の絶対値を平均したものです。</p>
      ${outlookTable("平均絶対誤差（兆円）", ["1年度先", "2年度先", "3年度先"], "errors")}
      <p>税収の1年度先は据え置きと試算1がほぼ同じで、2・3年度先は試算1の誤差が最小でした。利払費は各年数とも据え置きの誤差が最小でした。同じ決算年度を複数の起点が共有するため、安定して見通せる年数はまだ決めていません。</p>
      <p><a href="https://www.mof.go.jp/policy/budget/topics/outlook/sy0201a.htm">2020年度の試算</a> ／
        <a href="https://www.mof.go.jp/jgbs/publication/debt_management_report/2021/saimu2021-3-ho.pdf#page=4">2021年度の試算</a> ／
        <a href="https://www.mof.go.jp/policy/budget/topics/outlook/sy0401a.html">2022年度の試算</a></p>
    </section>
    <section class="panel">
      <h2>税収の1年度先予測に機械学習は役立ったか</h2>
      <p>2014〜2024年度の各政府案を起点に、翌年度の税収を予測し、2015〜2025年度の決算と照合しました。11回全体で決算に最も近かったのは、政府案の税収を名目成長率の仮定（年3％）だけ増やすGDP連動方式でした。</p>
      <table class="outlook-table"><caption>期間別の平均絶対誤差（兆円）</caption><thead><tr><th scope="col">方式</th><th scope="col">2014〜19年度起点</th><th scope="col">2020〜24年度起点</th><th scope="col">全11回</th></tr></thead><tbody><tr><th scope="row">政府案を据え置き</th><td>2.23</td><td>8.92</td><td>5.27</td></tr>
<tr><th scope="row">GDP連動</th><td>2.15</td><td>6.97</td><td>4.34</td></tr>
<tr><th scope="row">GDP連動＋平均ずれ補正</th><td>2.93</td><td>6.98</td><td>4.77</td></tr>
<tr><th scope="row">GDP連動＋リッジ回帰</th><td>4.66</td><td>7.22</td><td>5.82</td></tr></tbody></table>
      <p>平均ずれ補正は、過去の「決算額からGDP連動予測を引いた差」の平均を予測に足します。リッジ回帰は、予測時点で決算が判明していた直近年度の税収の伸び率から補正額を推定します。平均ずれ補正より決算に近づいたのは11回中2回で、今回のリッジ回帰の採用は見送りました。</p>
      <table class="outlook-table"><caption>財務省の試算もそろう起点での平均絶対誤差（兆円）</caption><thead><tr><th scope="col">方式</th><th scope="col">共通8回</th></tr></thead><tbody><tr><th scope="row">政府案を据え置き</th><td>6.27</td></tr>
<tr><th scope="row">GDP連動</th><td>4.98</td></tr>
<tr><th scope="row">GDP連動＋平均ずれ補正</th><td>4.90</td></tr>
<tr><th scope="row">GDP連動＋リッジ回帰</th><td>5.32</td></tr>
<tr><th scope="row">財務省の試算1</th><td>5.19</td></tr>
<tr><th scope="row">財務省の試算2</th><td>5.73</td></tr></tbody></table>
      <p>財務省の両試算もそろうのは2016・2017・2019〜2024年度起点の8回です。この期間では平均ずれ補正とGDP連動の誤差の差は約0.08兆円でした。</p>
      <p>学習用の政府案は2008年度から収録し、各起点の2年度前までに終了した年度の決算を使用しました。決算額は後年の集計表などから再構成しており、各年の公表当時の版との照合が残っています。税制改正の増減収見込額は今回のモデルに含めていません。</p>
      <p><a href="tax-ridge-pilot.csv" download>年度別の予測・決算・政府案の出典（CSV）</a></p>
    </section>`;
}
