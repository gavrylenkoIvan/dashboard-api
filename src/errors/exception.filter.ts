import { NextFunction, Request, Response } from 'express';
import { HTTPError } from './http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IExceptionFilter } from './exception.filter.interface';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(
				`[ExceptionFilter] [${err.context}] Error ${err.statusCode}: ${err.message}`,
			);

			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`[ExceptionFilter] ${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
