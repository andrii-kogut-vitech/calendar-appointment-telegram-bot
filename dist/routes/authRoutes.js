"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
exports.authRoutes = express_1.default.Router();
exports.authRoutes.get('/start', authController_1.authController.startAuthFlow);
exports.authRoutes.get('/complete', authController_1.authController.completeAuthFlow);
exports.authRoutes.get('/logout', authController_1.authController.logout);
//# sourceMappingURL=authRoutes.js.map