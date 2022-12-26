const { data } = require('autoprefixer');

const bar = document.getElementById('myBar').getContext('2d');
const pie = document.getElementById('myPie').getContext('2d');
const doughnut = document.getElementById('myDoughnut').getContext('2d');

const arr = [];
// fetch data from api and return promise
const getChartData = fetch(`${process.env.BASE_URL}/dashboard/admin-chart`)
  .then((res) => res.json())
  .then((getData) => {
    arr.push(getData);
  })

const myChart = new Chart(bar, {
  type: 'bar',
  data: {
    labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    datasets: [
      {
        label: 'This week worked employee',
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
    labels: ['Total Hr', 'Running Hr', 'Need Hr'],
    datasets: [
      {
        label: '# of Votes',
        data: [],

        backgroundColor: [
          'rgba(16, 48, 71, 1)',
          'rgba(123, 129, 161, 1)',
          'rgba(255,114,114)',
        ],
      },
    ],
  },
  options: {
    responsive: true,
    type: 'time',
    time: {
      unit: 'hour',
    },
  },

};
setTimeout(() => {
  pieConfig.data.datasets[0].data = [arr[0][0], arr[0][1], arr[0][2]]
}, 500)

setTimeout(() => {
  const pieChart = new Chart(pie, pieConfig)
}, 1000)

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
