package com.itech.utils.customExceptions;

public class WrongSensorMessageFormat extends RuntimeException {
    public WrongSensorMessageFormat(String message) {
        super("Wrong sensor message format from: "+message);
    }
}
