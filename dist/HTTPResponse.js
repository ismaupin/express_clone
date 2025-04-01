"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPResponse = void 0;
class HTTPResponse {
    constructor() {
        this.setStatus = (value) => {
            this.status = value;
            return this;
        };
        this.setHeaders = (value) => {
            this.headers = Object.assign(Object.assign({}, this.headers), value);
            return this;
        };
        this.send = (data) => {
            this.body = data;
            return this;
        };
        this.statusCodes = {
            200: 'OK',
            404: 'Not Found',
            500: 'Internal Server Error'
        };
        this.formatResponse = () => {
            const responseString = `HTTP/1.1 ${this.status} ${this.statusCodes[this.status]}\r\n`;
            const headers = Object.keys(this.headers).map((key) => {
                return `${key}: ${this.headers[key]}`;
            }).join('\r\n');
            return `${responseString}${headers}\r\n\r\n${this.body}`;
        };
        this.status = 200;
        this.headers = { ContentType: 'text/html' };
        this.body = '';
    }
}
exports.HTTPResponse = HTTPResponse;
