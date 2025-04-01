import { HTTPServer } from './HTTPServer.js';
import { HTTPResponse } from './HTTPResponse.js';
import { HTTPRequest } from './HTTPRequest.js';
const localhost = 'localhost';

interface Endpoint {
    callback: Function;
    paramsMap: (string | null)[];
    pathRegex: RegExp;
}

type EndpointStore = {
    [key: string]: Endpoint;
}

type RestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

type RestCallBack = (request: HTTPRequest, response: HTTPResponse) => HTTPResponse;

type RequestConfigFunction = (path: string, callback: RestCallBack) => void;

export class App {

    start = () => {
        this.server.start();
    }

    getRequests: EndpointStore = {}
    postRequests: EndpointStore = {}
    putRequests: EndpointStore = {}
    deleteRequests: EndpointStore = {}
    patchRequests: EndpointStore = {}

    configureEndpoint = (store: EndpointStore, path: string, callback: RestCallBack): void => {
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
        }
        )

        const pathRegex = new RegExp(`^\/${pathParts.map(p => {
            if (p.startsWith(':')) {
                return '[a-zA-Z0-9_-]+';
            }
            return `${p}`;
        }).join('\/')}$`, 'g');


        store[path] = {
            callback: callback,
            paramsMap: paramsMap,
            pathRegex: pathRegex,
        }

    }



    get: RequestConfigFunction = (path, callback) => this.configureEndpoint(this.getRequests, path, callback);
    post: RequestConfigFunction = (path, callback) => this.configureEndpoint(this.postRequests, path, callback);
    put: RequestConfigFunction = (path, callback) => this.configureEndpoint(this.putRequests, path, callback);
    delete: RequestConfigFunction = (path, callback) => this.configureEndpoint(this.deleteRequests, path, callback);
    patch: RequestConfigFunction = (path, callback) => this.configureEndpoint(this.patchRequests, path, callback);

    pathSearch = (path: string, method: RestMethod): (string | null) => {
        const searchDirectory: EndpointStore = this[`${method}Requests`];
        const possibleMatches = Object.keys(searchDirectory).filter((key) => path.match(searchDirectory[key].pathRegex));
        const closestMatch = possibleMatches.find((match) => match !== null);
        if (closestMatch) {
            return closestMatch
        }
        return null;
    }

    processRequest = (request: HTTPRequest): HTTPResponse => {
        if (!request) {
            console.log('Request not found');
            return new HTTPResponse().setStatus(404).send('Not Found');
        }
        const path = request.path;
        const requestPathParts = request.pathParts;
        const closestMatch = this.pathSearch(path, request.method.toLowerCase() as RestMethod);
        if (!closestMatch) {
            console.log(`No handler for path ${path}`);
            return new HTTPResponse().setStatus(404).send('Not Found');;
        }
        const callback = this.getRequests[closestMatch].callback;
        const paramsMap = this.getRequests[closestMatch].paramsMap;
        const params: { [key: string]: string } = {};
        paramsMap.forEach((param, index) => {
            if (param) {
                params[param] = requestPathParts[index];
            }
        });
        request.params = params;

        return callback ? callback(request, new HTTPResponse()) : new HTTPResponse().setStatus(404).send('Not Found');

    }


    server = new HTTPServer(localhost, 8080, this.processRequest);
}