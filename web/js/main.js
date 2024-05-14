
let intervalId;
let intervalIdDebugMessages;

let last_debug_message = '';

const connect_button = document.getElementById('connect');
const disconnect_button = document.getElementById('disconnect');
unwatch_all_button = document.getElementById('unwatch_all');

const dtcsList = document.getElementById('dtcsList');
const sensorsList = document.getElementById('sensorsList');
const pidsList = document.getElementById('pidsList');
const watchList = document.getElementById('watchValues');
const dot = document.getElementById('dot');
const terminalOutput = document.getElementById('terminal-output');
const terminal = document.getElementById('terminal');


async function updateValues() {

    clearInterval(intervalId);

    intervalId = setInterval(() => {
        eel.get_watch_values()(updateWatchValues)
    }, 100);

}

function updateWatchValues(values) {

    watchList.innerHTML = '';

    for (const [key, value] of Object.entries(values)) {
        const listItem = document.createElement('li');
        listItem.classList.add('lista-chiave-valore');
    
        const row = document.createElement('div');
        row.classList.add('row');
    
        const colKey = document.createElement('div');
        colKey.classList.add('col', 'key-col');
        colKey.textContent = key + ':';
    
        const colVal = document.createElement('div');
        colVal.classList.add('col', 'val-col');
        colVal.textContent = value.split(' ')[0];

        
        const colUnit = document.createElement('div');
        colUnit.classList.add('col');

        if(value.split(' ')[1] != null){
            colUnit.classList.add( 'unit-col');
            colUnit.textContent = value.split(' ')[1];
        }
        
    
        row.appendChild(colKey);
        row.appendChild(colVal);
        row.appendChild(colUnit);
        listItem.appendChild(row);
    
        watchList.appendChild(listItem);
    
        updateChart(key, value.split(" ")[0]);
    }
}


function startLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function stopLoader() {
    document.getElementById('loader').style.display = 'none';
}

function setUiIfDisconnected() {
    document.getElementById("connected").textContent = 'Not connected';
    dot.classList.toggle('green');

    disconnect_button.disabled = true
    unwatch_all_button.disabled = true
    connect_button.disabled = false

    sensorsList.innerHTML = ''
    dtcsList.innerHTML = ''
    pidsList.innerHTML = ''
    watchList.innerHTML = ''

    resetChart();
}

async function setUiIfConnected() {

    document.getElementById("connected").textContent = 'Connected';
    dot.classList.toggle('green');

    disconnect_button.disabled = false
    unwatch_all_button.disabled = false
    connect_button.disabled = true

    await getAvailableCommands()
    await createSensorsList()
    await createDTCsList()
    await createPidsList()
}

async function isObdCOnnected() {
    if (await eel.is_connected()() == true) {
        setUiIfConnected()
    } else {
        setUiIfDisconnected()
    }
}


function log_odb_debug_to_console(messaggio) {
    if (messaggio != last_debug_message) {
        terminalOutput.innerHTML += messaggio + '\n';
        terminal.scrollTop = terminalOutput.scrollHeight;
        last_debug_message = messaggio
    }
}

eel.expose(log_odb_debug_to_console);

