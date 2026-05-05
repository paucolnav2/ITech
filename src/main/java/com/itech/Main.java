package com.itech;

import com.itech.config.ConfigLoader;
import com.itech.database.DatabaseManager;

import java.net.ServerSocket;
import java.net.Socket;

public class Main {
    public static void main(String[] args) {
//        ConfigLoader.validateConfigurationFile();
//        DatabaseManager.validateDatabaseConnection();
        final int SERVER_PORT = ConfigLoader.getServerPort();
        final int QUEUE_SIZE = ConfigLoader.getThreadQueueSize();

        ConnectionQueue queue = new ConnectionQueue(QUEUE_SIZE);
        System.out.println("Bienvenido al programa de monitorización industrial.\n********************************************************************************");

        try (ServerSocket serverSocket = new ServerSocket(SERVER_PORT)) {
            while (true) {
                Socket socket = serverSocket.accept();

                System.out.println("New connection from " + socket.getInetAddress());

                queue.putInQueue(socket);
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
