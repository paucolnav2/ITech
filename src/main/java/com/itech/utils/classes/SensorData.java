package com.itech.utils.classes;

public class SensorData {
    private Sensor sensor;
    private Double sensorValue;
    private String dateAndTime;

    public SensorData(Sensor sensor, Double sensorValue, String dateAndTime) {
        this.sensor = sensor;
        this.sensorValue = sensorValue;
        this.dateAndTime = dateAndTime;
    }

    public Sensor getSensor() {
        return sensor;
    }

    public void setSensor(Sensor sensor) {
        this.sensor = sensor;
    }

    public Double getSensorValue() {
        return sensorValue;
    }

    public void setSensorValue(Double sensorValue) {
        this.sensorValue = sensorValue;
    }

    public String getDateAndTime() {
        return dateAndTime;
    }

    public void setDateAndTime(String dateAndTime) {
        this.dateAndTime = dateAndTime;
    }
}
