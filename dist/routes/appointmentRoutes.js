"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controllers/appointmentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.appointmentRoutes = express_1.default.Router();
exports.appointmentRoutes.get('/availability', authMiddleware_1.authMiddleware, appointmentController_1.appointmentController.getAvailability);
exports.appointmentRoutes.post('/appointments', authMiddleware_1.authMiddleware, appointmentController_1.appointmentController.createAppointment);
//# sourceMappingURL=appointmentRoutes.js.map