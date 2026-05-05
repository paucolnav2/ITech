package com.itech.utils.classes;

public class Sensor {
    private Integer sensorID;
    private String sensorType;
    private Integer machineID;
    private String sensorName;

    public Sensor(Integer sensorID, String sensorType, Integer machineID, String sensorName) {
        this.sensorID = sensorID;
        this.sensorType = sensorType;
        this.machineID = machineID;
        this.sensorName = sensorName;
    }

    public Integer getSensorID() {
        return sensorID;
    }

    public void setSensorID(Integer sensorID) {
        this.sensorID = sensorID;
    }

    public String getSensorType() {
        return sensorType;
    }

    public void setSensorType(String sensorType) {
        this.sensorType = sensorType;
    }

    public Integer getMachineID() {
        return machineID;
    }

    public void setMachineID(Integer machineID) {
        this.machineID = machineID;
    }

    public String getSensorName() {
        return sensorName;
    }

    public void setSensorName(String sensorName) {
        this.sensorName = sensorName;
    }
}
