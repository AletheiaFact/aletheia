export function setPersistence(
    persistence_: {
        bindState: (arg0: string, arg1: WSSharedDoc) => void;
        writeState: (arg0: string, arg1: WSSharedDoc) => Promise<any>;
        provider: any;
    } | null
): void;
export function getPersistence(): null | {
    bindState: (arg0: string, arg1: WSSharedDoc) => void;
    writeState: (arg0: string, arg1: WSSharedDoc) => Promise<any>;
} | null;
export function setupWSConnection(
    conn: any,
    req: any,
    { docName, gc }?: any
): void;
declare class WSSharedDoc {
    /**
     * @param {string} name
     */
    constructor(name: string);
    name: string;
    mux: any;
    /**
     * Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is closed
     * @type {Map<Object, Set<number>>}
     */
    conns: Map<Object, Set<number>>;
    /**
     * @type {awarenessProtocol.Awareness}
     */
    awareness: any;
}
/**
 * @type {Map<string,WSSharedDoc>}
 */
export const docs: Map<string, WSSharedDoc>;
/**
 * Gets a Y.Doc by name, whether in memory or on disk
 *
 * @param {string} docname - the name of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {WSSharedDoc}
 */
export function getYDoc(docname: string, gc?: boolean): WSSharedDoc;
export {};
