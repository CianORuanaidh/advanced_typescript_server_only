import { throws } from 'assert/strict';
import { IncomingMessage, ServerResponse } from 'http'
import { HTTP_CODES, HTTP_METHODS } from '../Shared/Model';
import { countInstances } from '../Shared/ObjectsCounter';
import { BaseRequestHandler } from './BaseRequestHandler';
import { IAccount, TokenGenerator } from './Model';

@countInstances
export class LoginHandler extends BaseRequestHandler {

    private tokenGeneator: TokenGenerator

    public constructor(tokenGeneator: TokenGenerator, req?: IncomingMessage, res?: ServerResponse) {
        // super (req, res);
        super ({} as any, {} as any);
        this.tokenGeneator = tokenGeneator
    }

    public async handleRequest(): Promise<void> {
        switch(this.req.method) {
            case HTTP_METHODS.POST:
                console.log('HANDLE POST')
                await this.handlePost()        
                break;
            case HTTP_METHODS.OPTIONS:
                console.log('HANDLE OPTIONS')
                this.res.writeHead(HTTP_CODES.OK)
                break;
            default:
                await this.handleNotFound()
                break;
        }

    }

    // THIS IS NOW INSTANTIATED IN THE BaseRequestHandler CLASS
    // private async handleNotFound(): Promise<void> {
    //     this.res.statusCode = HTTP_CODES.NOT_FOUND
    //     this.res.write('not found')
    // }

    private async handlePost(): Promise<void> {
        try {
            const body: IAccount = await this.getRequestBody()
            const sessionToken = await this.tokenGeneator.generateToken(body)
            if (sessionToken) {
                this.res.statusCode = HTTP_CODES.CREATED
                this.res.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json'})
                this.res.write(JSON.stringify(sessionToken))
            } else {
                this.res.statusCode = HTTP_CODES.NOT_FOUND
                this.res.write('wrong username or password')
            }
        } catch (error) {
            const myError = error as Error
            this.res.write('error ERROR: ' + myError.message)
        }
        return
    }

    // private async getRequestBody(): Promise<IAccount> {
    //     return new Promise((resolve, reject) => {
    //         let body = ''
    //         this.req.on('data', (data: string) => {
    //             // console.log('DATA callback')
    //             body += data
    //         })
    //         this.req.on('end', () => {
    //             // console.log('END callback')
    //             try {
    //                 resolve(JSON.parse(body))
    //             } catch (error) {
    //                 reject(error)
    //             }
    //         })
    //         this.req.on('error', (error: any) => {
    //             // console.log('ERROR callback')
    //             reject(error)
    //         })
    //     })
    // }
}