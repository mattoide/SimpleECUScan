const maxDataPoints = 50;

var ctx = document.getElementById('lineChart').getContext('2d');

var lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,

        animation: {
            duration: 0 // Disabilita l'animazione per evitare sfarfallii
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
    }
});

function resetChart() {
    lineChart.data.labels = []
    lineChart.data.datasets = []
    lineChart.options.scales = {
        y: Object.values({})
    };
    lineChart.update();

}


function updateChart(label, value, unit) {

    if (value != 'None' && value != '') {

        color = getRandomRGBA();
        if (lineChart.data.labels.length < maxDataPoints)
            lineChart.data.labels.push(getFormattedTimestamp())

        // Aggiungi un nuovo dataset se non ne esiste già uno con lo stesso nome
        var datasetIndex = lineChart.data.datasets.findIndex(dataset => dataset.label === label + `(${unit})`);
        if (datasetIndex === -1) {
            var newDataset = {
                label: label + `(${unit})`,
                data: [],
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                yAxisID: label
            };
            lineChart.data.datasets.push(newDataset);
            datasetIndex = lineChart.data.datasets.length - 1;
        }


        // Trova il punto di partenza per il nuovo dataset
        var startingPoint = 0;
        for (var i = 0; i < lineChart.data.datasets.length; i++) {
            if (lineChart.data.datasets[i].data.length > startingPoint) {
                startingPoint = lineChart.data.datasets[i].data.length;
            }
        }

        // Inserisci valori vuoti per i dataset esistenti fino al punto di partenza del nuovo dataset
        for (var i = 0; i < startingPoint; i++) {
            for (var j = 0; j < lineChart.data.datasets.length; j++) {
                if (lineChart.data.datasets[j].data.length <= i) {
                    lineChart.data.datasets[j].data.push(null);
                }
            }
        }


        lineChart.data.datasets[datasetIndex].data.push(value);
        // lineChart.update();
    }


    lineChart.data.datasets.forEach(dataset => {
        if (dataset.data.length > maxDataPoints) {
            dataset.data.shift();
            lineChart.data.labels.shift();
            // lineChart.update();
        }
    });

    var yAxes = {};
    lineChart.data.datasets.forEach(function (dataset) {
        var yAxisID = dataset.yAxisID;
        if (!yAxes[yAxisID]) {
            yAxes[yAxisID] = {
                type: 'linear',
                display: true,
                position: dataset.yAxisPosition || 'left', // Imposta la posizione dell'asse y, se non specificato usa 'left'
                ticks: {
                    beginAtZero: true // Imposta il valore minimo dell'asse y a 0
                },
                scaleLabel: {
                    display: true,
                    labelString: 'dataset.label' // Usa l'etichetta del dataset come label dell'asse y
                }

            };
        }
    });

    // Aggiorna le opzioni del grafico con le scale dinamicamente generate
    lineChart.options.scales = {
        y: Object.values(yAxes)
    };


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

    return `rgb(${r}, ${g}, ${b})`;
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