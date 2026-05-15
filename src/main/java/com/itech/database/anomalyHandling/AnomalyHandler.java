package com.itech.database.anomalyHandling;

import com.itech.config.ConfigLoader;
import com.itech.database.DAOs.FactoryDAO;
import com.itech.database.DAOs.MachineDAO;
import com.itech.database.DatabaseManager;
import com.itech.odoo.OdooClient;
import com.itech.utils.classes.Factory;
import com.itech.utils.classes.Machine;
import com.itech.utils.helpers.GeneralParser;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


public class AnomalyHandler {
    public static void handleAnomaly(String dataUnit, String sensorType, Integer sensorId, double readingValue) {
        if (ConfigLoader.getMultipleAnomalyReportingAmount() == 1) {
            alertAnomaly(sensorId, sensorType, dataUnit, readingValue);
        }
        else if (checkMultipleAnomaly(dataUnit, sensorId)) {
            alertAnomaly(sensorId, sensorType, dataUnit, readingValue);
        }
    }

    public static void alertAnomaly(Integer sensorId, String sensorType, String dataUnit, double readingValue) {
        Machine machine = MachineDAO.getMachineBySensorId(sensorId);
        Factory factory = FactoryDAO.getFactoryByMachineId(machine.getFactoryId());

        MachineDAO.updateMachineState(machine.getId(), false);

        Integer UID = OdooClient.getOdooUID();

        String name = "Anomaly detected in machine "+machine.getId()+" named \""+machine.getName()+"\".";

        String description = "Sensor "+sensorId+" which measures "+ sensorType +" detected "+readingValue+" "+dataUnit+". Dangerous anomaly on machine "+machine.getId()+" named \""+machine.getName()+"\" located on factory with id "+factory.getId()+" named \""+factory.getName()+"\".";

        OdooClient.createTicket(UID, name, description);
    }

    public static void checkRecovery(Integer sensorId) {
        Machine machine = MachineDAO.getMachineBySensorId(sensorId);
        if (Boolean.TRUE.equals(machine.getHasGreenState())) return;
        boolean hasRecent = MachineDAO.machineHasRecentAnomalies(machine.getId());
        if (!hasRecent) {
            MachineDAO.updateMachineState(machine.getId(), true);
        }
    }

    public static boolean checkMultipleAnomaly (String dataUnit, Integer sensorId) {
        String sqlQuery = "SELECT COUNT(*) >= ? AS has_anomalies FROM sensor_data WHERE sensor_id = ? AND data_unit_id = (SELECT id FROM data_units WHERE name = ?) AND is_anomaly = TRUE AND date_and_time >= NOW() - INTERVAL ? SECOND";
        try (
                Connection connection = DatabaseManager.getConnection();
                PreparedStatement statement = connection.prepareStatement(sqlQuery)
        ) {
            statement.setInt(1, ConfigLoader.getMultipleAnomalyReportingAmount());
            statement.setInt(2, sensorId);
            statement.setString(3, dataUnit);
            statement.setInt(4, ConfigLoader.getMultipleAnomalyReportingTimeInterval());

            ResultSet resultSet = statement.executeQuery();
            resultSet.next();
            return resultSet.getBoolean("has_anomalies");
        } catch (SQLException e) {
            throw new RuntimeException("Couldn't check for multiple anomalies: "+e.getMessage());
        }
    }
}
