package com.itech.config;

import com.itech.utils.enums.HumidityUnits;
import com.itech.utils.enums.TemperatureUnits;
import com.itech.utils.enums.VibrationUnits;

import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.*;

import static com.itech.utils.helper.Validator.*;

public class ConfigLoader {
    private static final Properties prop = getConfigurationFile();

    public static void validateConfigurationFile() {
        boolean errorPresent = false;
        Method[] methods = ConfigLoader.class.getDeclaredMethods();

        for (Method method : methods) {
            String methodName = method.getName();

            if (methodName.startsWith("get") && !methodName.startsWith("getConfigurationFile")) {
                try {
                    method.invoke(null);
                } catch (Exception e) {
                    Throwable cause = e.getCause();

                    System.err.println(Objects.requireNonNullElse(cause, e).getMessage());
                    errorPresent = true;
                }
            }
        }

        if (errorPresent) {
            System.err.println("Configuration errors present, shutting down...");

            System.exit(1);
        }
    }

    public static Properties getConfigurationFile() {
        Properties prop = new Properties();
        try {
            prop.load(new FileInputStream("config/config.properties"));
            return prop;
        } catch (IOException e) {
            throw new RuntimeException("Problem loading properties file: "+e);
        }
    }

    public static int getServerPort () {
        String stringServerPort = prop.getProperty("server.port", "8080");
        if (validateStringToNumberConversion(stringServerPort) && validateStringIsPositiveNumberOrZero(stringServerPort)) {
            return Integer.parseInt(stringServerPort);
        }
        else {
            throw new IllegalArgumentException("Invalid server port, positive numbers only: "+stringServerPort);
        }
    }

    public static int getThreadQueueSize () {
        String stringThreadQueueSize = prop.getProperty("thread.queue.size", "10");
        if (validateStringToNumberConversion(stringThreadQueueSize) && validateStringIsPositiveNumberOtherThanZero(stringThreadQueueSize)) {
            return Integer.parseInt(stringThreadQueueSize);
        }
        else {
            throw new IllegalArgumentException("Invalid thread queue size, numbers greater than zero only: "+ stringThreadQueueSize);
        }
    }

    public static TemperatureUnits getTemperatureUnit () {
        String stringTemperatureUnit = prop.getProperty("unit.temperature", "CENTIGRADE");
        try {
            return TemperatureUnits.valueOf(stringTemperatureUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid temperature unit, check for typos");
        }
    }

    public static HumidityUnits getHumidityUnit () {
        String stringHumidityUnit = prop.getProperty("unit.humidity", "PERCENTAGE");
        try {
            return HumidityUnits.valueOf(stringHumidityUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid humidity unit, check for typos");
        }
    }

    public static VibrationUnits getVibrationUnit () {
        String stringVibrationUnit = prop.getProperty("unit.vibration", "HERTZ");
        try {
            return VibrationUnits.valueOf(stringVibrationUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid vibration unit, check for typos");
        }
    }
}