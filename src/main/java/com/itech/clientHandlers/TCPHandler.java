package com.itech.clientHandlers;

import com.itech.utils.customExceptions.WrongSensorMessageFormat;
import com.itech.utils.enums.SensorTypes;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.util.Arrays;
import java.util.zip.DataFormatException;

public class TCPHandler {
    private BufferedReader input;
    private BufferedWriter output;


    public TCPHandler(BufferedReader input, BufferedWriter output) {
        this.input = input;
        this.output = output;
    }

    //FORMATO "SENSOR1;TEMPERATURE;86"
    public void handle (String firstLine) {
        String[] sensorMessage = firstLine.split(";", -1);
        if (sensorMessage.length != 3) {
            throw new WrongSensorMessageFormat("incorrect message length (3 expected, "+sensorMessage.length+" received)");
        }

        for (int i = 0; i < 3; i++) {
            if (sensorMessage[i].isBlank()) {
                throw new WrongSensorMessageFormat("null or empty part of argument message (part "+(i+1)+")");
            }
        }

        if (!sensorMessage[0].toUpperCase().matches("SENSOR\\d")) {
            throw new WrongSensorMessageFormat("incorrect format in part 1 of argument sent");
        }

        try {
            SensorTypes.valueOf(sensorMessage[1].toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new WrongSensorMessageFormat("incorrect format in part 2 of argument sent");
        }
    }
}
