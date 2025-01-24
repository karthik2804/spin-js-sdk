import { AutoRouter as Router } from "itty-router";

let router = Router();

const encoder = new TextEncoder()
router
    .get('/hello/:name', ({ name }) => `Hello, ${name}!`) // Converts to text/plain Response
    .get('/json', () => ({ foo: 'bar' })) // Converts to JSON Response
    .get('/simple', () => new Response('Simple')) // Returns a Response object
    .get('/headers', () => new Response('Custom', {
        status: 201,
        headers: { 'X-Custom': 'Value' }
    }))
    .get('/stream', () => {
        // Create a new ReadableStream
        const { readable, writable } = new TransformStream()
        const writer = writable.getWriter()

        const fn = async () => {
            await writer.write(encoder.encode('Hello, world!\n'))
            await new Promise((res) => setTimeout(res, 1000))
            await writer.write(encoder.encode('bye universe!\n'))
            await new Promise((res) => setTimeout(res, 20))
        }

        fn().finally(async () => {
            await writer.close()
        })

        // Return the stream as a Response
        return new Response(readable, {
            headers: { 'Content-Type': 'text/plain' },
        });
    })
    .post("/echo", (req: Request) => {
        return new Response(req.body, { status: 200, headers: req.headers })
    })
    .get('/throw', () => { throw new Error('Oops') }) // Automatically converts to 500 error response

//@ts-ignore
addEventListener('fetch', async (event: FetchEvent) => {
    event.respondWith(router.fetch(event.request));
});
