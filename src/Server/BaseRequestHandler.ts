import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../Shared/Model";
import { IAccount } from "./Model";

export abstract class BaseRequestHandler {

    protected req: IncomingMessage;
    protected res: ServerResponse;

    public constructor(req: IncomingMessage, res: ServerResponse) {
        this.req = req;
        this.res = res;
    }

    public setRequest(req: IncomingMessage) {
        this.req = req
    }

    public setResponse(res: ServerResponse) {
        this.res = res
    }

    abstract handleRequest(): Promise<void>

    protected async handleNotFound(): Promise<void> {
        this.res.statusCode = HTTP_CODES.NOT_FOUND
        this.res.write('not found')
    }

    protected async getRequestBody(): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = ''
            this.req.on('data', (data: string) => {
                // console.log('DATA callback')
                body += data
            })
            this.req.on('end', () => {
                // console.log('END callback')
                try {
                    resolve(JSON.parse(body))
                } catch (error) {
                    reject(error)
                }
            })
            this.req.on('error', (error: any) => {
                // console.log('ERROR callback')
                reject(error)
            })
        })
    }

    protected respondJsonObject(code: HTTP_CODES, object: any) {
        console.log('HERE')
        this.res.writeHead(code, { 'Content-Type': 'application/json'})
        console.log('HERE 2')
        this.res.write(JSON.stringify(object))
    }

    protected respondBadRequest(message: string) {
        this.res.writeHead(HTTP_CODES.BAD_REQUEST, { 'Content-Type': 'application/json'})
        this.res.write(message)
    }

    protected respondUnauthorized(message: string) {
        this.res.writeHead(HTTP_CODES.UNAUTHORIZED, { 'Content-Type': 'application/json'})
        this.res.write(message)
    }

    protected respondText(httpCode: HTTP_CODES, message: string) {
        this.res.writeHead(httpCode, { 'Content-Type': 'application/json'})
        this.res.write(message)
    }

}