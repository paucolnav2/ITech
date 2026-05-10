package com.itech.utils.classes;

import java.util.List;

public class Sensor {
    private Integer sensorID;
    private List<String> sensorTypes;
    private Integer machineID;
    private String sensorName;

    public Sensor(Integer sensorID, List<String> sensorTypes, Integer machineID, String sensorName) {
        this.sensorID = sensorID;
        this.sensorTypes = sensorTypes;
        this.machineID = machineID;
        this.sensorName = sensorName;
    }

    public Integer getSensorID() {
        return sensorID;
    }

    public void setSensorID(Integer sensorID) {
        this.sensorID = sensorID;
    }

    public List<String> getSensorTypes() {
        return sensorTypes;
    }

    public void setSensorTypes(List<String> sensorTypes) {
        this.sensorTypes = sensorTypes;
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
