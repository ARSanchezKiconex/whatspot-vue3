/* Meter edificios (facilities) */
INSERT INTO `facilities` (`uuid`, `name`) 
VALUES ('5cbda8f9-3167-11f0-acb2-00155d98b300', 'genaq');
INSERT INTO `facilities` (`uuid`, `name`) 
VALUES ('8228a6a4-3167-11f0-acb2-00155d98b300', 'intarcon');
INSERT INTO `facilities` (`uuid`, `name`) 
VALUES ('b8c126d6-3bd4-4406-a601-5b73363e6f28', 'keyter');

/* Meter salas (rooms) en la tabla edificios (facilities) */
/* Edificio genaq, Sala 01 */
INSERT INTO `rooms` (`uuid`, `facility_uuid`, `name`, `capacity`) 
VALUES ('d7b52a21-3167-11f0-acb2-00155d98b300', '5cbda8f9-3167-11f0-acb2-00155d98b300', 'Sala 01', '8');
/* Edificio genaq, Sala 02 */
INSERT INTO `rooms` (`uuid`, `facility_uuid`, `name`, `capacity`) 
VALUES ('e88d972e-c809-46f1-865a-c341aa633041', '5cbda8f9-3167-11f0-acb2-00155d98b300', 'Sala 02', '12');

/* Edificio intarcon, Sala 12 */
INSERT INTO `rooms` (`uuid`, `facility_uuid`, `name`, `capacity`) 
VALUES ('f7a4340e-3167-11f0-acb2-00155d98b300', '8228a6a4-3167-11f0-acb2-00155d98b300', 'Sala 12', '24');
/* Edificio intarcon, Sala 13 */
INSERT INTO `rooms` (`uuid`, `facility_uuid`, `name`, `capacity`) 
VALUES ('d9c5e025-aab2-4eef-a00c-f84ba88b0e38', '8228a6a4-3167-11f0-acb2-00155d98b300', 'Sala 13', '10');

/* Edificio keyter, Sala 23 */
INSERT INTO `rooms` (`uuid`, `facility_uuid`, `name`, `capacity`) 
VALUES ('03ab2862-0a95-49d1-bdb8-132b72ec1d27', 'b8c126d6-3bd4-4406-a601-5b73363e6f28', 'Sala 23', '18');
/* Edificio keyter, Sala 24 */
INSERT INTO `rooms` (`uuid`, `facility_uuid`, `name`, `capacity`) 
VALUES ('6e8f71a1-3bd5-4326-b901-470519522603', 'b8c126d6-3bd4-4406-a601-5b73363e6f28', 'Sala 24', '4');

/* Meter usuarios (users) */
/* Usuario Admin */
INSERT INTO `users` (`uuid`, `user`, `mail`, `name`, `password`, `isAdmin`) 
VALUES ('5dec78cd-316b-11f0-acb2-00155d98b300', 'pepe', 'pepe@gmail.com', 'Pepe Ruiz Palacios', 'pepe1234', '1');

/* Usuarios Normales */
INSERT INTO `users` (`uuid`, `user`, `mail`, `name`, `password`, `isAdmin`) 
VALUES ('c96175fa-316b-11f0-acb2-00155d98b300', 'jose', 'jose@hotmail.com', 'José Ponferrada Díaz', 'jose1234', '0');
INSERT INTO `users` (`uuid`, `user`, `mail`, `name`, `password`, `isAdmin`) 
VALUES ('fab2b79a-0d53-4244-8fb2-a48ab61e80f4', 'antonio', 'antonio@gmail.com', 'Antonio Fernández Espejo', 'antonio1234', '0');

/* Meter una 1ª reserva(booking) */
INSERT INTO `booking` (`uuid`, `user_uuid`, `room_uuid`, `start_date`, `end_date`, `start_time`, `end_time`, `title`, `details`) 
VALUES ('8badfae8-3199-11f0-b35c-00155d98b300', 'c96175fa-316b-11f0-acb2-00155d98b300', '03ab2862-0a95-49d1-bdb8-132b72ec1d27', '2025-05-16', '2025-05-16', '10:00:00', '11:00:00', 'Resérvame esta', 'venid todos!');
/* Meter una 2ª reserva(booking) */
INSERT INTO `booking` (`uuid`, `user_uuid`, `room_uuid`, `start_date`, `end_date`, `start_time`, `end_time`, `title`, `details`) 
VALUES ('516d26ce-66d6-472a-bc23-e43531d17ac3', 'fab2b79a-0d53-4244-8fb2-a48ab61e80f4', '03ab2862-0a95-49d1-bdb8-132b72ec1d27', '2025-05-16', '2025-05-16', '11:15:00', '13:15:00', 'Reunión importante', 'no faltes!');