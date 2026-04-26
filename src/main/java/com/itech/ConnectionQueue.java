package com.itech;

import com.itech.clientHandlers.ClientHandler;

import java.net.Socket;
import java.util.LinkedList;
import java.util.Queue;

public class ConnectionQueue {
    private Queue<Socket> queue = new LinkedList<>();
    private final int maxSize;

    public ConnectionQueue(int maxSize) {
        this.maxSize = maxSize;
        for (int i = 0; i < maxSize; i++) {
            new ClientHandler(this).start();
        }
    }

    public synchronized void putInQueue(Socket socket) {
        while (queue.size() >= maxSize) {
            try {
                wait();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Couldn't put in queue: "+e.getMessage());
            }
        }
        queue.add(socket);
        notifyAll();
    }

    public synchronized Socket getFromQueue() {
        while (queue.isEmpty()) {
            try {
                wait();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Couldn't get from queue: " + e.getMessage());
            }
        }
        Socket socket = queue.poll();
        notifyAll();
        return socket;
    }
}