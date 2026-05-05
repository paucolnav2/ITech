package com.itech.config;

import com.itech.utils.enums.units.*;

import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.*;

import static com.itech.utils.helpers.Validator.*;

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
            throw new RuntimeException("Configuration errors present, shutting down...");
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
        String stringHumidityUnit = prop.getProperty("unit.humidity", "HUMIDITYPERCENTAGE");
        try {
            return HumidityUnits.valueOf(stringHumidityUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid humidity unit, check for typos");
        }
    }

    public static VibrationUnits getVibrationUnit () {
        String stringVibrationUnit = prop.getProperty("unit.vibration", "VIBRATIONHERTZ");
        try {
            return VibrationUnits.valueOf(stringVibrationUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid vibration unit, check for typos");
        }
    }

    public static PressureUnits getPressureUnit () {
        String stringPressureUnit = prop.getProperty("unit.pressure", "ATMOSPHERES");
        try {
            return PressureUnits.valueOf(stringPressureUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid pressure unit, check for typos");
        }
    }

    public static LightUnits getLightUnit () {
        String stringLightUnit = prop.getProperty("unit.light", "LUX");
        try {
            return LightUnits.valueOf(stringLightUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid light unit, check for typos");
        }
    }

    public static SoundUnits getSoundUnit () {
        String stringSoundUnit = prop.getProperty("unit.sound", "DECIBELS");
        try {
            return SoundUnits.valueOf(stringSoundUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid sound unit, check for typos");
        }
    }

    public static MoistureUnits getMoistureUnit () {
        String stringMoistureUnit = prop.getProperty("unit.moisture", "MOISTUREPERCENTAGE");
        try {
            return MoistureUnits.valueOf(stringMoistureUnit.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid moisture unit, check for typos");
        }
    }

    public static String getDatabaseIPDirection () {
        String stringDatabaseIPDirection = prop.getProperty("database.ip.direction", "localhost").toLowerCase();
        if (stringDatabaseIPDirection.matches("localhost") || stringDatabaseIPDirection.matches("\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}")) {
            return stringDatabaseIPDirection;
        } else {
            throw new IllegalArgumentException("Invalid database IP direction");
        }
    }

    public static String getDatabasePort () {
        String stringDatabasePort = prop.getProperty("database.port", "3306");
        if (stringDatabasePort.matches("\\d{1,5}")) {
            return stringDatabasePort;
        } else {
            throw new IllegalArgumentException("Invalid database port");
        }
    }

    public static String getDatabaseName () {
        return prop.getProperty("database.name", "ITech");
    }

    public static String getDatabaseUsername () {
        return prop.getProperty("database.username", "root");
    }

    public static String getDatabasePassword () {
        return prop.getProperty("database.password", "root");
    }
}