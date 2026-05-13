package com.itech.utils.classes;

public class Anomaly {
    private Integer sensorId;
    private String sensorName;
    private String sensorType;
    private Integer machineId;
    private String machineName;
    private Integer factoryId;
    private String factoryName;
    private Double sensorValue;
    private String dataUnit;
    private String dateAndTime;

    public Anomaly(Integer sensorId, String sensorName, String sensorType,
                   Integer machineId, String machineName,
                   Integer factoryId, String factoryName,
                   Double sensorValue, String dataUnit, String dateAndTime) {
        this.sensorId = sensorId;
        this.sensorName = sensorName;
        this.sensorType = sensorType;
        this.machineId = machineId;
        this.machineName = machineName;
        this.factoryId = factoryId;
        this.factoryName = factoryName;
        this.sensorValue = sensorValue;
        this.dataUnit = dataUnit;
        this.dateAndTime = dateAndTime;
    }

    public Integer getSensorId() { return sensorId; }
    public void setSensorId(Integer sensorId) { this.sensorId = sensorId; }

    public String getSensorName() { return sensorName; }
    public void setSensorName(String sensorName) { this.sensorName = sensorName; }

    public String getSensorType() { return sensorType; }
    public void setSensorType(String sensorType) { this.sensorType = sensorType; }

    public Integer getMachineId() { return machineId; }
    public void setMachineId(Integer machineId) { this.machineId = machineId; }

    public String getMachineName() { return machineName; }
    public void setMachineName(String machineName) { this.machineName = machineName; }

    public Integer getFactoryId() { return factoryId; }
    public void setFactoryId(Integer factoryId) { this.factoryId = factoryId; }

    public String getFactoryName() { return factoryName; }
    public void setFactoryName(String factoryName) { this.factoryName = factoryName; }

    public Double getSensorValue() { return sensorValue; }
    public void setSensorValue(Double sensorValue) { this.sensorValue = sensorValue; }

    public String getDataUnit() { return dataUnit; }
    public void setDataUnit(String dataUnit) { this.dataUnit = dataUnit; }

    public String getDateAndTime() { return dateAndTime; }
    public void setDateAndTime(String dateAndTime) { this.dateAndTime = dateAndTime; }
}
