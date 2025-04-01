import net from 'node:net';

const localhost = 'localhost';

export class TCPServer {
    constructor(public host: string, public port: number) {
        this.host = host;
        this.port = port;
    };

    start = () => {

        const server = net.createServer(
            (socket) => {
                console.log('client connected');
                socket.on('data', (data) => this.handleRequest(socket, data));
                socket.on('end', () => this.handleClose());
            }
        );

        server.on('error', (err) => this.handleError(err));

        server.listen({ port: this.port, host: this.host }, () => {
            console.log(`Server listening on ${this.host}:${this.port}`);
        });
    }

    handleRequest = (socket: net.Socket, data: Buffer<ArrayBufferLike>) => {
        console.log(`Received data: ${data}`);
        socket.write(`${data} \r\n`, (err => {
            if (err) {
                console.error('Error sending data:', err);
            }
            socket.end();
        }));
    }

    handleError = (err: Error) => {
        console.error('Error:', err);
    }
    handleClose = () => {
        console.log('Socket closed');
    }
};

