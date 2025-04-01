import { App } from './App.js';
import { HTTPRequest } from './HTTPRequest.js';
import { HTTPResponse } from './HTTPResponse.js';
const app = new App();
app.get('/hello/:name', (request: HTTPRequest, response: HTTPResponse): HTTPResponse => {
    const html = `<h1>Hello ${request.params.name}</h1>`;
    return response.setStatus(200).send(html);
});

app.start();