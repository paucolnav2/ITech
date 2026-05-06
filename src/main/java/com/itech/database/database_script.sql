CREATE TABLE unit_types(
    id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO unit_types(name) VALUES ('TEMPERATURE'), ('VIBRATION'), ('HUMIDITY'), ('PRESSURE'), ('LIGHT'), ('SOUND'), ('MOISTURE'), ('OTHERS');

CREATE TABLE data_units(
    id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    unit_type_id SMALLINT NOT NULL,
    CONSTRAINT fk_unit_type FOREIGN KEY (unit_type_id) REFERENCES unit_types(id) ON DELETE CASCADE
);

INSERT INTO data_units(name, unit_type_id)
VALUES
    (
        'CENTIGRADE',
        (SELECT id FROM unit_types WHERE name = 'TEMPERATURE')
    ),
    (
        'FAHRENHEIT',
        (SELECT id FROM unit_types WHERE name = 'TEMPERATURE')
    ),
    (
        'KELVIN',
        (SELECT id FROM unit_types WHERE name = 'TEMPERATURE')
    );

INSERT INTO data_units(name, unit_type_id)
VALUES
    (
        'HUMIDITYPERCENTAGE',
        (SELECT id FROM unit_types WHERE name = 'HUMIDITY')
    ),
    (
        'HUMIDITYGRAMSPERCUBICMETER',
        (SELECT id FROM unit_types WHERE name = 'HUMIDITY')
    ),
    (
        'HUMIDITYKILOGRAMSPERCUBICMETER',
        (SELECT id FROM unit_types WHERE name = 'HUMIDITY')
    ),
    (
        'HUMIDITYGRAMSPERKILOGRAM',
        (SELECT id FROM unit_types WHERE name = 'HUMIDITY')
    ),
    (
        'POUNDPERPOUND',
        (SELECT id FROM unit_types WHERE name = 'HUMIDITY')
    );

INSERT INTO data_units(name, unit_type_id)
VALUES
    (
        'VIBRATIONHERTZ',
        (SELECT id FROM unit_types WHERE name = 'VIBRATION')
    ),
    (
        'METERSPERSECONDSQUARED',
        (SELECT id FROM unit_types WHERE name = 'VIBRATION')
    ),
    (
        'G',
        (SELECT id FROM unit_types WHERE name = 'VIBRATION')
    ),
    (
        'MILLIMETERSPERSECOND',
        (SELECT id FROM unit_types WHERE name = 'VIBRATION')
    ),
    (
        'INCHESPERSECOND',
        (SELECT id FROM unit_types WHERE name = 'VIBRATION')
    ),
    (
        'MICROMETERS',
        (SELECT id FROM unit_types WHERE name = 'VIBRATION')
    ),
    (
        'MILS',
        (SELECT id FROM unit_types WHERE name = 'VIBRATION')
    );

INSERT INTO data_units(name, unit_type_id)
VALUES
    (
        'LUX',
        (SELECT id FROM unit_types WHERE name = 'LIGHT')
    ),
    (
        'LUMEN',
        (SELECT id FROM unit_types WHERE name = 'LIGHT')
    ),
    (
        'CANDELA',
        (SELECT id FROM unit_types WHERE name = 'LIGHT')
    );

INSERT INTO data_units(name, unit_type_id)
VALUES
    (
        'MOISTUREPERCENTAGE',
        (SELECT id FROM unit_types WHERE name = 'MOISTURE')
    ),
    (
        'MOISTUREGRAMSPERCUBICMETER',
        (SELECT id FROM unit_types WHERE name = 'MOISTURE')
    ),
    (
        'MOISTUREKILOGRAMSPERCUBICMETER',
        (SELECT id FROM unit_types WHERE name = 'MOISTURE')
    ),
    (
        'MOISTURECONTENT',
        (SELECT id FROM unit_types WHERE name = 'MOISTURE')
    );

INSERT INTO data_units(name, unit_type_id)
VALUES
    (
        'PASCAL',
        (SELECT id FROM unit_types WHERE name = 'PRESSURE')
    ),
    (
        'BAR',
        (SELECT id FROM unit_types WHERE name = 'PRESSURE')
    ),
    (
        'ATMOSPHERES',
        (SELECT id FROM unit_types WHERE name = 'PRESSURE')
    ),
    (
        'MMHG',
        (SELECT id FROM unit_types WHERE name = 'PRESSURE')
    ),
    (
        'INHG',
        (SELECT id FROM unit_types WHERE name = 'PRESSURE')
    ),
    (
        'POUNDSPERSQUAREINCH',
        (SELECT id FROM unit_types WHERE name = 'PRESSURE')
    );

INSERT INTO data_units(name, unit_type_id)
VALUES
    (
        'DECIBELS',
        (SELECT id FROM unit_types WHERE name = 'SOUND')
    ),
    (
        'SOUNDHERTZ',
        (SELECT id FROM unit_types WHERE name = 'SOUND')
    ),
    (
        'PHONS',
        (SELECT id FROM unit_types WHERE name = 'SOUND')
    ),
    (
        'SONES',
        (SELECT id FROM unit_types WHERE name = 'SOUND')
    ),
    (
        'WATTSPERSQUAREMETER',
        (SELECT id FROM unit_types WHERE name = 'SOUND')
    );

CREATE TABLE factory (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE machine (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    has_green_state BOOLEAN NOT NULL,
    factory_id INTEGER NOT NULL,
    CONSTRAINT fk_factory_id FOREIGN KEY (factory_id) REFERENCES factory(id) ON DELETE CASCADE
);

CREATE TABLE sensor (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    sensor_type_id SMALLINT NOT NULL,
    machine_id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT fk_machine_id FOREIGN KEY (machine_id) REFERENCES machine(id) ON DELETE CASCADE,
    CONSTRAINT fk_sensor_type_id FOREIGN KEY (sensor_type_id) REFERENCES unit_types(id) ON DELETE CASCADE
);

DELIMITER $$

CREATE PROCEDURE populate_data()
BEGIN
    DECLARE f INT DEFAULT 1;
    DECLARE m INT;
    DECLARE s INT;

    DECLARE machineId INT;
    DECLARE factoryId INT;

    WHILE f <= 25 DO

        INSERT INTO factory(name)
        VALUES (CONCAT('Factory_', f));

        SET factoryId = LAST_INSERT_ID();

        SET m = 1;

        WHILE m <= 10 DO

            INSERT INTO machine(name, has_green_state factory_id)
            VALUES (CONCAT('Machine_', f, '_', m), TRUE, factoryId);

            SET machineId = LAST_INSERT_ID();

            INSERT INTO sensor(sensor_type_id, machine_id, name)
                SELECT id, machineId, CONCAT('Sensor_', f, '_', m, '_', name)
                FROM unit_types
                WHERE name IN (
                    'TEMPERATURE',
                    'HUMIDITY',
                    'VIBRATION',
                    'PRESSURE',
                    'LIGHT',
                    'SOUND',
                    'MOISTURE'
                );

            SET m = m + 1;

        END WHILE;

        SET f = f + 1;

    END WHILE;

END$$

DELIMITER ;

CALL populate_data();

CREATE TABLE sensor_data (
    sensor_id INTEGER NOT NULL,
    date_and_time TIMESTAMP NOT NULL,
    data_unit_id SMALLINT NOT NULL,
    sensor_value DOUBLE NOT NULL,
    is_anomaly BOOLEAN NOT NULL,
    CONSTRAINT fk_data_unit FOREIGN KEY (data_unit_id) REFERENCES unit_types(id) ON DELETE CASCADE,
    CONSTRAINT fk_sensor_id FOREIGN KEY (sensor_id) REFERENCES sensor(id) ON DELETE CASCADE,
    PRIMARY KEY (sensor_id, date_and_time)
);
