"use strict";
exports.__esModule = true;
var Server_1 = require("./Server/Server");
var Launcher = /** @class */ (function () {
    function Launcher() {
        this.server = new Server_1.Server(); // server will be initialized here
    }
    Launcher.prototype.launchApp = function () {
        console.log('started app');
        this.server.createServer();
        // (this.server as any).somePrivateLogic() < last resort
    };
    return Launcher;
}());
new Launcher().launchApp();
