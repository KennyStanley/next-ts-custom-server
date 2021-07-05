import { createServer } from 'https'
import { parse } from 'url'
import next from 'next'
import fs from 'fs'
import path from 'path'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, "../../cert/cert.pem")),
    key: fs.readFileSync(path.join(__dirname, "../../cert/key.pem"))
}

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url!, true)
        handle(req, res, parsedUrl)
    }).listen(port)

    // tslint:disable-next-line:no-console
    console.log(
        `> Server listening at https://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
        }`
    )
})