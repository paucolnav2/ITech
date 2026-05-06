package com.itech.utils.classes;

public class Machine {
    private Integer id;
    private String name;
    private Boolean hasGreenState;
    private Integer factoryId;

    public Machine(Integer id, String name, Boolean hasGreenState, Integer factoryId) {
        this.id = id;
        this.name = name;
        this.hasGreenState = hasGreenState;
        this.factoryId = factoryId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getHasGreenState() {
        return hasGreenState;
    }

    public void setHasGreenState(Boolean hasGreenState) {
        this.hasGreenState = hasGreenState;
    }

    public Integer getFactoryId() {
        return factoryId;
    }

    public void setFactoryId(Integer factoryId) {
        this.factoryId = factoryId;
    }
}
