import java.net.Socket;
import java.util.LinkedList;
import java.util.Queue;

public class ConnectionQueue {
    private Queue<Socket> queue = new LinkedList<>();
    private final int maxSize;

    public ConnectionQueue(int maxSize) {
        this.maxSize = maxSize;
    }

    public synchronized void putInQueue(Socket socket) throws InterruptedException {
        while (queue.size() >= maxSize) {
            wait();
        }
        queue.add(socket);
        notifyAll();
    }

    public synchronized Socket getFromQueue() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        Socket socket = queue.poll();
        notifyAll();
        return socket;
    }
}