// from: https://unpkg.com/@servicestack/client/dist/index.d.ts

import 'fetch-everywhere';
export interface IReturnVoid {
    createResponse(): any;
}
export interface IReturn<T> {
    createResponse(): T;
}
export declare class ResponseStatus {
    constructor(init?: Partial<ResponseStatus>);
    errorCode: string;
    message: string;
    stackTrace: string;
    errors: ResponseError[];
    meta: {
        [index: string]: string;
    };
}
export declare class ResponseError {
    constructor(init?: Partial<ResponseError>);
    errorCode: string;
    fieldName: string;
    message: string;
    meta: {
        [index: string]: string;
    };
}
export declare class ErrorResponse {
    constructor(init?: Partial<ErrorResponse>);
    type: ErrorResponseType;
    responseStatus: ResponseStatus;
}
export declare class NavItem {
    label: string;
    href: string;
    exact: boolean;
    id: string;
    className: string;
    iconClass: string;
    show: string;
    hide: string;
    children: NavItem[];
    meta: {
        [index: string]: string;
    };
    constructor(init?: Partial<NavItem>);
}
export declare class GetNavItems {
    constructor(init?: Partial<GetNavItems>);
    createResponse(): GetNavItemsResponse;
    getTypeName(): string;
}
export declare class GetNavItemsResponse {
    baseUrl: string;
    results: NavItem[];
    navItemsMap: {
        [index: string]: NavItem[];
    };
    meta: {
        [index: string]: string;
    };
    responseStatus: ResponseStatus;
    constructor(init?: Partial<GetNavItemsResponse>);
}
export declare type ErrorResponseType = null | "RefreshTokenException";
export interface IAuthSession {
    userName: string;
    displayName: string;
    userId?: string;
    roles?: string[];
    permissions?: string[];
    profileUrl?: string;
}
export interface IResolver {
    tryResolve(Function: any): any;
}
export declare class NewInstanceResolver implements IResolver {
    tryResolve(ctor: ObjectConstructor): any;
}
export declare class SingletonInstanceResolver implements IResolver {
    tryResolve(ctor: ObjectConstructor): any;
}
export interface ServerEventMessage {
    type: "ServerEventConnect" | "ServerEventHeartbeat" | "ServerEventJoin" | "ServerEventLeave" | "ServerEventUpdate" | "ServerEventMessage";
    eventId: number;
    channel: string;
    data: string;
    selector: string;
    json: string;
    op: string;
    target: string;
    cssSelector: string;
    body: any;
    meta: {
        [index: string]: string;
    };
}
export interface ServerEventCommand extends ServerEventMessage {
    userId: string;
    displayName: string;
    channels: string;
    profileUrl: string;
}
export interface ServerEventConnect extends ServerEventCommand {
    id: string;
    unRegisterUrl: string;
    heartbeatUrl: string;
    updateSubscriberUrl: string;
    heartbeatIntervalMs: number;
    idleTimeoutMs: number;
}
export interface ServerEventHeartbeat extends ServerEventCommand {
}
export interface ServerEventJoin extends ServerEventCommand {
}
export interface ServerEventLeave extends ServerEventCommand {
}
export interface ServerEventUpdate extends ServerEventCommand {
}
export interface IReconnectServerEventsOptions {
    url?: string;
    onerror?: (...args: any[]) => void;
    onmessage?: (...args: any[]) => void;
    error?: Error;
}
/**
 * EventSource
 */
