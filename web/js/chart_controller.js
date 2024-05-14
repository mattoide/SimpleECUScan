var ctx = document.getElementById('lineChart').getContext('2d');

var lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        maintainAspectRatio: true, // Imposta su false per evitare il restringimento

        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }],

        },
        animation: {
            duration: 0 // Disabilita l'animazione per evitare sfarfallii
        }
    }
});

function resetChart() {
    lineChart.data.labels = []
    lineChart.data.datasets = []
    lineChart.update();

}


function updateChart(label, value) {


    color = getRandomRGBA();
    lineChart.data.labels.push(label)
    // Aggiungi un nuovo dataset se non ne esiste già uno con lo stesso nome
    var datasetIndex = lineChart.data.datasets.findIndex(dataset => dataset.label === label);
    if (datasetIndex === -1) {
        var newDataset = {
            label: label,
            data: [],
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1
        };
        lineChart.data.datasets.push(newDataset);
        datasetIndex = lineChart.data.datasets.length - 1;
    }

    lineChart.data.datasets[datasetIndex].data.push(value);




    lineChart.update();

    const maxDataPoints = 10;

    for (let i = 0; i < lineChart.data.labels.length; i++) {

        let occ = lineChart.data.labels.filter(item => item === lineChart.data.labels[i]).length;

        if (occ > maxDataPoints) {
            lineChart.data.labels.shift();
            lineChart.data.datasets.forEach(dataset => {
                if (dataset.label == lineChart.data.labels[i]) {
                    dataset.data.shift();
                }
            });

            lineChart.update();
        }
    }

}


function getRandomRGBA() {
    var r = Math.floor(Math.random() * 256); // Red
    var g = Math.floor(Math.random() * 256); // Green
    var b = Math.floor(Math.random() * 256); // Blue
    var a = Math.random(); // Alpha (trasparenza)
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}


