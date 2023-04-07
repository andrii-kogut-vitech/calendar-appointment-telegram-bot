"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const errorHandler_1 = require("./utils/errorHandler");
const authRoutes_1 = require("./routes/authRoutes");
const appointmentRoutes_1 = require("./routes/appointmentRoutes");
const app = (0, express_1.default)();
// Set up middleware
app.use(express_1.default.json());
// Set up routes
app.use('/auth', authRoutes_1.authRoutes);
app.use('/appointments', appointmentRoutes_1.appointmentRoutes);
// Set up error handling middleware
app.use(errorHandler_1.errorHandler);
// Start the server
app.listen(config_1.config.PORT, () => {
    console.log(`Server started on port ${config_1.config.PORT}`);
});
//# sourceMappingURL=app.js.map