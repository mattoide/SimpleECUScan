import eel
import obd
import tkinter as tk
import logging

obd.logger.setLevel(obd.logging.INFO)
obd.logger.removeHandler(obd.console_handler)

eel.init('web')


obd_port = None
connection = None
supported_commands = None
supported_commands_names = []
response = None
is_connected = None
value = None
watch_values = {}
debug_message = ''


class CustomHandler(logging.Handler):
    def emit(self, record):
        log_entry = self.format(record)
        custom_log(log_entry)

def custom_log(message):
    log_to_console(message)



handler = CustomHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
obd.logger.addHandler(handler)


@eel.expose
def log_to_console(message):
    eel.log_odb_debug_to_console(message)


def update_watch(response):
    global watch_values
    watch_values[response.command.name] = str(response.value)
    eel.updateValues(watch_values)




@eel.expose
def get_watch_values():
    return watch_values



@eel.expose
def get_connection():
    return connection


@eel.expose
def get_available_commands():
    global supported_commands
    global supported_commands_names
    supported_commands_names = []
    supported_commands = list(connection.supported_commands)

    for cmd in supported_commands:
        supported_commands_names.extend([{'name':cmd.name, 'desc':cmd.desc, 'decode':str(cmd.decode).split(' ')[1]}])

    supported_commands_names = sorted(list(supported_commands_names), key=lambda x: x['name'])

    return supported_commands_names


@eel.expose
def connect(port):
    global obd_port
    global connection
    obd_port = port
    # connection = obd.OBD()
    connection = obd.Async(port)


@eel.expose
def connect_auto():
    global connection
    # connection = obd.OBD()
    connection = obd.Async()
   


@eel.expose
def disconnect():
    global connection
    connection = obd.OBD.close(connection)


@eel.expose
def scan_ports():
    return obd.scan_serial()


@eel.expose
def read_pid(pid):
    cmd = obd.commands[pid]
    response = connection.query(cmd)
    if response.is_null():
        return "N/A"
    else:
        return str(response.value)


@eel.expose
def watch_pid(pid):
    with connection.paused() as was_running:
        connection.watch(obd.commands[pid], callback=update_watch) 
        connection.start()


@eel.expose
def unwatch_pid(pid):
    with connection.paused() as was_running:
        connection.unwatch(obd.commands[pid])
        global watch_values
        del watch_values[pid]
        eel.updateValues(watch_values)

 
    if was_running:
        connection.start()


@eel.expose
def unwatch_all():
    with connection.paused() as was_running:
        connection.unwatch_all()
        global watch_values
        watch_values = {}
        eel.updateValues(watch_values)

 
    if was_running:
        connection.start()


@eel.expose
def is_connected():
    global is_connected

    if connection.is_connected():
        is_connected = True
    else:
        is_connected = False
    
    return is_connected


@eel.expose
def printami(t):
    print(t)


root = tk.Tk()
root.withdraw()

screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()

root.destroy()

eel.start('index.html', size=(screen_width, screen_height))
