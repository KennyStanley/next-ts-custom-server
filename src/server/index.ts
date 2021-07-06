import { createServer, Server } from 'https'
import { URL, parse, UrlWithParsedQuery } from 'url'
import next from 'next'
import fs from 'fs'
import path from 'path'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Global Variables
let webServer: Server

(async () => {
    try {
        await runWebServer()
    } catch (error) {
        console.log(error)
    }
})()

async function runWebServer() {
    const sslCrt = path.join(__dirname, "../../cert/cert.pem"),
        sslKey = path.join(__dirname, "../../cert/key.pem")

    if (!fs.existsSync(sslKey) || !fs.existsSync(sslCrt)) {
        console.error('SSL files are not found. check the README.md for instructions.');
        process.exit(0);
    }
    const tls = {
        cert: fs.readFileSync(sslCrt),
        key: fs.readFileSync(sslKey),
    };

    await new Promise<void>((resolve) => {
        app.prepare().then(() => resolve())
    })

    webServer = createServer(tls, (req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    });

    webServer.on('error', (err: Error) => {
        console.error('starting web server failed:', err.message);
    });

    await new Promise<void>((resolve) => {
        webServer.listen(port, () => {
            console.log(`> Server listening at https://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
                }`);
            resolve();
        });
    });
}