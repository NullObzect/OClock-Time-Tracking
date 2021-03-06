const bar = document.getElementById('myBar').getContext('2d');
const pie = document.getElementById('myPie').getContext('2d');
const doughnut = document.getElementById('myDoughnut').getContext('2d');
const myChart = new Chart(bar, {
  type: 'bar',
  data: {
    labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    datasets: [
      {
        label: '# of Votes',
        data: [42, 46, 43, 36, 0, 0],
        backgroundColor: [
          'rgba(16, 48, 71, 1)',
          'rgba(123, 129, 161, 1)',
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
  },
});
const pieConfig = {
  type: 'polarArea',
  data: {
    labels: ['Total', 'Running', 'Need'],
    datasets: [
      {
        label: '# of Votes',
        data: [120, 100, 20],
        backgroundColor: [
          'rgba(16, 48, 71, 1)',
          'rgba(123, 129, 161, 1)',
          'rgba(255,114,114)',
        ],
      },
    ],
  },
  options: {},
};
const pieChart = new Chart(pie, pieConfig)

const doughnutConfig = {
  type: 'doughnut',
  data: {
    labels: ['User', 'Working', 'Leave'],
    datasets: [
      {
        label: '# of Votes',
        data: [40, 30, 10],
        backgroundColor: [
          'rgba(16, 48, 71, 1)',
          'rgba(123, 129, 161, 1)',
          'rgba(255,114,114)',
        ],
      },
    ],
  },
  options: {},
};
const doughnutChart = new Chart(doughnut, doughnutConfig)