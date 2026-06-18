# DevSphere Frontend Production Readiness — TODO

## 0. Scope alignment
- [x] Repo inspection (key files identified)
- [x] Approved rollout order (auth → sockets → routing → optimistic mutations → design tokens)

## 1. TanStack Query-driven auth (remove App useEffect server loading)
- [x] Remove `dispatch(getMe())` from `src/App.tsx` (server state bootstrapping eliminated)
- [x] Wire `useMeQuery()` into auth/ProtectedRoute/AuthGuard

## 2. Axios refresh interceptor contract hardening
- [x] Ensure refresh single-flight replay is correct and typed
- [x] Prevent `originalRequest` mutation side effects; keep retry marker safe

## 3. Socket cookie auth (stop passing JWT to socket.io-client)
- [x] Refactor `src/services/socket.service.ts` to remove `auth: { token }`
- [ ] Remove console logs and type events

## 4. Real-time cache invalidation
- [ ] Wire socket events to TanStack Query invalidation
- [x] Notification invalidation matches required query keys

## 5. Routing polish: lazy + Suspense + skeleton fallback
- [x] Refactor `AppRoutes.tsx` to use `React.lazy` per route
- [x] Add `<Suspense fallback={<RouteSkeleton/>}>` wrapper
- [x] Confirm `/` redirects to `/feed` when authenticated

## 6. Optimistic updates (mutation correctness audit)
- [x] Like/unlike optimistic flip + rollback (updated to use likesCount)
- [x] Bookmark toggle optimistic flip + rollback
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
- [x] Run frontend lint/typecheck/build
- [ ] Validate no secret strings in built bundle
- [ ] Validate acceptance checklist items

## Completed routes/pages
- [x] `/feed` - home feed with infinite scroll
- [x] `/trending` - trending posts page  
- [x] `/developers` - followed developers feed
- [x] `/technologies` - technology list page
- [x] `/saved` - bookmarked posts page
- [x] `/notifications` - notifications list page
- [x] `/post/:id` - post detail with comments
- [x] `/profile/:username` - user profile page
- [x] `/search` - search users/posts
- [x] `/technology/:name` - posts by technology
- [x] `/settings` - settings page
- [x] `/create-post` - create post with image/video upload