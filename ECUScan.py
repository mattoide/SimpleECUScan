import obd
import gui
obd.logger.setLevel(obd.logging.DEBUG) # enables all debug information

class ECUScan:
    def __init__(self):
        self.ports = []
        self.connection = []
        self.supported_commands = []
        print(f"######### ECUScan started #########")

    def scan_ports(self):
        self.ports = obd.scan_serial()
        return self.ports
    

    def connect_to_port(self, port):
        self.connection = obd.OBD(port)
        self.supported_commands = self.connection.supported_commands

    def read_pid(self, pid):
        cmd = obd.commands[pid]
        self.response = self.connection.query(cmd)
        return self.response.value



#connection = obd.OBD() # auto-connects to USB or RF port

#cmd = obd.commands.SPEED # select an OBD command (sensor)

#response = connection.query(cmd) # send the command, and parse the response

#print(response.value) # returns unit-bearing values thanks to Pint
#print(response.value.to("mph")) # user-friendly unit conversions



