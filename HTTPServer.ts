import { TCPServer } from './TCPServer.js';
import { HTTPRequest } from './HTTPRequest.js';
import { HTTPResponse } from './HTTPResponse.js';
import net from 'node:net';


export class HTTPServer extends TCPServer {
    constructor(public host: string, public port: number, public requestHandler: (request: HTTPRequest) => HTTPResponse) {
        super(host, port);
        this.requestHandler = requestHandler;
    }

    handleRequest = (socket: net.Socket, data: Buffer<ArrayBufferLike>) => {
        const request = new HTTPRequest(data);
        const res = this.requestHandler(request);
        const response = res.formatResponse();
        socket.write(response);
        socket.end();
    }

};