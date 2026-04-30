package com.itech.clientHandlers;

import com.itech.utils.helpers.HttpParser;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class HTTPHandler {
    private BufferedReader input;
    private BufferedWriter output;


    public HTTPHandler(BufferedReader input, BufferedWriter output) {
        this.input = input;
        this.output = output;
    }

    public void handle (String firstLine) {
        List<String> headerList = new ArrayList<>();
//        List<String> bodyList = new ArrayList<>();

        headerList.add(firstLine);
        String line;
        try {
            while (!(line = input.readLine()).isEmpty()) {
                headerList.add(line);
            }

        } catch (IOException e) {
            throw new RuntimeException("Couldn't read http message: "+e.getMessage());
        }
        String [] header = headerList.toArray(new String[0]);

        String method = HttpParser.getMethod(header);
        String route = HttpParser.getRoute(header);

        if (method.equals("GET")) {
            if (route.equals("/sensors")) {
                SensorDAO.getAllSensors();
            }
        }
    }
}
