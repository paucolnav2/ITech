package com.itech.utils.classes;

public class SensorData {
    private Integer sensorId;
    private Double sensorValue;
    private String dateAndTime;
    private Boolean isAnomaly;
    private String dataUnit;

    public SensorData(Integer sensorId, Double sensorValue, String dateAndTime, Boolean isAnomaly, String dataUnit) {
        this.sensorId = sensorId;
        this.sensorValue = sensorValue;
        this.dateAndTime = dateAndTime;
        this.isAnomaly = isAnomaly;
        this.dataUnit = dataUnit;
    }

    public Integer getSensorId() { return sensorId; }
    public void setSensorId(Integer sensorId) { this.sensorId = sensorId; }

    public Double getSensorValue() { return sensorValue; }
    public void setSensorValue(Double sensorValue) { this.sensorValue = sensorValue; }

    public String getDateAndTime() { return dateAndTime; }
    public void setDateAndTime(String dateAndTime) { this.dateAndTime = dateAndTime; }

    public Boolean getIsAnomaly() { return isAnomaly; }
    public void setIsAnomaly(Boolean isAnomaly) { this.isAnomaly = isAnomaly; }

    public String getDataUnit() { return dataUnit; }
    public void setDataUnit(String dataUnit) { this.dataUnit = dataUnit; }
}
