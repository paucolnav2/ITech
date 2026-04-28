package com.itech.clientHandlers;

import com.itech.ConnectionQueue;

import java.io.*;
import java.net.Socket;

public class ClientHandler extends Thread {
    private final ConnectionQueue queue;

    public ClientHandler(com.itech.ConnectionQueue queue) {
        this.queue = queue;
    }

    @Override
    public void run() {
        while (true) {
            Socket socket = queue.getFromQueue();

            if (socket != null) {
                try (
                        BufferedReader input = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                        BufferedWriter output = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))
                ) {
                    String firstLine = input.readLine();

                    if (firstLine.isBlank()) {
                        throw new IOException("Message without content received from "+Thread.currentThread().getName());
                    }

                    if (firstLine.startsWith("GET") || firstLine.startsWith("POST") || firstLine.startsWith("DELETE") || firstLine.startsWith("PUT")) {
                        new HTTPHandler(input, output).handle(firstLine);
                    } else {
                        new TCPHandler(input, output).handle(firstLine);
                    }
                } catch (Exception e) {
                    System.out.println("Error in " + Thread.currentThread().getName() + ": " + e.getMessage());
                } finally {
                    try {
                        socket.close();
                    } catch (IOException e) {
                        System.out.println("Error closing socket in " + Thread.currentThread().getName() + ": " + e.getMessage());
                    }
                }
            }
        }
    }
}