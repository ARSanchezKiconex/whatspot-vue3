// const uuid = require("uuid");
// const bcryptjs = require("bcryptjs");
// const jwt = require("../api/userToken");
// const User = require("../models/user");
// const Privilege = require("../models/privilege");
// const Role = require("../models/role");
// const cache = require('../utils/cacheAdapter');
// const moment = require("moment");
// const version = require("../utils/version");
// const { uuidValidateV4 } = require("../utils/validation");

// const userCtrl = {};

// // Registro de usuario (sign up)
// userCtrl.signUp = async (req, res) => {
//   const { password, repeatPassword } = req.body;
//   if (!password || !repeatPassword) {
//     return res.send({ message: "Las contraseñas son obligatorias." });
//   }
//   if (password !== repeatPassword) {
//     return res.send({ message: "Las contraseñas no coinciden." });
//   }

//   let newUser = new User(uuid.v4(), true);
//   newUser.set(req.body);
//   newUser.setUser(res.locals.user);
//   const result = await newUser.create();

//   if (result.errorInfo && result.errorInfo.code === "ER_DUP_ENTRY") {
//     return res.json({ ok: false, message: "Nombre de usuario ya en uso" });
//   } else if (result.error) {
//     return res.json({ ok: false, message: "Error en la operación" });
//   } else {
//     return res.json(result);
//   }
// };

// // Inicio de sesión de usuario (sign in)
// userCtrl.signIn = async (req, res) => {
//   const { username, password } = req.body;
//   const user = new User();
//   const privilege = new Privilege();

//   const filter = { 'name': username };
//   const result = await user.read(filter);

//   if (result.error) {
//     return res.json({ ok: false, message: "Error en la operación" });
//   }

//   const userStored = result[0];

//   if (!userStored) {
//     return res.send({ login: false, message: "Usuario no encontrado." });
//   } else {
//     const role = new Role(userStored.role_uuid);
//     const roleData = await role.read();
//     const privilegesResult = await privilege.listActive(userStored.role_uuid);
//     let privileges = [];
//     if (result.error) {
//       return res.json({ ok: false, message: "Error en la operación" });
//     } else {
//       privilegesResult.forEach(priv => {
//         privileges.push(priv.name);
//       });
//     }

//     bcryptjs.compare(password, userStored.password, (err, check) => {
//       if (err) {
//         return res.send({ message: "Error del servidor." });
//       } else {
//         if (check) {
//           if (!userStored.active) {
//             return res.send({
//               code: 200,
//               login: false,
//               message: "El usuario no ha sido activado.",
//             });
//           } else {
//             const token = jwt.createCacheToken();
//             userStored.token = token;
//             userStored.privileges = privileges;
//             userStored.is_admin = roleData[0].admin;
//             userStored.start = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
//             userStored.version = version.getVersion();
//             cache.setRedis(token, userStored, true);
//             return res.send({
//               login: true,
//               message: "Inicio de sesión con éxito",
//               accessToken: jwt.createAccessToken(userStored),
//               refreshToken: jwt.createRefreshToken(userStored),
//               apiToken: token,
//               privilegesToken: privileges,
//             });
//           }
//         } else {
//           return res.send({ login: false, message: "Contraseña incorrecta" });
//         }
//       }
//     });
//   }
// };

// // Cerrar sesión de usuario (log out)
// userCtrl.logOut = async (req, res) => {
//   const token = req.body.token;
//   const result = await cache.delRedis(token, true);
//   res.send(result);
// };

// // Personificación de usuario
// userCtrl.impersonate = async (req, res) => {
//   const user = new User(req.params.uuid);
//   user.setUser(res.locals.user);
//   const result = await user.impersonate();
//   res.send(result);
// };

// // Obtener lista de usuarios
// userCtrl.getUsers = async (req, res) => {
//   const user = new User();
//   user.setUser(res.locals.user);
//   const result = await user.list();

//   if (result.error) {
//     res.json({ ok: false, message: "Error en la operación" });
//   } else {
//     res.json(result);
//   }
// };

// // Editar un usuario específico
// userCtrl.editUser = async (req, res) => {
//   const uuid = req.params.uuid;
//   let user = new User(uuid, false);
//   user.setUser(res.locals.user);
//   user.set(req.body);
//   const result = await user.update();

//   if (result.errorInfo && result.errorInfo.code === "ER_DUP_ENTRY") {
//     res.json({ ok: false, message: "Nombre de usuario ya en uso" });
//   } else if (result.error) {
//     res.json({ ok: false, message: "Error en la operación" });
//   } else {
//     res.json(result);
//   }
// };

// // Cambiar la contraseña de un usuario
// userCtrl.changePassword = async (req, res) => {
//   const uuid = req.params.uuid;
//   let user = new User(uuid, false);
//   user.setUser(res.locals.user);
//   user.set(req.body);
//   const result = await user.changePassword(req, res);

//   if (result.error) {
//     res.json({ ok: false, message: "Error en la operación" });
//   } else {
//     res.json(result);
//   }
// };

// // Eliminar un usuario
// userCtrl.deleteUser = async (req, res) => {
//   const uuid = req.params.uuid;
//   let user = new User(uuid, false);
//   user.setUser(res.locals.user);
//   const result = await user.delete();

//   if (result.error) {
//     res.json({ ok: false, message: "Error en la operación" });
//   } else {
//     res.json({ ok: true, message: "Usuario borrado correctamente" });
//   }
// };

// // Obtener un usuario específico (por UUID o nombre)
// userCtrl.getUser = async (req, res) => {
//   const identifier = req.params.uuid;
//   let user = new User();
//   let filter = {};

//   if (uuidValidateV4(identifier)) {
//     user.uuid = identifier;
//   } else {
//     filter.name = identifier;
//   }

//   const result = await user.read(filter);

//   if (result.error) {
//     res.json({ ok: false, message: "Error en la operación" });
//   } else {
//     res.json(result);
//   }
// };

// module.exports = userCtrl;
