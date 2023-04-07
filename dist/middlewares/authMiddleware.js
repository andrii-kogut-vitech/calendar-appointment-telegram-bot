"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    const { user } = req.session;
    if (!user || !user.tokens || !user.tokens.access_token) {
        return res.redirect('/auth/start');
    }
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map