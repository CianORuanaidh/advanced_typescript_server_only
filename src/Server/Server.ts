import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../Authorization/Authorizer';
import { Monitor } from '../Shared/ObjectsCounter';
import { LoginHandler } from './LoginHandler';
import { UserHandler } from './UsersHandler';
import { Utils } from './Utils'
export class Server {

    private somePrivateLogic() {
        console.log('Doing private logic')
    }

    private authorizer: Authorizer = new Authorizer()
    private loginHandler: LoginHandler = new LoginHandler(this.authorizer)
    private usersHandler: UserHandler = new UserHandler(this.authorizer)

    public createServer(){
        createServer(
            async (req: IncomingMessage, res: ServerResponse) => {
                this.addCorsHeader(res)

                const basePath = Utils.getUrlBasePath(req.url)
                console.log('\n\nWe have a REQUST from ' + basePath + '\n\n')
                
                switch(basePath) {
                    case 'systemInfo':
                        res.write(Monitor.printInstances())
                        break;
                    case 'login':
                        // await new LoginHandler(req, res, this.authorizer).handleRequest()
                        this.loginHandler.setRequest(req)
                        this.loginHandler.setResponse(res)
                        await this.loginHandler.handleRequest()
                        break;

                    case 'users':
                        // await new UserHandler(req, res, this.authorizer).handleRequest()
                        this.usersHandler.setRequest(req)
                        this.usersHandler.setResponse(res)
                        await this.usersHandler.handleRequest()
                        break;

                    default:
                        break;
                }
                
                res.end()
            }
        ).listen(8080)
        console.log('Server started')
        console.log('running on http://localhost:/' + 8080 + '')
    }

    private addCorsHeader(res: ServerResponse) {
        res.setHeader('Access-Control-Allow-Origin',  '*') // * our serve is accessible from any server
        res.setHeader('Access-Control-Allow-Headers',  '*') // * our serve is accessible from any server
        res.setHeader('Access-Control-Allow-Methods',  '*') // * our serve is accessible from any server
    }
}
