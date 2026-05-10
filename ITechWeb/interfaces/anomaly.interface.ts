export interface Anomaly {
  sensorId: number;
  sensorName: string;
  sensorType: string;
  machineId: number;
  machineName: string;
  factoryId: number;
  factoryName: string;
  sensorValue: number;
  dataUnit: string;
  dateAndTime: string;
}
