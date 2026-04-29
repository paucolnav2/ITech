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

CREATE TABLE sensor