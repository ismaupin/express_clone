
export class HTTPRequest {
    public method: string;
    public url: string;
    public version: string;
    public headers: { [key: string]: string };
    public body: string;
    public params: { [key: string]: string };
    public path: string;
    public pathParts: string[];
    public queryString: string;
    constructor(public data: Buffer<ArrayBufferLike>) {
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

    parse = (data: Buffer<ArrayBufferLike>) => {
        const lines = data.toString().split('/r/n');
        const requestLine = lines[0]
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



    }
}