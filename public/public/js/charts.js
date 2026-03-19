

const Charts = {
  yearHistory(ctx, data){
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [{
          label: 'Doanh thu',
          data,
          fill: true,
          tension: .4,
          borderColor: getCssVar('--accent'),
          backgroundColor: withAlpha(getCssVar('--accent'), .15),
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: baseLineOptions()
    });
  },

  weekActivity(ctx, labels, booked, canceled){
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Đặt chỗ', data: booked, backgroundColor: getCssVar('--teal') },
          { label: 'Huỷ chỗ', data: canceled, backgroundColor: getCssVar('--pink') }
        ]
      },
      options: {
        responsive:true,
        plugins: { legend: { display: false } },
        scales: { y: { grid: { color: '#eee' } }, x: { grid: { display:false } } }
      }
    });
  },

  seatPie(ctx, labels, values){
    const colors = [getCssVar('--gold'), getCssVar('--green'), getCssVar('--pink'), getCssVar('--gray'), getCssVar('--cyan')];
    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    })
  }
};

function getCssVar(name){
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function withAlpha(hexOrRgb, alpha){
  if(/^#/.test(hexOrRgb)){
    const bigint = parseInt(hexOrRgb.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if(/^rgb/.test(hexOrRgb)){
    return hexOrRgb.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }
  return hexOrRgb;
}

function baseLineOptions(){
  return {
    responsive:true,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: '#eee' } },
      x: { grid: { display:false } }
    }
  };
}

window.Charts = Charts;
