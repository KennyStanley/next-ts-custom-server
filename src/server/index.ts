import { createServer as createHttpsServer, Server as HttpsServer } from 'https'
import { createServer, Server } from 'http'
import { parse } from 'url'
import next from 'next'
import fs from 'fs'
import path from 'path'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Global Variables
let webServer: Server | HttpsServer

    // Initialization
;(async () => {
    try {
        await runWebServer()
    } catch (error) {
        console.log(error)
    }
})()

async function runWebServer() {
    const sslCrt = path.join(__dirname, '../../cert/cert.pem'),
        sslKey = path.join(__dirname, '../../cert/key.pem')

    const sslCertExist = fs.existsSync(sslKey) && fs.existsSync(sslCrt)

    if (sslCertExist) {
        const tls = {
            cert: fs.readFileSync(sslCrt),
            key: fs.readFileSync(sslKey),
        }

        await app.prepare().then(() => {
            webServer = createHttpsServer(tls, (req, res) => {
                const parsedUrl = parse(req.url!, true)
                handle(req, res, parsedUrl)
            })
        })
    } else {
        console.error('SSL files are not found. Using HTTP instead of HTTPS.')

        await app.prepare().then(() => {
            webServer = createServer((req, res) => {
                const parsedUrl = parse(req.url!, true)
                handle(req, res, parsedUrl)
            })
        })
    }

    webServer.on('error', (err: Error) => {
        console.error('starting web server failed:', err.message)
    })

    await new Promise<void>(resolve => {
        webServer.listen(port, () => {
            console.log(
                `> Server listening at http${
                    sslCertExist ? 's' : ''
                }://localhost:${port} as ${
                    dev ? 'development' : process.env.NODE_ENV
                }`
            )
            resolve()
        })
    })
}
