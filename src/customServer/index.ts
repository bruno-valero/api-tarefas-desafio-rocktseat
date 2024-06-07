import http from 'node:http'

export type Req = http.IncomingMessage & {
  body?: string
  params?: Record<string, string>
  searchParams?: Record<string, string>
}
export type Res = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage
}

interface RouteProps {
  path: string
  controller: (req: Req, res: Res) => Promise<any>
  method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE'
  middleWares: ((
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage
    },
  ) => Promise<any>)[]
}

export class Server {
  globalMiddleWares: ((req: Req, res: Res) => Promise<any>)[] = []
  serverReadyResolve: ((value: unknown) => void) | null = null
  setServerSettingUpForce: boolean = false

  constructor(
    public _req?: Req,
    public _res?: Res,
  ) {}

  get req() {
    return this._req as Req
  }

  get res() {
    return this._res as Res
  }

  setReq(req: Req) {
    this._req = req
  }

  setRes(res: Res) {
    this._res = res
  }

  isReady() {
    return !!this._req && !!this._res
  }

  setServerSettingUp() {
    if (!this.serverReadyResolve) {
      this.setServerSettingUpForce = true
      return
    }
    this.serverReadyResolve('ready')
  }

  async isServerReady() {
    const zero = 0
    const ready = new Promise((resolve, reject) => {
      if (this.setServerSettingUpForce) {
        resolve('ready by force')
        return
      }
      this.serverReadyResolve = resolve
      if (zero > 1) {
        reject(new Error(''))
      }
    })

    const data = await ready
    return data
  }

  addGlobalMiddleWare(middleWare: (req: Req, res: Res) => Promise<any>) {
    this.globalMiddleWares.push(middleWare)
  }

  protected pathRegExp(path: string) {
    const paramsRegex = this.routeParamsRegex(path.split('?')[0])
    return paramsRegex
  }

  protected methodRegExp(method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE') {
    const methodRegExp = new RegExp(method, 'ig')
    return methodRegExp
  }

  protected async handleRequest(
    path: RouteProps['path'],
    controller: RouteProps['controller'],
    method: RouteProps['method'],
    middleWares: RouteProps['middleWares'],
  ) {
    const methodRegExp = this.methodRegExp(method)
    const pathRegExp = this.pathRegExp(path)

    const isTheRightMethod = methodRegExp.test(this.req.method ?? '')
    const isTheRightUrl = pathRegExp.test(this.req.url ?? '')

    const isTheCorrectRoute = isTheRightMethod && isTheRightUrl

    if (isTheCorrectRoute) {
      this.handleRouteParams(path)
      this.handleRouteSearchParams()
      await Promise.all(
        middleWares.map(
          async (middleWare) => await middleWare(this.req, this.res),
        ),
      )

      await controller(this.req, this.res)
    }
  }

  post(
    path: RouteProps['path'],
    controller: RouteProps['controller'],
    middleWares?: RouteProps['middleWares'],
  ) {
    this.handleRequest(path, controller, 'POST', [
      ...this.globalMiddleWares,
      ...(middleWares ?? []),
    ])
  }

  get(
    path: RouteProps['path'],
    controller: RouteProps['controller'],
    middleWares?: RouteProps['middleWares'],
  ) {
    this.handleRequest(path, controller, 'GET', [
      ...this.globalMiddleWares,
      ...(middleWares ?? []),
    ])
  }

  put(
    path: RouteProps['path'],
    controller: RouteProps['controller'],
    middleWares?: RouteProps['middleWares'],
  ) {
    this.handleRequest(path, controller, 'PUT', [
      ...this.globalMiddleWares,
      ...(middleWares ?? []),
    ])
  }

  patch(
    path: RouteProps['path'],
    controller: RouteProps['controller'],
    middleWares?: RouteProps['middleWares'],
  ) {
    this.handleRequest(path, controller, 'PATCH', [
      ...this.globalMiddleWares,
      ...(middleWares ?? []),
    ])
  }

  delete(
    path: RouteProps['path'],
    controller: RouteProps['controller'],
    middleWares?: RouteProps['middleWares'],
  ) {
    this.handleRequest(path, controller, 'DELETE', [
      ...this.globalMiddleWares,
      ...(middleWares ?? []),
    ])
  }

  async reqBody(req: Req) {
    const buffers = []

    for await (const chunk of req) {
      buffers.push(chunk)
    }

    const body = Buffer.concat(buffers).toString()

    return body
  }

  async handleBody() {
    this.req.body = await this.reqBody(this.req)
  }

  routeParamsRegex(routePath: string) {
    const regex = /:([a-zA-z]+)/g
    const pathWithParams = routePath.replaceAll(regex, '(?<$1>[a-z0-9-_]+)')

    const pathRegex = new RegExp(`^${pathWithParams}`)

    return pathRegex
  }

  handleRouteParams(routePath: string) {
    const path = `${this.req.url ?? ''}`

    const pathRegex = this.routeParamsRegex(routePath)

    const routeParams = { ...(path.match(pathRegex)?.groups ?? {}) }

    this.req.params = routeParams

    return routeParams
  }

  handleRouteSearchParams() {
    const searchParams = this.req.url
      ?.split('?')[1]
      ?.split('&')
      .reduce((acc: Record<string, string>, item) => {
        const itemSplitted = item.split('=')
        acc[itemSplitted[0]] = itemSplitted[1]
        return acc
      }, {})

    this.req.searchParams = searchParams

    return searchParams
  }
}

export const server = new Server()
