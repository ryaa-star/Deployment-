import { dealerData, firmSummary, stockInfo } from './data.js';
console.log("loaded", dealerData);
console.log("loaded", firmSummary);
console.log("loaded", stockInfo);


const tbody = document.getElementById('dealerBody');

dealerData.forEach(d => {
  tbody.insertAdjacentHTML("beforeend", `
    <tr>
      <td>${d.dealer}</td>
      <td>${d.exchange}</td>
      <td>${d.opnPL}</td>
      <td>${d.dayPL}</td>
      <td>${d.netPL}</td>
      <td>${d.exposure}</td>
      <td>${d.expMargin}</td>
      <td>${d.spanMargin}</td>
    </tr>
  `);
});

const tfirm = document.getElementById('firmSummary');
tfirm.innerHTML = `
  <h3>Firm Summary</h3>
  <p>Firm P/L: <span class="${firmSummary.firmPL < 0 ? 'negative' : 'positive'}">
    ${firmSummary.firmPL}
  </span></p>
  <p>Exposure: ${firmSummary.firmExp}</p>
`;

const tstock = document.getElementById('stockInfo');

tstock.innerHTML = `
  <h3>Stock Info</h3>
  <p><strong>${stockInfo.name}</strong></p>
  <p>Date: ${stockInfo.date}</p>
  <p>${stockInfo.dividend}</p>
`;

