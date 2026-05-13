package com.itech.clientHandlers;

import com.google.gson.Gson;
import com.itech.database.DAOs.*;
import com.itech.utils.classes.*;
import com.itech.utils.helpers.HttpParser;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class HTTPHandler {
    private BufferedReader input;
    private BufferedWriter output;

    public HTTPHandler(BufferedReader input, BufferedWriter output) {
        this.input = input;
        this.output = output;
    }

    public void handle(String firstLine) {
        List<String> headerList = new ArrayList<>();
        headerList.add(firstLine);
        String line;
        try {
            while (!(line = input.readLine()).isEmpty()) {
                headerList.add(line);
            }
        } catch (IOException e) {
            throw new RuntimeException("Couldn't read http message: " + e.getMessage());
        }

        String[] header = headerList.toArray(new String[0]);
        String method = HttpParser.getMethod(header);
        String route = HttpParser.getRoute(header);

        if (method.equals("OPTIONS")) {
            sendResponse(200, "{}");
            return;
        }

        if (!method.equals("GET")) {
            sendResponse(405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        try {
            handleGet(route);
        } catch (Exception e) {
            sendResponse(500, "{\"error\":\"" + e.getMessage().replace("\"", "'") + "\"}");
        }
    }

    private void handleGet(String route) {
        Gson gson = new Gson();

        if (route.equals("/sensors")) {
            List<Sensor> sensors = SensorDAO.getAllSensors();
            sendResponse(200, gson.toJson(sensors));

        } else if (route.equals("/machines")) {
            List<Machine> machines = MachineDAO.getAllMachines();
            sendResponse(200, gson.toJson(machines));

        } else if (route.matches("/machines/\\d+/sensors")) {
            int machineId = Integer.parseInt(route.split("/")[2]);
            List<Sensor> sensors = SensorDAO.getSensorsByMachineId(machineId);
            sendResponse(200, gson.toJson(sensors));

        } else if (route.matches("/machines/\\d+")) {
            int machineId = Integer.parseInt(route.split("/")[2]);
            Machine machine = MachineDAO.getMachineById(machineId);
            sendResponse(200, gson.toJson(machine));

        } else if (route.equals("/factories")) {
            List<Factory> factories = FactoryDAO.getAllFactories();
            sendResponse(200, gson.toJson(factories));

        } else if (route.matches("/factories/\\d+/machines")) {
            int factoryId = Integer.parseInt(route.split("/")[2]);
            List<Machine> machines = MachineDAO.getMachinesByFactoryId(factoryId);
            sendResponse(200, gson.toJson(machines));

        } else if (route.matches("/factories/\\d+")) {
            int factoryId = Integer.parseInt(route.split("/")[2]);
            Factory factory = FactoryDAO.getFactoryById(factoryId);
            sendResponse(200, gson.toJson(factory));

        } else if (route.matches("/sensor-data/\\d+")) {
            int sensorId = Integer.parseInt(route.split("/")[2]);
            List<SensorData> data = SensorDataDAO.getSensorDataBySensorId(sensorId);
            sendResponse(200, gson.toJson(data));

        } else if (route.equals("/anomalies")) {
            List<Anomaly> anomalies = AnomalyDAO.getAnomalies();
            sendResponse(200, gson.toJson(anomalies));

        } else {
            sendResponse(404, "{\"error\":\"Route not found\"}");
        }
    }

    private void sendResponse(int code, String body) {
        try {
            output.write(HttpParser.buildHttpResponse(code, body));
            output.flush();
        } catch (IOException e) {
            throw new RuntimeException("Couldn't send response to socket: " + e.getMessage());
        }
    }
}
