export class HTTPResponse {
    public status: number;
    public headers: { [key: string]: string };
    public body: string;
    constructor() {
        this.status = 200;
        this.headers = { ContentType: 'text/html' };
        this.body = '';
    }

    setStatus = (value: number) => {
        this.status = value;
        return this;
    }

    setHeaders = (value: { [key: string]: string }) => {
        this.headers = { ...this.headers, ...value };
        return this;
    }

    send = (data: string) => {
        this.body = data;
        return this;
    }

    public statusCodes: { [key: number]: string } = {
        200: 'OK',
        404: 'Not Found',
        500: 'Internal Server Error'
    }

    public formatResponse: () => string = () => {
        const responseString = `HTTP/1.1 ${this.status} ${this.statusCodes[this.status]}\r\n`;
        const headers = Object.keys(this.headers).map((key) => {
            return `${key}: ${this.headers[key]}`;
        }).join('\r\n');
        return `${responseString}${headers}\r\n\r\n${this.body}`;
    }
}