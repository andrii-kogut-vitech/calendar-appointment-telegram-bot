import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.session;

    if (!user || !user.tokens || !user.tokens.access_token) {
        return res.redirect('/auth/start');
    }

    next();
};
