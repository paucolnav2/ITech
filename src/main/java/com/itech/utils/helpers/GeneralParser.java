package com.itech.utils.helpers;

import com.itech.config.ConfigLoader;

public class GeneralParser {
    public static String dataTypeToDefaultUnit (String dataType) {
        String dataUnit;
        switch (dataType) {
            case "TEMPERATURE":
                dataUnit = String.valueOf(ConfigLoader.getTemperatureUnit());
                break;
            case "HUMIDITY":
                dataUnit = String.valueOf(ConfigLoader.getHumidityUnit());
                break;
            case "VIBRATION":
                dataUnit = String.valueOf(ConfigLoader.getVibrationUnit());
                break;
            case "PRESSURE":
                dataUnit = String.valueOf(ConfigLoader.getPressureUnit());
                break;
            case "LIGHT":
                dataUnit = String.valueOf(ConfigLoader.getLightUnit());
                break;
            case "SOUND":
                dataUnit = String.valueOf(ConfigLoader.getSoundUnit());
                break;
            case "MOISTURE":
                dataUnit = String.valueOf(ConfigLoader.getMoistureUnit());
                break;
            default:
                dataUnit = "OTHER";
                break;
        }
        return dataUnit;
    }

    public static boolean valueIsAnomaly (String dataType, Double value) {
        switch (dataType) {
            case "TEMPERATURE":
                return value > ConfigLoader.getTemperatureLimit();
            case "HUMIDITY":
                return value > ConfigLoader.getHumidityLimit();
            case "VIBRATION":
                return value > ConfigLoader.getVibrationLimit();
            case "PRESSURE":
                return value > ConfigLoader.getPressureLimit();
            case "LIGHT":
                return value > ConfigLoader.getLightLimit();
            case "SOUND":
                return value > ConfigLoader.getSoundLimit();
            case "MOISTURE":
                return value > ConfigLoader.getMoistureLimit();
            default:
                return false;
        }
    }
}
