var averages = []
for (let i = 0; i < amounts.length; i++) {
  averages.push(1425);
}

var dailies = []
for (let i = 0; i < amounts.length; i++) {
  dailies.push(204);
}

const labels = goodDates;
const data = {
    labels: labels,
    datasets: [{
        label: 'My Spending',
        backgroundColor: 'rgb(37, 101, 39)',
        borderColor: 'rgb(37, 101, 39)',
        data: amounts,
    }, {
        label: 'Aus Average Weekly Spending',
        backgroundColor: 'rgb(255, 138, 0)',
        borderColor: 'rgb(255, 138, 0)',
        data: averages,
    }, {
        label: 'Aus Average Daily Spending',
        backgroundColor: 'rgb(232, 97, 12)',
        borderColor: 'rgb(232, 97, 12)',
        data: dailies,
    }]
};

const config = {
  type: 'line',
  data,
  options: {
      scales: {
            y: {
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return '$' + value;
                    }
                }
            }
        }
  }
};

var myChart = new Chart(
    document.getElementById('myChart'),
    config
);

