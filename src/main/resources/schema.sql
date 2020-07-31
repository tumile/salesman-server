DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS player;
DROP TABLE IF EXISTS airline;
DROP TABLE IF EXISTS point_of_interest;
DROP TABLE IF EXISTS city;

CREATE TABLE city (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    image VARCHAR(100) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE point_of_interest (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    image VARCHAR(100) NOT NULL,
    description VARCHAR(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    city_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (city_id) REFERENCES city (id)
);

CREATE TABLE airline (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    image VARCHAR(100) NOT NULL,
    city_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (city_id) REFERENCES city (id)
);

create table connection (
    from_city_id INT NOT NULL,
    to_city_id INT NOT NULL,
    distance FLOAT NOT NULL,
    duration INT NOT NULL,
    FOREIGN KEY (from_city_id) REFERENCES city (id),
    FOREIGN KEY (to_city_id) REFERENCES city (id)
);

CREATE TABLE player (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) UNIQUE NOT NULL,
    password CHAR(60) NOT NULL,
    image VARCHAR(100) NOT NULL,
    money FLOAT NOT NULL,
    stamina INT NOT NULL,
    city_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (city_id) REFERENCES city (id)
);

CREATE TABLE customer (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    image VARCHAR(100) NOT NULL,
    message VARCHAR(250) NOT NULL,
    price FLOAT NOT NULL,
    expire_at DATETIME,
    is_expired BIT NOT NULL,
    city_id INT NOT NULL,
    player_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (city_id) REFERENCES city (id),
    FOREIGN KEY (player_id) REFERENCES player(id)
);
