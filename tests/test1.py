from obd import OBDCommand, Unit
from obd.protocols import ECU
from obd.utils import bytes_to_int

import obd

obd.logger.setLevel(obd.logging.DEBUG)

connection = obd.OBD('/dev/pts/3')


def rpm(messages):
    print(str(messages[0]))
    print(messages[0].data)

    """ decoder for RPM messages """
    d = messages[0].data # only operate on a single message
    d = d[2:] # chop off mode and PID bytes
    v = bytes_to_int(d) / 4.0  # helper function for converting byte arrays to ints
    return v * Unit.rpm # construct a Pint Quantity

a =  OBDCommand("RPM"                        , "Engine RPM"                              , b"010c", 4, rpm,             ECU.ENGINE, True)




# use the `force` parameter when querying
resp = connection.query(a, force=True)

print(resp)