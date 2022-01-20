export class PersistenceService {
  saveWindowPosition(window) {
    const x = window.offsetLeft
    const y = window.offsetTop
    localStorage.setItem(`window_${ window.getAttribute('id') }`, JSON.stringify({ x, y }))
  }

  restoreWindowPosition(window) {
    const serializedState = localStorage.getItem(`window_${ window.getAttribute('id') }`)
    if (serializedState) {
      const state = JSON.parse(serializedState)
      window.style.left = `${ state.x }px`
      window.style.top = `${ state.y }px`
    }
  }
}
