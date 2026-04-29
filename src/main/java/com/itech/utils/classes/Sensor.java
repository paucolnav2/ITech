package com.itech.utils.classes;

import com.itech.utils.enums.SensorTypes;

public class Sensor {
    private Integer sensorID;
    private SensorTypes sensorType;

    public Sensor(Integer sensorID, String sensorType) {
        this.sensorID = sensorID;
        this.sensorType = SensorTypes.valueOf(sensorType);
    }

    public Integer getSensorID() {
        return sensorID;
    }

    public void setSensorID(Integer sensorID) {
        this.sensorID = sensorID;
    }

    public SensorTypes getSensorType() {
        return sensorType;
    }

    public void setSensorType(SensorTypes sensorType) {
        this.sensorType = sensorType;
    }
}
