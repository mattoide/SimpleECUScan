let  available_sensors

async function getPorts() {
    const options = await eel.scan_ports()();
    const select = document.getElementById('ports');
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
}

async function connect(){

    startLoader()

    const selectedOption = document.getElementById('ports').value;

    await eel.connect(selectedOption)();

    isObdCOnnected()

    stopLoader()
}

async function disconnect(){
    await eel.unwatch_all()();
    await eel.disconnect()();
    available_sensors = []
    clearInterval(intervalId)
    setUiIfDisconnected()
}

async function getAvailableCommands() {
    available_sensors = await eel.get_available_commands()();
    // eel.printami(available_sensors)
    // for(let i = 0; i< available_sensors.length; i++)
        // eel.printami(available_sensors[i].name +' - ' + available_sensors[i].decode+'\n')
    // eel.printami('\n')

}

async function createSensorsList(){
    const sensorsList = document.getElementById('sensorsList');


    //SENSORI SENZA DTC E PID
    sensors = available_sensors.filter(cmd => !cmd.decode.includes('drop') && !cmd.decode.includes('pid') && !cmd.decode.includes('dtc') && !cmd.name.split('_')[0].includes('DTC'));


    let numberOfSensors = sensors.length

    // Crea e aggiungi le checkbox alla lista
    for (let i = 0; i < numberOfSensors; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = sensors[i].name;
        checkbox.value = sensors[i].name;

        const label = document.createElement('label');
        label.htmlFor = sensors[i].name;
        label.textContent = sensors[i].desc;

        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                watch(sensors[i].name)
            } else {
                unwatch(sensors[i].name)
            }
            updateValues()
        })

        sensorsList.appendChild(checkboxItem);
    }
}

async function createDTCsList(){
    const dtcsList = document.getElementById('dtcsList');
    //DTCS
    //todo: check dtcs
    dtcs = available_sensors.filter(cmd => cmd.decode.includes('dtc') || cmd.name.split('_')[0].includes('DTC'));

    let numberOfDtcs = dtcs.length


    for (let i = 0; i < numberOfDtcs; i++) {
        const listItem = document.createElement('li');

        listItem.classList.add('lista-chiave-valore');


        const row = document.createElement('div');
        row.classList.add('row');
    
        const colKey = document.createElement('div');
        colKey.classList.add('col', 'key-col-button');
        const btn = document.createElement('button');
        btn.id = dtcs[i].name;
        btn.value = dtcs[i].name;
        btn.textContent = dtcs[i].desc;


        const colVal = document.createElement('div');
        colVal.classList.add('col', 'val-col-button');

        colVal.id = `value-${dtcs[i].name}`;

        btn.addEventListener('click', function() {

            watchStaticsPids(dtcs[i].name);
                
            });


        colKey.appendChild(btn) 

        row.appendChild(colKey);
        row.appendChild(colVal);




        /*

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = dtcs[i].name;
        checkbox.value = dtcs[i].name;
    
        const label = document.createElement('label');
        label.htmlFor = dtcs[i].name;
        label.textContent = dtcs[i].desc;
    
        const valueDisplay = document.createElement('p');
        valueDisplay.id = `value-${dtcs[i].name}`;

        valueDisplay.textContent = ''; // Inizialmente vuoto
    
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
        checkboxItem.appendChild(valueDisplay);
    
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                readPid(dtcs[i].name);
            } else {
                unwatch(dtcs[i].name);
            }
            // updateValuesFromRead(dtcs[i].name)
        });

        */
    
        dtcsList.appendChild(row);
        // readPid(dtcs[i].name);
        }
}

async function createPidsList(){
    const pidsList = document.getElementById('pidsList');
    //PIDS
    pids = available_sensors.filter(cmd => cmd.decode.includes('pid'));

    let numberOfPids = pids.length


    // Crea e aggiungi le checkbox alla lista
    for (let i = 0; i < numberOfPids; i++) {

        const listItem = document.createElement('li');

        listItem.classList.add('lista-chiave-valore');


        const row = document.createElement('div');
        row.classList.add('row');
    
        const colKey = document.createElement('div');
        colKey.classList.add('col', 'key-col-button');
        const btn = document.createElement('button');
        btn.id = pids[i].name;
        btn.value = pids[i].name;
        btn.textContent = pids[i].desc;


        const colVal = document.createElement('div');
        colVal.classList.add('col', 'val-col-button');

        colVal.id = `value-${pids[i].name}`;

        btn.addEventListener('click', function() {
            watchStaticsPids(pids[i].name);
                    });


        colKey.appendChild(btn) 

        row.appendChild(colKey);
        row.appendChild(colVal);

        

        /*
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = pids[i].name;
        checkbox.value = pids[i].name;

        const label = document.createElement('label');
        label.htmlFor = pids[i].name;
        label.textContent = pids[i].desc;

        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                watch(pids[i].name)
            } else {
                unwatch(pids[i].name)
            }
            updateValues()
        })
*/
        pidsList.appendChild(row);
        // readPid(pids[i].name);

    }
}


async function watch(pid){
    await eel.watch_pid(pid)
}

async function watchStaticsPids(pid){
    await eel.watch_pid(pid)
    await readPid(pid)
    await readPid(pid)
    await unwatch(pid)

}


async function unwatch(pid){
    
    await eel.unwatch_pid(pid)

    for (let i = 0; i < lineChart.data.labels.length; i++) {

        //TODO: perche non leva label??
        eel.printami('label prima')
        eel.printami(lineChart.data.labels)

            lineChart.data.labels = lineChart.data.labels.filter(label => label == pid)

            eel.printami('label dopo')
            eel.printami(lineChart.data.labels)

            
            lineChart.data.datasets.forEach(dataset => {
                if (dataset.label == pid) {
                    dataset.data.shift();
                }
            });

            lineChart.update();
    }

    lineChart.update();
}

async function unwatchAll(){

    await eel.unwatch_all()

    var inputs = document.getElementsByTagName("input");

    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].type == "checkbox") {
            inputs[i].checked = false; 
        }  
    }

}

async function readPid(pid){
    val = await eel.read_pid(pid)()
    updateValuesFromRead(pid, val)
}

function updateValuesFromRead(pid, val){

    const displayElement = document.getElementById(`value-${pid}`);
    if(displayElement)
        displayElement.textContent = val;
    
}