"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPRequest = void 0;
class HTTPRequest {
    constructor(data) {
        this.data = data;
        this.parse = (data) => {
            const lines = data.toString().split('/r/n');
            const requestLine = lines[0];
            const words = requestLine.split(' ');
            this.method = words[0];
            if (words.length > 1) {
                this.url = words[1];
            }
            if (words.length > 2) {
                this.version = words[2];
            }
            // parse url
            const urlParts = this.url.split('?');
            this.path = urlParts[0];
            this.pathParts = this.path.split('/').filter(part => part.length > 0);
            this.queryString = urlParts[1];
            if (this.queryString) {
                const queryParts = this.queryString.split('&');
                queryParts.forEach((part) => {
                    const [key, value] = part.split('=');
                    this.params[key] = value;
                });
            }
        };
        this.method = '';
        this.url = '';
        this.version = '1.1';
        this.headers = {};
        this.body = '';
        this.params = {};
        this.path = '';
        this.pathParts = [];
        this.queryString = '';
        this.parse(data);
    }
}
exports.HTTPRequest = HTTPRequest;
