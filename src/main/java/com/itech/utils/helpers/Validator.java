package com.itech.utils.helpers;

import com.itech.utils.customExceptions.WrongSensorMessageFormat;
import com.itech.utils.enums.SensorTypes;

public class Validator {
    public static boolean validateStringToNumberConversion (String string) {
        return string.matches("[0-9]+");
    }

    public static boolean validateStringIsPositiveNumberOrZero (String string) {
        return Integer.parseInt(string) >= 0;
    }

    public static boolean validateStringIsPositiveNumberOtherThanZero (String string) {
        return Integer.parseInt(string) > 0;
    }

    public static boolean validateStringToNumberOrDecimalNumberConversion (String string) {
        return string.matches("[0-9]+(\\.[0-9]+)?");
    }

    public static String[] validateSensorMessage (String firstLine) {
        String[] sensorMessage = firstLine.split(";", -1);
        if (sensorMessage.length != 3) {
            throw new WrongSensorMessageFormat("incorrect message length (3 expected, "+sensorMessage.length+" received)");
        }

        for (int i = 0; i < 3; i++) {
            if (sensorMessage[i].isBlank()) {
                throw new WrongSensorMessageFormat("null or empty part of argument message (part "+(i+1)+")");
            }
        }

        // cambiado para hacer que la primera parte del argumento sea el id del sensor (en string)
        /*if (!sensorMessage[0].toUpperCase().matches("SENSOR\\d+")) {
            throw new WrongSensorMessageFormat("incorrect format in part 1 of argument sent");
        }*/

        try {
            SensorTypes.valueOf(sensorMessage[1].toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new WrongSensorMessageFormat("incorrect format in part 2 of argument sent");
        }

        if (!Validator.validateStringToNumberOrDecimalNumberConversion(sensorMessage[2])) {
            throw new WrongSensorMessageFormat("incorrect format in part 3 of argument sent, decimal numbers only");
        }

        return sensorMessage;
    }
}
