import java.net.ServerSocket;
import java.net.Socket;

public class Main {
    public static void main(String[] args) {
        final int PORT = 8080;
        final int QUEUE_SIZE = 10;

        ConnectionQueue queue = new ConnectionQueue(QUEUE_SIZE);
        System.out.println("Bienvenido al programa de monitorización industrial.\n********************************************************************************");

        while (true) {
            try (ServerSocket serverSocket = new ServerSocket(PORT)) {
                Socket socket = serverSocket.accept();

                System.out.println("New connection from "+socket.getInetAddress());

                queue.putInQueue(socket);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
