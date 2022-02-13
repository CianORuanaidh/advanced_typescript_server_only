import { Server } from './Server/Server'

class Launcher {
    // instance variables
    private server: Server;

    constructor() {
        this.server = new Server(); // server will be initialized here
    }

    public launchApp() {
        console.log('started app')
        this.server.createServer()
        // (this.server as any).somePrivateLogic() < last resort
    }
}

new Launcher().launchApp()