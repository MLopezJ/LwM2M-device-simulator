export const serverReqParser = (req: { code: string; _packet: { confirmable: unknown; }; payload: string | unknown[]; method: unknown; headers: { [x: string]: unknown; Observe: number; Accept: string; }; url: string; }): string => {
    let optType;

    if (req.code === '0.00' && req._packet.confirmable && req.payload.length === 0) {
        optType = 'empty';
    } else {
        switch (req.method) {
            case 'GET':
                if (req.headers.Observe === 0)
                    optType = 'observe';
                else if (req.headers.Observe === 1)
                    optType = 'cancelObserve';
                else if (req.headers.Accept === 'application/link-format')
                    optType = 'discover';
                else
                    optType = 'read';
                break;
            case 'PUT':
                if (req.headers['Content-Format'])
                    optType = 'write';
                else
                    optType = 'writeAttr';
                break;
            case 'POST':
                if (req.url === '/ping')
                    optType = 'ping';
                else if (req.url === '/bs')
                      optType = 'finish';
                else if (req.url === '/announce')
                    optType = 'announce';
                else if (req.headers['Content-Format'])
                    optType = 'create';
                else
                    optType = 'execute';
                break;
            case 'DELETE':
                optType = 'delete';
                break;
            default:
                optType = 'empty';
                break;
        }
    }

    return optType;
}