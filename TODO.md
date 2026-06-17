# DevSphere Frontend Production Readiness — TODO

## 0. Scope alignment
- [x] Repo inspection (key files identified)
- [x] Approved rollout order (auth → sockets → routing → optimistic mutations → design tokens)

## 1. TanStack Query-driven auth (remove App useEffect server loading)
- [x] Remove `dispatch(getMe())` from `src/App.tsx` (server state bootstrapping eliminated)
- [ ] Next: implement `useMeQuery()` and wire it into auth/ProtectedRoute/AuthGuard

## 2. Axios refresh interceptor contract hardening
- [ ] Ensure refresh single-flight replay is correct and typed
- [ ] Prevent `originalRequest` mutation side effects; keep retry marker safe

## 3. Socket cookie auth (stop passing JWT to socket.io-client)
- [ ] Refactor `src/services/socket.service.ts` to remove `auth: { token }`
- [ ] Remove console logs and type events

## 4. Real-time cache invalidation
- [ ] Wire socket events to TanStack Query invalidation
- [ ] Notification invalidation matches required query keys

## 5. Routing polish: lazy + Suspense + skeleton fallback
- [ ] Refactor `AppRoutes.tsx` to use `React.lazy` per route
- [ ] Add `<Suspense fallback={<RouteSkeleton/>}>` wrapper
- [ ] Confirm `/` redirects to `/feed` when authenticated

## 6. Optimistic updates (mutation correctness audit)
- [ ] Like/unlike optimistic flip + rollback
- [ ] Follow/unfollow optimistic flip + rollback
- [ ] Create comment optimistic pending item replacement
- [ ] Create post optimistic prepend + rollback + scroll-to-top
- [ ] Mark notification read optimistic flip + background sync

## 7. Design tokens alignment
- [ ] Update `src/index.css` variables to match prompt token contract

## 8. Performance + accessibility enforcement
- [ ] Remove `any` (notably socket.service)
- [ ] Ensure skeletons match final heights (avoid CLS)

## 9. Verification
- [ ] Run frontend lint/typecheck/build
- [ ] Validate no secret strings in built bundle
- [ ] Validate acceptance checklist items

