"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_js_1 = require("./App.js");
const app = new App_js_1.App();
app.get('/hello/:name', (request, response) => {
    const html = `<h1>Hello ${request.params.name}</h1>`;
    return response.setStatus(200).send(html);
});
app.start();
