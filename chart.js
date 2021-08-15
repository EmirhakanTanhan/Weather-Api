let ctx = document.getElementById('weatherChart').getContext('2d');

let weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['22:00', '01:00', '04:00', '07:00', '10:00', '13:00', '16:00', '19:00'],
        datasets: [{
            label: '',
            data: [28, 28, 27, 26, 29, 30, 31, 31],
            borderColor: 'rgba(248,197,0,1)',
            fill: true,
            backgroundColor: 'rgba(248,197,0,0.3)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
        }]
    },
    options: {
        elements: {
          point: {
              hitRadius: 0,
          }
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        scales: {
            y: {
                suggestedMin: 24,
                suggestedMax: 32,
                ticks: {
                    // forces step size to be 50 units
                    stepSize: 3,
                    color: '#B3B3C1',
                    font: {
                        size: 14,
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false,
                },
            },
            x: {
                ticks: {
                    color: '#B3B3C1',
                    font: {
                        size: 14,
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false,
                }
            }
        }
    }
});