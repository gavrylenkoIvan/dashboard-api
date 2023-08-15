import { Router } from "express";
import { LoggerService } from "../logger/logger.service";
import { IControllerRoute } from "./route.interface";
import { Response } from "express";

export abstract class BaseController {
    private readonly _router: Router;

    constructor(private logger: LoggerService) {
        this._router = Router();
    }

    get router(): Router {
        return this._router;
    }

    public send<T>(res: Response, code: number, message: T) {
        res.type("application/type");
        return res.status(code).json(message);
    }

    public ok<T>(res: Response, message: T) {
        this.send<T>(res, 200, message);
    }

    public created(res: Response) {
        return res.sendStatus(201);
    }

    protected bindRoutes(routes: IControllerRoute[]) {
        for (const route of routes) {
            this.logger.log(`[${route.method}] ${route.path}`);
            const handler = route.func.bind(this);
            this._router[route.method](route.path, handler);
        }
    }
}
