import { IncomingMessage, ServerResponse } from "http";
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from "../Shared/Model";
import { countInstances } from "../Shared/ObjectsCounter";
import { UsersDBAccess } from "../User/UsersDBAccess";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { Handler, TokenValidator } from "./Model";
import { Utils } from "./Utils";

@countInstances
export class UserHandler extends BaseRequestHandler {

    private usersDBAccess: UsersDBAccess = new UsersDBAccess()
    private tokenValidator: TokenValidator

    public constructor(tokenValidator: TokenValidator, req?: IncomingMessage, res?: ServerResponse) {
        // super(req, res)
        super ({} as any, {} as any);

        this.tokenValidator = tokenValidator
    }
    
    async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.OPTIONS:
                console.log('HANDLE OPTIONS')
                this.res.writeHead(HTTP_CODES.OK)
                break;
            case HTTP_METHODS.GET:
                console.log('HANDLE GET')
                await this.handleGet()
                break;
            case HTTP_METHODS.PUT:
                await this.handlePut()
                break;    
            case HTTP_METHODS.DELETE:
                await this.handleDelete()
                break;
            default:
                await this.handleNotFound()
        }
    }

    // THIS IS NOW INSTANTIATED IN THE BaseRequestHandler CLASS
    // private async handleNotFound(): Promise<void> {
    //     this.res.statusCode = HTTP_CODES.NOT_FOUND
    //     this.res.write('not found')
    // }
    
    private async handleDelete(): Promise<void> {
        const authorizationAuthorized = await this.operationAuthorized(AccessRight.READ)
        if (authorizationAuthorized) { 
            const parsedUrl = Utils.getUrlParameters(this.req.url)
            if (parsedUrl){
                if (parsedUrl.query.id) {
                    const deleteResult = await this.usersDBAccess.deleteUser(parsedUrl.query.id as string)
                    if (deleteResult) {
                        this.respondText(HTTP_CODES.OK, `User with id: ${parsedUrl.query.id} deleted`)
                    } else {
                        this.respondText(HTTP_CODES.NOT_FOUND, `User with id: ${parsedUrl.query.id} not found`)
                    } 
                } else {
                    this.respondBadRequest('request is missing userId')
                }
            }
        } else {
            this.respondUnauthorized('missing or invalid authentication')
        }
    }

    private async handlePut(): Promise<void> {
        const authorizationAuthorized = await this.operationAuthorized(AccessRight.READ)
        if (authorizationAuthorized) { 
            try {
                const user: User = await this.getRequestBody(); // We are assuming the body is corret JSON shape
                await this.usersDBAccess.putUser(user);
                this.respondText(HTTP_CODES.CREATED, `user ${user.name} created`)
            } catch (err: any) {
                this.respondBadRequest((err as Error).message)
            }
        } else {
            this.respondUnauthorized('missing or invalid authentication')
        }
    }

    private async handleGet(): Promise<void> {
        const authorizationAuthorized = await this.operationAuthorized(AccessRight.READ)
        if (authorizationAuthorized) {
            console.log('IN IF')
            const parsedUrl = Utils.getUrlParameters(this.req.url)
            if (parsedUrl){
                console.log('parsed url')
                if (parsedUrl.query.id) {
                    console.log('find user: ', parsedUrl)
                    const user = await this.usersDBAccess.getUserById(parsedUrl.query.id as string)
                    console.log('have user')
                    console.log(user)
                    if (user) {
                        this.respondJsonObject(HTTP_CODES.OK, user)
                    } else {
                        this.handleNotFound()  
                    }
                } else if (parsedUrl.query.name) {
                    console.log('FIND WITH NAME')
                    // const dummyObj = [{"id":"33333","name":"cian","age":99,"email":"cian@email.com","workingPosition":1,"_id":"hB6heomAL2u7CcRN"}]
                    // this.respondJsonObject(HTTP_CODES.OK, dummyObj)
                    const users = await this.usersDBAccess.getUsersByName(parsedUrl.query.name as string)
                    console.log('USERS: ', users)
                    this.respondJsonObject(HTTP_CODES.OK, users)                
                    return
                } else {
                    this.respondBadRequest('userId or name not preset in request')              
                }
            } 
            
        } else {
            this.respondUnauthorized('missing or invalid authentication')
        }
    }

    private async operationAuthorized(operation: AccessRight): Promise<boolean> {
        const tokenId = this.req.headers.authorization
        if (tokenId) {
            const tokenRights = await this.tokenValidator.validateToken(tokenId)
            if (tokenRights.accessRights.includes(operation)) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    
}
