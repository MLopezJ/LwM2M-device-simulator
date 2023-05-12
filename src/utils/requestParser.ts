
type request =  { code: string; _packet: { confirmable: any; }; payload: string | any[]; method: any; headers: { [x: string]: any; Observe: number; Accept: string; }; url: string; }

/**
 * Parser request
 */

export const requestParser = (req: request): string => {
    const isEmpty = req.code === "0.00" && (Boolean(req._packet.confirmable)) && req.payload.length === 0

    if (isEmpty) return 'empty'

    let optType;
    switch (req.method) {
        case "GET":
          optType = get(req.headers.Observe, req.headers.Accept)
          break;
        case "PUT":
          optType = put(Boolean(req.headers["Content-Format"]))
          break;
        case "POST":
          optType = post(req.url, Boolean(req.headers["Content-Format"]))
          break;
        case "DELETE":
          optType = "delete";
          break;
        default:
          optType = "empty";
          break;
      }

    return optType
}

/**
 * 
 */
const get = (observe: number, accept: string): string => {
    if (observe === 0) return "observe";
    else if (observe === 1) return "cancelObserve";
    else if (accept === "application/link-format")
      return "discover";
    else return "read";
}

/**
 *  
 */
const put = (contentFormat: boolean) =>  contentFormat ? "write" : "writeAttr"

/**
 * 
 */
const post = (url: string, contentFormat: boolean): string => {
    if (url === "/ping") return "ping";
    else if (url === "/bs") return "finish";
    else if (url === "/announce") return "announce";
    else if (contentFormat === true) return "create";
    else return "execute";
}