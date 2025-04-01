"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPServer = void 0;
const TCPServer_js_1 = require("./TCPServer.js");
const HTTPRequest_js_1 = require("./HTTPRequest.js");
class HTTPServer extends TCPServer_js_1.TCPServer {
    constructor(host, port, requestHandler) {
        super(host, port);
        this.host = host;
        this.port = port;
        this.requestHandler = requestHandler;
        this.handleRequest = (socket, data) => {
            const request = new HTTPRequest_js_1.HTTPRequest(data);
            const res = this.requestHandler(request);
            const response = res.formatResponse();
            socket.write(response);
            socket.end();
        };
        this.requestHandler = requestHandler;
    }
}
exports.HTTPServer = HTTPServer;
;
