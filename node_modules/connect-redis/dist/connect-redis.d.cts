import { RedisClientType } from 'redis';
import { RedisClusterType } from 'redis';
import { SessionData } from 'express-session';
import { Store } from 'express-session';

declare type Callback = (_err?: unknown, _data?: any) => any;

export declare class RedisStore extends Store {
    client: RedisClientType | RedisClusterType;
    prefix: string;
    scanCount: number;
    serializer: Serializer;
    ttl: number | ((sess: SessionData) => number);
    disableTTL: boolean;
    disableTouch: boolean;
    constructor(opts: RedisStoreOptions);
    get(sid: string, cb?: Callback): Promise<any>;
    set(sid: string, sess: SessionData, cb?: Callback): Promise<any>;
    touch(sid: string, sess: SessionData, cb?: Callback): Promise<any>;
    destroy(sid: string, cb?: Callback): Promise<any>;
    clear(cb?: Callback): Promise<any>;
    length(cb?: Callback): Promise<any>;
    ids(cb?: Callback): Promise<any>;
    all(cb?: Callback): Promise<any>;
    private getTTL;
    private getAllKeys;
    private scanIterator;
}

declare interface RedisStoreOptions {
    client: any;
    prefix?: string;
    scanCount?: number;
    serializer?: Serializer;
    ttl?: number | ((sess: SessionData) => number);
    disableTTL?: boolean;
    disableTouch?: boolean;
}

declare interface Serializer {
    parse(s: string): SessionData | Promise<SessionData>;
    stringify(s: SessionData): string;
}

export { }
