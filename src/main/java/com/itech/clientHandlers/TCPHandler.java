package com.itech.clientHandlers;

import com.itech.database.DAOs.SensorDataDAO;
import com.itech.database.DatabaseManager;
import com.itech.utils.helpers.Validator;

import java.io.BufferedReader;
import java.io.BufferedWriter;

public class TCPHandler {
    private BufferedReader input;
    private BufferedWriter output;


    public TCPHandler(BufferedReader input, BufferedWriter output) {
        this.input = input;
        this.output = output;
    }

    //FORMATO "SENSORID;FAHRENHEIT;86"
    public void handle (String firstLine) {
        String[] sensorMessage = Validator.validateSensorMessage(firstLine);

        SensorDataDAO.saveSensorData(sensorMessage);
    }
}
