"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCPServer = void 0;
const node_net_1 = __importDefault(require("node:net"));
const localhost = 'localhost';
class TCPServer {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.start = () => {
            const server = node_net_1.default.createServer((socket) => {
                console.log('client connected');
                socket.on('data', (data) => this.handleRequest(socket, data));
                socket.on('end', () => this.handleClose());
            });
            server.on('error', (err) => this.handleError(err));
            server.listen({ port: this.port, host: this.host }, () => {
                console.log(`Server listening on ${this.host}:${this.port}`);
            });
        };
        this.handleRequest = (socket, data) => {
            console.log(`Received data: ${data}`);
            socket.write(`${data} \r\n`, (err => {
                if (err) {
                    console.error('Error sending data:', err);
                }
                socket.end();
            }));
        };
        this.handleError = (err) => {
            console.error('Error:', err);
        };
        this.handleClose = () => {
            console.log('Socket closed');
        };
        this.host = host;
        this.port = port;
    }
    ;
}
exports.TCPServer = TCPServer;
;
