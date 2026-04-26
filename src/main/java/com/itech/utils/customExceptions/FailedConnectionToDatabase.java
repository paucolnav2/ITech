package com.itech.utils.customExceptions;

public class FailedConnectionToDatabase extends RuntimeException {
    public FailedConnectionToDatabase(String message) {
        super("Can't connect to database due to sql error: "+message+"\nShutting down...");
    }
}
