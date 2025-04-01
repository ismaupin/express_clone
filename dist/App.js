"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const HTTPServer_js_1 = require("./HTTPServer.js");
const HTTPResponse_js_1 = require("./HTTPResponse.js");
const localhost = 'localhost';
class App {
    constructor() {
        this.start = () => {
            this.server.start();
        };
        this.getRequests = {};
        this.postRequests = {};
        this.putRequests = {};
        this.deleteRequests = {};
        this.patchRequests = {};
        this.configureEndpoint = (store, path, callback) => {
            if (!path.startsWith('/')) {
                throw new Error('Path must start with /');
            }
            if (typeof callback !== 'function') {
                throw new Error('Callback must be a function');
            }
            if (path.length === 0) {
                throw new Error('Path cannot be empty');
            }
            if (store[path]) {
                throw new Error(`Path ${path} already exists`);
            }
            const pathParts = path.split('/').filter(part => part.length > 0);
            const paramsMap = pathParts.map((part) => {
                if (part.startsWith(':')) {
                    return part.substring(1);
                }
                return null;
            });
            const pathRegex = new RegExp(`^\/${pathParts.map((p, i) => {
                if (p.startsWith(':')) {
                    return '[a-zA-Z0-9_-]+';
                }
                return `${p}`;
            }).join('\/')}$`, 'g');
            store[path] = {
                callback: callback,
                paramsMap: paramsMap,
                pathRegex: pathRegex,
            };
        };
        this.get = (path, callback) => this.configureEndpoint(this.getRequests, path, callback);
        this.post = (path, callback) => this.configureEndpoint(this.postRequests, path, callback);
        this.put = (path, callback) => this.configureEndpoint(this.putRequests, path, callback);
        this.delete = (path, callback) => this.configureEndpoint(this.deleteRequests, path, callback);
        this.patch = (path, callback) => this.configureEndpoint(this.patchRequests, path, callback);
        this.pathSearch = (path, method) => {
            const searchDirectory = this[`${method}Requests`];
            const possibleMatches = Object.keys(searchDirectory).filter((key) => path.match(searchDirectory[key].pathRegex));
            const closestMatch = possibleMatches.find((match) => match !== null);
            if (closestMatch) {
                return closestMatch;
            }
            return null;
        };
        this.processRequest = (request) => {
            if (!request) {
                console.log('Request not found');
                return new HTTPResponse_js_1.HTTPResponse().setStatus(404).send('Not Found');
            }
            const path = request.path;
            const requestPathParts = request.pathParts;
            const closestMatch = this.pathSearch(path, request.method.toLowerCase());
            if (!closestMatch) {
                console.log(`No handler for path ${path}`);
                return new HTTPResponse_js_1.HTTPResponse().setStatus(404).send('Not Found');
                ;
            }
            const callback = this.getRequests[closestMatch].callback;
            const paramsMap = this.getRequests[closestMatch].paramsMap;
            const params = {};
            paramsMap.forEach((param, index) => {
                if (param) {
                    params[param] = requestPathParts[index];
                }
            });
            request.params = params;
            return callback ? callback(request, new HTTPResponse_js_1.HTTPResponse()) : new HTTPResponse_js_1.HTTPResponse().setStatus(404).send('Not Found');
        };
        this.server = new HTTPServer_js_1.HTTPServer(localhost, 8080, this.processRequest);
    }
}
exports.App = App;
