const maxDataPoints = 50;

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
                    beginAtZero: false,
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


function updateChart(label, value, unit) {

    if (value != 'None' && value != '') {
        color = getRandomRGBA();
        // lineChart.data.labels.push(label)
        if(lineChart.data.labels.length < maxDataPoints)
            lineChart.data.labels.push(getFormattedTimestamp())
        // Aggiungi un nuovo dataset se non ne esiste già uno con lo stesso nome
        var datasetIndex = lineChart.data.datasets.findIndex(dataset => dataset.label === label + `(${unit})`);
        if (datasetIndex === -1) {
            var newDataset = {
                label: label + `(${unit})`,
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
    }



    // for (let i = 0; i < lineChart.data.labels.length; i++) {

    //     let occ = lineChart.data.labels.filter(item => item === lineChart.data.labels[i]).length;

    //     if (occ > maxDataPoints) {
    //         lineChart.data.labels.shift();
    //         lineChart.data.datasets.forEach(dataset => {
    //             if (dataset.label == lineChart.data.labels[i]) {
    //                 dataset.data.shift();
    //             }
    //         });

    //         lineChart.update();
    //     }
    // }



            // 
            lineChart.data.datasets.forEach(dataset => {
                if (dataset.data.length > maxDataPoints) {
                    dataset.data.shift();
                    lineChart.data.labels.shift();
                    lineChart.update();
                }
            });

            lineChart.update();
        

}


function getRandomRGBA() {
    var r, g, b, a;

    do {
        r = Math.floor(Math.random() * 201); 
        g = Math.floor(Math.random() * 201); 
        b = Math.floor(Math.random() * 201); 
    } while (r > 200 && g > 200 && b > 200);

    // Assicuriamoci che il valore alpha non sia 0
    do {
        a = Math.random();
    } while (a === 0);

    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function getFormattedTimestamp() {
    // Ottieni la data e l'ora corrente
    const now = new Date();

    // Estrai ore, minuti, secondi e millisecondi
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(now.getMilliseconds() / 100); // Ottieni i decimi di secondo

    // Formatta il timestamp
    const timestamp = `H:${hours} - Min:${minutes} - Sec:${seconds} - Millis:${milliseconds}`;

    return timestamp;
}