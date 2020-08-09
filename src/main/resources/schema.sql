DROP TABLE IF EXISTS airfare;
DROP TABLE IF EXISTS airline;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS point_of_interest;
DROP TABLE IF EXISTS city;

CREATE TABLE city
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(50)  NOT NULL,
    image     VARCHAR(100) NOT NULL,
    latitude  FLOAT        NOT NULL,
    longitude FLOAT        NOT NULL
);

CREATE TABLE point_of_interest
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) COLLATE utf8mb4_unicode_ci   NOT NULL,
    description VARCHAR(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
    image       VARCHAR(100)                             NOT NULL,
    latitude    FLOAT                                    NOT NULL,
    longitude   FLOAT                                    NOT NULL,
    city_id     INT                                      NOT NULL,
    FOREIGN KEY (city_id) REFERENCES city (id)
);

CREATE TABLE airline
(
    id      INT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(50)  NOT NULL,
    image   VARCHAR(100) NOT NULL,
    city_id INT          NOT NULL,
    FOREIGN KEY (city_id) REFERENCES city (id)
);

create table course
(
    from_city_id INT   NOT NULL,
    to_city_id   INT   NOT NULL,
    distance     FLOAT NOT NULL,
    duration     FLOAT NOT NULL,
    FOREIGN KEY (from_city_id) REFERENCES city (id),
    FOREIGN KEY (to_city_id) REFERENCES city (id),
    PRIMARY KEY (from_city_id, to_city_id)
);

create table airfare
(
    from_city_id INT   NOT NULL,
    to_city_id   INT   NOT NULL,
    airline_id   INT   NOT NULL,
    price        FLOAT NOT NULL,
    FOREIGN KEY (from_city_id) REFERENCES city (id),
    FOREIGN KEY (to_city_id) REFERENCES city (id),
    FOREIGN KEY (airline_id) REFERENCES airline (id),
    PRIMARY KEY (from_city_id, to_city_id, airline_id)
);

CREATE TABLE player
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password CHAR(60)           NOT NULL,
    image    VARCHAR(100)       NOT NULL,
    money    FLOAT              NOT NULL,
    stamina  INT                NOT NULL,
    city_id  INT                NOT NULL,
    FOREIGN KEY (city_id) REFERENCES city (id)
);

CREATE TABLE customer
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(50)  NOT NULL,
    image             VARCHAR(100) NOT NULL,
    message           VARCHAR(250) NOT NULL,
    price             FLOAT        NOT NULL,
    max_price         FLOAT        NOT NULL,
    negotiation_count INT          NOT NULL DEFAULT 0,
    expire_at         DATETIME     NOT NULL,
    city_id           INT          NOT NULL,
    player_id         INT          NOT NULL,
    FOREIGN KEY (city_id) REFERENCES city (id),
    FOREIGN KEY (player_id) REFERENCES player (id)
);

CREATE TABLE achievement
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    title     VARCHAR(50)  NOT NULL,
    tag       VARCHAR(10)  NOT NULL,
    icon      VARCHAR(100) NOT NULL,
    player_id INT          NOT NULL,
    FOREIGN KEY (player_id) REFERENCES player (id)
);

DROP TABLE IF EXISTS mission;
CREATE TABLE mission
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(50)   NOT NULL,
    tag         VARCHAR(10)   NOT NULL,
    icon        VARCHAR(100)  NOT NULL,
    description VARCHAR(100)  NOT NULL,
    progress    FLOAT         NOT NULL,
    finished    BIT           NOT NULL,
    data        VARCHAR(1000),
    player_id   INT           NOT NULL,
    FOREIGN KEY (player_id) REFERENCES player (id)
);
