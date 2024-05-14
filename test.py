import obd
import time

obd.logger.setLevel(obd.logging.DEBUG)
connection = obd.OBD('/dev/pts/5')
# connection = obd.Async('/dev/pts/5')

# print(connection.supported_commands)


pid = 'GET_DTC'
# with connection.paused() as was_running:
#     connection.watch(obd.commands[pid]) 
#     connection.start()

# time.sleep(5)

cmd = obd.commands[pid]
response = connection.query(cmd)
print(response)
