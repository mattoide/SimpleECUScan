import obd

# Connessione all'OBD-II
connection = obd.OBD('/dev/pts/8')

# print(connection.supported_commands)

# Lettura del valore MAP
cmd = obd.commands.INTAKE_PRESSURE  # Comando OBD per la pressione assoluta del collettore
INTAKE_PRESSURE = connection.query(cmd)
cmd = obd.commands.BAROMETRIC_PRESSURE  # Comando OBD per la pressione assoluta del collettore
BAROMETRIC_PRESSURE = connection.query(cmd)

turbo_pressure = INTAKE_PRESSURE.value - BAROMETRIC_PRESSURE.value

print(turbo_pressure.to("bar"))

    # Per ottenere la pressione del turbo
print(f"Pressione del turbo: {turbo_pressure} kPa")
# print("Impossibile leggere la pressione del collettore.")

# Chiusura della connessione
connection.close()
