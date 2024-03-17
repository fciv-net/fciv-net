create table chatlog (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` TEXT,
  `answer` TEXT,
  `name` varchar(128),
  `reusable` bool,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

