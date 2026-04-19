import java.io.*;
import java.net.Socket;

public class ClientHandler extends Thread {
    private final ConnectionQueue queue;

    public ClientHandler(ConnectionQueue queue) {
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
                    switch (input.readLine()) {

                    }
                } catch (IOException e) {
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