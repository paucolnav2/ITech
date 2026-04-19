import config.ConfigLoader;

import java.net.ServerSocket;
import java.net.Socket;

public class Main {
    public static void main(String[] args) {
        ConfigLoader configLoader = new ConfigLoader();
        final int SERVER_PORT = configLoader.getServerPort();
        final int QUEUE_SIZE = configLoader.getThreadQueueSize();

        ConnectionQueue queue = new ConnectionQueue(QUEUE_SIZE);
        System.out.println("Bienvenido al programa de monitorización industrial.\n********************************************************************************");

        try (ServerSocket serverSocket = new ServerSocket(SERVER_PORT)) {
            while (true) {
                Socket socket = serverSocket.accept();

                System.out.println("New connection from " + socket.getInetAddress());

                queue.putInQueue(socket);
            }
        } catch (Exception e){
            System.out.println("Error: " + e.getMessage());
        }
    }
}