export declare enum ReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSED = 2,
}
export interface IEventSourceStatic extends EventTarget {
    new (url: string, eventSourceInitDict?: IEventSourceInit): IEventSourceStatic;
    url: string;
    withCredentials: boolean;
    CONNECTING: ReadyState;
    OPEN: ReadyState;
    CLOSED: ReadyState;
    readyState: ReadyState;
    onopen: Function;
    onmessage: (event: IOnMessageEvent) => void;
    onerror: Function;
    close: () => void;
}
export interface IEventSourceInit {
    withCredentials?: boolean;
}
export interface IOnMessageEvent {
    data: string;
}
export interface IEventSourceOptions {
    channels?: string;
    handlers?: any;
    receivers?: any;
    onException?: Function;
    onReconnect?: Function;
    onTick?: Function;
    resolver?: IResolver;
    validate?: (request: ServerEventMessage) => boolean;
    heartbeatUrl?: string;
    unRegisterUrl?: string;
    updateSubscriberUrl?: string;
    heartbeatIntervalMs?: number;
    heartbeat?: number;
    resolveStreamUrl?: (url: string) => string;
}
export declare class ServerEventsClient {
    channels: string[];
    options: IEventSourceOptions;
    eventSource: IEventSourceStatic;
    static UnknownChannel: string;
    eventStreamUri: string;
    updateSubscriberUrl: string;
    connectionInfo: ServerEventConnect;
    serviceClient: JsonServiceClient;
    stopped: boolean;
    resolver: IResolver;
    listeners: {
        [index: string]: ((e: ServerEventMessage) => void)[];
    };
    EventSource: IEventSourceStatic;
    withCredentials: boolean;
    constructor(baseUrl: string, channels: string[], options?: IEventSourceOptions, eventSource?: IEventSourceStatic);
    onMessage: (e: IOnMessageEvent) => void;
    onError: (error?: any) => void;
    getEventSourceOptions(): {
        withCredentials: boolean;
    };
    reconnectServerEvents(opt?: IReconnectServerEventsOptions): IEventSourceStatic;
    start(): this;
    stop(): Promise<void>;
    invokeReceiver(r: any, cmd: string, el: Element, request: ServerEventMessage, name: string): void;
    hasConnected(): boolean;
    registerHandler(name: string, fn: Function): this;
    setResolver(resolver: IResolver): this;
    registerReceiver(receiver: any): this;
    registerNamedReceiver(name: string, receiver: any): this;
    unregisterReceiver(name?: string): this;
    updateChannels(channels: string[]): void;
    update(subscribe: string | string[], unsubscribe: string | string[]): void;
    addListener(eventName: string, handler: ((e: ServerEventMessage) => void)): this;
    removeListener(eventName: string, handler: ((e: ServerEventMessage) => void)): this;
    raiseEvent(eventName: string, msg: ServerEventMessage): void;
    getConnectionInfo(): ServerEventConnect;
    getSubscriptionId(): string;
    updateSubscriber(request: UpdateEventSubscriber): Promise<void>;
    subscribeToChannels(...channels: string[]): Promise<void>;
    unsubscribeFromChannels(...channels: string[]): Promise<void>;
    getChannelSubscribers(): Promise<ServerEventUser[]>;
    toServerEventUser(map: {
        [id: string]: string;
    }): ServerEventUser;
}
export interface IReceiver {
    noSuchMethod(selector: string, message: any): any;
}
export declare class ServerEventReceiver implements IReceiver {
    client: ServerEventsClient;
    request: ServerEventMessage;
    noSuchMethod(selector: string, message: any): void;
}
export declare class UpdateEventSubscriber implements IReturn<UpdateEventSubscriberResponse> {
    id: string;
    subscribeChannels: string[];
    unsubscribeChannels: string[];
    createResponse(): UpdateEventSubscriberResponse;
    getTypeName(): string;
}
export declare class UpdateEventSubscriberResponse {
    responseStatus: ResponseStatus;
}
export declare class GetEventSubscribers implements IReturn<any[]> {
    channels: string[];
    createResponse(): any[];
    getTypeName(): string;
}
export declare class ServerEventUser {
    userId: string;
    displayName: string;
    profileUrl: string;
    channels: string[];
    meta: {
        [index: string]: string;
    };
}
export declare class HttpMethods {
    static Get: string;
    static Post: string;
    static Put: string;
    static Delete: string;
    static Patch: string;
    static Head: string;
    static Options: string;
    static hasRequestBody: (method: string) => boolean;
}
export interface IRequestFilterOptions {
    url: string;
}
export interface IRequestInit extends RequestInit {
    url?: string;
    compress?: boolean;
}
export interface Cookie {
    name: string;
    value: string;
    path: string;
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: string;
}
export declare class GetAccessTokenResponse {
    accessToken: string;
    responseStatus: ResponseStatus;
}
export interface ISendRequest {
    method: string;
    request: any | null;
    body?: any | null;
    args?: any;
    url?: string;
    returns?: {
        createResponse: () => any;
    };
}
export declare class JsonServiceClient {
    baseUrl: string;
    replyBaseUrl: string;
    oneWayBaseUrl: string;
    mode: RequestMode;
    credentials: RequestCredentials;
    headers: Headers;
    userName: string;
    password: string;
    bearerToken: string;
    refreshToken: string;
    refreshTokenUri: string;
    useTokenCookie: boolean;
    requestFilter: (req: IRequestInit) => void;
    responseFilter: (res: Response) => void;
    exceptionFilter: (res: Response, error: any) => void;
    urlFilter: (url: string) => void;
    onAuthenticationRequired: () => Promise<any>;
    manageCookies: boolean;
    cookies: {
        [index: string]: Cookie;
    };
    parseJson: (res: Response) => Promise<any>;
    static toBase64: (rawString: string) => string;
    constructor(baseUrl?: string);
    setCredentials(userName: string, password: string): void;
    setBearerToken(token: string): void;
    get<T>(request: IReturn<T> | string, args?: any): Promise<T>;
    delete<T>(request: IReturn<T> | string, args?: any): Promise<T>;
    post<T>(request: IReturn<T>, args?: any): Promise<T>;
    postToUrl<T>(url: string, request: IReturn<T>, args?: any): Promise<T>;
    postBody<T>(request: IReturn<T>, body: string | any, args?: any): Promise<T>;
    put<T>(request: IReturn<T>, args?: any): Promise<T>;
    putToUrl<T>(url: string, request: IReturn<T>, args?: any): Promise<T>;
    putBody<T>(request: IReturn<T>, body: string | any, args?: any): Promise<T>;
    patch<T>(request: IReturn<T>, args?: any): Promise<T>;
    patchToUrl<T>(url: string, request: IReturn<T>, args?: any): Promise<T>;
    patchBody<T>(request: IReturn<T>, body: string | any, args?: any): Promise<T>;
    publish(request: IReturnVoid, args?: any): Promise<any>;
    sendOneWay<T>(request: IReturn<T> | IReturnVoid, args?: any): Promise<T>;
    sendAll<T>(requests: IReturn<T>[]): Promise<T[]>;
    sendAllOneWay<T>(requests: IReturn<T>[]): Promise<void>;
    createUrlFromDto<T>(method: string, request: IReturn<T>): string;
    toAbsoluteUrl(relativeOrAbsoluteUrl: string): string;
    deleteCookie(name: string): void;
    private createRequest({method, request, url, args, body});
    private json(res);
    private createResponse<T>(res, request);
    private handleError(holdRes, res, type?);
    send<T>(method: string, request: any | null, args?: any, url?: string): Promise<T>;
    private sendBody<T>(method, request, body, args?);
    sendRequest<T>(info: ISendRequest): Promise<T>;
    raiseError(res: Response, error: any): any;
}
export declare const isFormData: (body: any) => boolean;
export declare const toCamelCase: (s: string) => string;
export declare const toPascalCase: (s: string) => string;
export declare const sanitize: (status: any) => any;
export declare const nameOf: (o: any) => any;
export declare const css: (selector: string | NodeListOf<Element>, name: string, value: string) => void;
export declare const splitOnFirst: (s: string, c: string) => string[];
export declare const splitOnLast: (s: string, c: string) => string[];
export declare const humanize: (s: any) => any;
export declare const queryString: (url: string) => any;
export declare const combinePaths: (...paths: string[]) => string;
export declare const createPath: (route: string, args: any) => string;
export declare const createUrl: (route: string, args: any) => string;
export declare const appendQueryString: (url: string, args: any) => string;
export declare const bytesToBase64: (aBytes: Uint8Array) => string;
export declare const stripQuotes: (s: string) => string;
export declare const tryDecode: (s: string) => string;
export declare const parseCookie: (setCookie: string) => Cookie;
export declare const normalizeKey: (key: string) => string;
export declare const normalize: (dto: any, deep?: boolean) => any;
export declare const getField: (o: any, name: string) => any;
export declare const parseResponseStatus: (json: string, defaultMsg?: any) => any;
export declare function toFormData(o: any): FormData;
export declare function toObject(keys: any): {};
export declare function errorResponseSummary(): any;
export declare function errorResponseExcept(fieldNames: string[] | string): any;
export declare function errorResponse(fieldName: string): any;
export declare const toDate: (s: any) => Date;
export declare const toDateFmt: (s: string) => string;
export declare const padInt: (n: number) => string | number;
export declare const dateFmt: (d?: Date) => string;
export declare const dateFmtHM: (d?: Date) => string;
export declare const timeFmt12: (d?: Date) => string;
export declare const toLocalISOString: (d?: Date) => string;
export interface ICreateElementOptions {
    insertAfter?: Element | null;
}
export declare function createElement(tagName: string, options?: ICreateElementOptions, attrs?: any): HTMLElement;
export declare function bootstrap(el?: Element): void;
export interface IBindHandlersOptions {
    events: string[];
}
export declare function bindHandlers(handlers: any, el?: Document | Element, opt?: IBindHandlersOptions): void;
export interface IAjaxFormOptions {
    type?: string;
    url?: string;
    model?: any;
    credentials?: RequestCredentials;
    validate?: (this: HTMLFormElement) => boolean;
    onSubmitDisable?: string;
    submit?: (this: HTMLFormElement, options: IAjaxFormOptions) => Promise<any>;
    success?: (this: HTMLFormElement, result: any) => void;
    error?: (this: HTMLFormElement, e: any) => void;
    complete?: (this: HTMLFormElement) => void;
    requestFilter?: (req: IRequestInit) => void;
    responseFilter?: (res: Response) => void;
    errorFilter?: (this: IValidation, message: string, errorCode: string, type: string) => void;
    messages?: {
        [index: string]: string;
    };
}
export declare function bootstrapForm(form: HTMLFormElement | null, options: IAjaxFormOptions): void;
export interface IValidation {
    overrideMessages: boolean;
    messages: {
        [index: string]: string;
    };
    errorFilter?: (this: IValidation, message: string, errorCode: string, type: string) => void;
}
export declare const toVarNames: (names: string | string[]) => string[];
export declare function formSubmit(this: HTMLFormElement, options?: IAjaxFormOptions): Promise<any>;
export declare function ajaxSubmit(f: HTMLFormElement, options?: IAjaxFormOptions): any;
export declare function serializeForm(form: HTMLFormElement, contentType?: string | null): string | FormData;
export declare const serializeToObject: (form: HTMLFormElement) => any;
export declare function serializeToUrlEncoded(form: HTMLFormElement): string;
export declare const serializeToFormData: (form: HTMLFormElement) => FormData;
export declare function triggerEvent(el: Element, name: string, data?: any): void;
export declare function populateForm(form: HTMLFormElement, model: any): void;
export declare function trimEnd(s: string, c: string): string;
export declare function safeVarName(s: string): string;
export declare function pick(o: any, keys: string[]): {};
export declare function omit(o: any, keys: string[]): {};
export declare function activeClassNav(x: NavItem, activePath: string): string;
export declare function activeClass(href: string | null, activePath: string, exact?: boolean): string;
export declare const BootstrapColors: string[];
export declare function btnColorClass(props: any): string;
export declare const BootstrapSizes: string[];
export declare function btnSizeClass(props: any): string;
export declare function btnClasses(props: any): any[];
export declare class NavDefaults {
    static navClass: string;
    static navItemClass: string;
    static navLinkClass: string;
    static childNavItemClass: string;
    static childNavLinkClass: string;
    static childNavMenuClass: string;
    static childNavMenuItemClass: string;
    static create(): NavOptions;
    static forNav(options?: NavOptions | null): NavOptions;
    static overrideDefaults(targets: NavOptions | null | undefined, source: NavOptions): NavOptions;
    static showNav(navItem: NavItem, attributes: string[]): boolean;
}
export declare class NavLinkDefaults {
    static forNavLink(options?: NavOptions | null): NavOptions;
}
export declare class NavbarDefaults {
    static navClass: string;
    static create(): NavOptions;
    static forNavbar(options?: NavOptions | null): NavOptions;
}
export declare class NavButtonGroupDefaults {
    static navClass: string;
    static navItemClass: string;
    static create(): NavOptions;
    static forNavButtonGroup(options?: NavOptions | null): NavOptions;
}
export declare class LinkButtonDefaults {
    static navItemClass: string;
    static create(): NavOptions;
    static forLinkButton(options?: NavOptions | null): NavOptions;
}
export declare class UserAttributes {
    static fromSession(session: IAuthSession | null): string[];
}
export declare class NavOptions {
    static fromSession(session: IAuthSession | null, to?: NavOptions): NavOptions;
    attributes: string[];
    activePath?: string;
    baseHref?: string;
    navClass?: string;
    navItemClass?: string;
    navLinkClass?: string;
    childNavItemClass?: string;
    childNavLinkClass?: string;
    childNavMenuClass?: string;
    childNavMenuItemClass?: string;
    constructor(init?: Partial<NavOptions>);
}
export declare function classNames(...args: any[]): string;
export declare function fromXsdDuration(xsd: string): number;
export declare function toXsdDuration(time: number): string;
export declare function toTimeSpanFmt(time: number): string;
