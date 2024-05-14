import tkinter as tk
import ECUScan 
from ECUScan import ECUScan 
import time

ecuscan = ECUScan()

        


class GUI:
    def __init__(self):
        self.ports = ['']
        self.supported_commands_names = []
        self.pids_to_read = []

        root = tk.Tk()
        self.root = root
        self.selected_port = tk.StringVar(root)
        self.pid_to_read = tk.StringVar(root)
        self.pid_to_read.set('')

        self.supported_commands_names_booleans  = []


        root.minsize(500, 500)
        root.title("ECU DIAGNOSYS V0.1")


        self.label = tk.Label(root, text="Select port to connect:")
        self.label.grid(row=1, column=1)

        self.selected_port.set("Select serial port") 
        self.option_menu = tk.OptionMenu(root, self.selected_port, *self.ports)
        self.option_menu.grid(row=1, column=2)

        self.refresh_ports_button = tk.Button(root, text="Refresh serial ports", command=self.get_ports)
        self.refresh_ports_button.grid(row=1, column=3)

        self.connect_button = tk.Button(root, text="Connect", command=self.connect)
        self.connect_button.grid(row=1, column=4)


        self.test_button = tk.Button(root, text="TEST", command=self.test)
        self.test_button.grid(row=1, column=5)

        # self.messages = tk.Label(root, text=self.message)
        # self.messages.grid(row=2, column=2)


        # c1 = tk.Checkbutton(root, text='Python',variable=var1, onvalue=1, offvalue=0, command=print_selection)
        
        # c1 = tk.Checkbutton(self.root, text='self.message[i].name', variable=self.test, onvalue='1', offvalue='2', command=self.print_selection)
        # c1.grid(row=3+1, column=2)

        # c2 = tk.Checkbutton(self.root, text='asdasd', variable=self.test, onvalue='1', offvalue='2', command=self.print_selection)
        # c2.grid(row=3+2, column=2)



        self.get_ports()

        # Avvio del loop principale
        root.mainloop()
    
    def test(self):
        for pid_to_read in self.pids_to_read:
            print(ecuscan.read_pid(pid_to_read))
            print('\n\n')
            time.sleep(1)


    def connect(self):
        self.supported_commands_names = []
        self.pids_to_read = []

        ecuscan.connect_to_port(self.selected_port)

        supported_commands = list(ecuscan.supported_commands)

        for cmd in supported_commands:
        # for i in range(0,3):
            # self.supported_commands_names.append(supported_commands[i].name)
            self.supported_commands_names.append(cmd.name)

        self.supported_commands_names.sort()
        
        self.supported_commands_names_booleans = [tk.BooleanVar(self.root) for _ in range(len(self.supported_commands_names))]

        for i, opzione in enumerate(self.supported_commands_names):
            checkbox = tk.Checkbutton(self.root, text=opzione, variable=self.supported_commands_names_booleans[i], command=self.print_selection)
            checkbox.grid(row=3+i, column=1)



    

    def print_selection(self):

        for i in range(0, len(self.supported_commands_names_booleans)):
            opz = self.supported_commands_names_booleans[i].get()
            if(opz == True):
                if(self.supported_commands_names[i] not in  self.pids_to_read):
                    self.pids_to_read.append(self.supported_commands_names[i])
            else:
                if(self.supported_commands_names[i] in  self.pids_to_read):
                    self.pids_to_read.remove(self.supported_commands_names[i])


    def on_option_select(self, selection):
        self.selected_port = selection
        print(self.selected_port)


    def get_ports(self):
        self.option_menu['menu'].delete(0, 'end')

        self.ports = ecuscan.scan_ports()

        for choice in self.ports:
            self.option_menu['menu'].add_command(label=choice, command=tk._setit(self.selected_port, choice, callback=self.on_option_select))



GUI()



