package config;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

public class ConfigLoader {
    Properties prop = new Properties();

    public ConfigLoader() {
        try {
            prop.load(new FileInputStream("config/config.properties"));
        } catch (IOException e) {
            throw new RuntimeException("Problem loading properties file: "+e);
        }
    }

    private boolean validateStringToNumberConversion (String string) {
        return string.matches("[0-9]+");
    }

    private boolean validateStringIsPositiveNumberOrZero (String string) {
        return Integer.parseInt(string) >= 0;
    }

    private boolean validateStringIsPositiveNumberOtherThanZero (String string) {
        return Integer.parseInt(string) > 0;
    }

    public int getServerPort () {
        String stringServerPort = prop.getProperty("server.port", "8080");
        if (validateStringToNumberConversion(stringServerPort) && validateStringIsPositiveNumberOrZero(stringServerPort)) {
            return Integer.parseInt(stringServerPort);
        }
        else {
            throw new IllegalArgumentException("Invalid server port, positive numbers only: "+stringServerPort);
        }
    }

    public int getThreadQueueSize () {
        String stringThreadQueueSize = prop.getProperty("thread.queue.size", "10");
        if (validateStringToNumberConversion(stringThreadQueueSize) && validateStringIsPositiveNumberOtherThanZero(stringThreadQueueSize)) {
            return Integer.parseInt(stringThreadQueueSize);
        }
        else {
            throw new IllegalArgumentException("Invalid thread queue size, numbers greater than zero only: "+ stringThreadQueueSize);
        }
    }
}