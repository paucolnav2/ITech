package com.itech.clientHandlers;

import java.io.BufferedReader;
import java.io.BufferedWriter;

public class HTTPHandler {
    private BufferedReader input;
    private BufferedWriter output;


    public HTTPHandler(BufferedReader input, BufferedWriter output) {
        this.input = input;
        this.output = output;
    }

    public void handle (String firstLine) {

    }
}
