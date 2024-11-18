/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as JoinIdImport } from './routes/join/$id'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const AdminCreateLazyImport = createFileRoute('/admin/create')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const AdminCreateLazyRoute = AdminCreateLazyImport.update({
  id: '/admin/create',
  path: '/admin/create',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/admin/create.lazy').then((d) => d.Route))

const JoinIdRoute = JoinIdImport.update({
  id: '/join/$id',
  path: '/join/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/join/$id': {
      id: '/join/$id'
      path: '/join/$id'
      fullPath: '/join/$id'
      preLoaderRoute: typeof JoinIdImport
      parentRoute: typeof rootRoute
    }
    '/admin/create': {
      id: '/admin/create'
      path: '/admin/create'
      fullPath: '/admin/create'
      preLoaderRoute: typeof AdminCreateLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/join/$id': typeof JoinIdRoute
  '/admin/create': typeof AdminCreateLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/join/$id': typeof JoinIdRoute
  '/admin/create': typeof AdminCreateLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/join/$id': typeof JoinIdRoute
  '/admin/create': typeof AdminCreateLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/join/$id' | '/admin/create'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/join/$id' | '/admin/create'
  id: '__root__' | '/' | '/join/$id' | '/admin/create'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  JoinIdRoute: typeof JoinIdRoute
  AdminCreateLazyRoute: typeof AdminCreateLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  JoinIdRoute: JoinIdRoute,
  AdminCreateLazyRoute: AdminCreateLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/join/$id",
        "/admin/create"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/join/$id": {
      "filePath": "join/$id.tsx"
    },
    "/admin/create": {
      "filePath": "admin/create.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
