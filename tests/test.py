from obd import OBDCommand, Unit, ECU, obd
from obd.protocols import ECU
from obd.utils import bytes_to_int


obd.logger.setLevel(obd.logging.DEBUG)
# connection = obd.OBD('/dev/ttyUSB0', baudrate=115200, fast=False, protocol="6")
# connection = obd.Async('/dev/pts/8')
connection = obd.OBD('/dev/rfcomm0')



# Definizione della funzione di decodifica per il comando boost
def decode_boost(msg):
    # La risposta del PID è di solito di 2 byte per la pressione del turbo
    value = bytes_to_int(msg.data[0:4])
    # Convertire il valore a kPa, se necessario
    # Qui ipotizziamo che il valore letto sia già in kPa
    return value


# Creazione del comando OBD per il valore del boost
BOOST_COMMAND = OBDCommand(
    name="BOOST",
    desc="Boost pressure<zx<zxz",
    command=b"012E",  # Assumendo che 012E sia il PID per il boost (verifica il PID corretto per il tuo veicolo)
    _bytes=4,          # Numero di byte attesi nella risposta
    decoder=decode_boost,
    ecu=ECU.ENGINE,
    fast=True
)

a =     OBDCommand("RPM"                        , "Engine RPM"                              , b"010C", 4, decode_boost,             ECU.ENGINE, True),


response = connection.query(a)
print(response)

if response.value is not None:
    print(f"Boost pressure: {response.value} kPa")
else:
    print("Unable to read boost pressure")

connection.close()

# print(connection.supported_commands)
