/**
 * Ends the browser session once the user has closed every tab of the app, without logging out on reload,
 * same-tab navigation, or while another tab of the app is still open. Sends nothing while tabs are open.
 *
 * A signed-in tab keeps a sessionStorage marker (survives reload and same-tab navigation, dies with the
 * tab) and holds a shared Web Lock (released by the browser when the tab closes or crashes). A tab that
 * starts without the marker while no other tab holds the lock means every signed-in tab was closed, so the
 * leftover cookie session is ended with the normal logout call before anything else loads.
 *
 * Nothing is sent when a tab closes: unload cannot tell a reload from a close, and the backend's
 * session-ending calls cannot be undone by the reloaded page (logout revokes at once; tab-lifecycle
 * expects a continuous heartbeat once used). The server session therefore stays valid until the app is
 * next opened in this browser, or until the refresh token expires.
 */
import { usePlatformApi as isPlatformApi } from './onboardingService'

const TAB_SESSION_KEY = 'mc:tab-session'
const SIGNED_IN_LOCK = 'mc:signed-in-tab'

const hasTabSession = () => sessionStorage.getItem(TAB_SESSION_KEY) === '1'

/**
 * Called once on app start, before the session is restored. Returns false when this tab has no
 * session of its own and no other signed-in tab is open, i.e. the previous tabs were all closed.
 */
export async function shouldResumeSession(): Promise<boolean> {
  if (!isPlatformApi() || hasTabSession()) return true
  // Web Locks need a secure context (https or localhost); without them the session is kept.
  if (!navigator.locks?.query) return true
  try {
    const { held = [] } = await navigator.locks.query()
    return held.some((lock) => lock.name === SIGNED_IN_LOCK)
  } catch {
    return true
  }
}

/** Mark this tab as signed in and hold the shared lock until the returned stop() runs. */
export function startTabSession(): () => void {
  if (!isPlatformApi()) return () => {}
  sessionStorage.setItem(TAB_SESSION_KEY, '1')

  let stopped = false
  const releases: Array<() => void> = []
  const holdLock = () => {
    navigator.locks
      ?.request(SIGNED_IN_LOCK, { mode: 'shared' }, () =>
        stopped ? Promise.resolve() : new Promise<void>((resolve) => releases.push(resolve)),
      )
      .catch(() => undefined)
  }
  holdLock()
  // A page restored from the back/forward cache may have had its lock released while it was cached.
  const onPageShow = (e: PageTransitionEvent) => {
    if (e.persisted) holdLock()
  }
  window.addEventListener('pageshow', onPageShow)

  return () => {
    stopped = true
    window.removeEventListener('pageshow', onPageShow)
    releases.splice(0).forEach((release) => release())
  }
}

/** This tab is signed out: a later reload must not resume a session. */
export function endTabSession() {
  sessionStorage.removeItem(TAB_SESSION_KEY)
}
