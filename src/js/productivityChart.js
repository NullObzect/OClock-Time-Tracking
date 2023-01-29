const dateArr = [];
const workTimeArr = [];
fetch(`${process.env.BASE_URL}/productivity-chart`)
  .then((res) => res.json())
  .then((data) => {
    // return data;

    for (let i = 0; i < data.length; i += 1) {
      dateArr.push(data[i].date);
      workTimeArr.push(data[i].workTime);
    }
  });

const data = {
  labels: [],
  datasets: [
    {
      label: 'Last 30 Days Productivity Report',
      backgroundColor: '#103047',
      borderColor: '#103047',
      data: [],
    },
  ],
};
const config = {
  type: 'line',
  data,
  options: {
    // ... other options ...
    plugins: {
      tooltip: {
        mode: 'interpolate',
        intersect: false,
      },
      crosshair: {
        line: {
          color: '#F66', // crosshair line color
          width: 1, // crosshair line width
        },
        sync: {
          enabled: true, // enable trace line syncing with other charts
          group: 1, // chart group
          suppressTooltips: false, // suppress tooltips when showing a synced tracer
        },
        zoom: {
          enabled: true, // enable zooming
          zoomboxBackgroundColor: 'rgba(66,133,244,0.2)', // background color of zoom box
          zoomboxBorderColor: '#48F', // border color of zoom box
          zoomButtonText: 'Reset Zoom', // reset zoom button text
          zoomButtonClass: 'reset-zoom', // reset zoom button class
        },
        callbacks: {
          beforeZoom: () => function (start, end) {
            // called before zoom, return false to prevent zoom
            return true;
          },
          afterZoom: () => function (start, end) {
            // called after zoom
          },
        },
      },
    },
  },
};

// for crosshair

setTimeout(() => {
  data.labels = dateArr;
  data.datasets[0].data = workTimeArr;
}, 500);
setTimeout(() => {
  new Chart(document.getElementById('myChart'), config);
}, 1000);
