export class WindowManager {
  static WINDOW_POSITION_OFFSET = 16

  constructor() {
    this._windows = []
  }

  spawnWindow(window) {
    this._addWindow(window)
    this._positionWindow(window)
    document.body.appendChild(window)
  }

  _addWindow(window) {
    this._windows.push(window)
  }

  _positionWindow(window) {
    const { x, y } = this._determineWindowPosition(window)
    window.style.left = `${ x }px`
    window.style.top = `${ y }px`
  }

  _determineWindowPosition(window) {
    const offset = (this._windows.length - 1) * WindowManager.WINDOW_POSITION_OFFSET
    return {
      x: offset,
      y: offset,
    }
  }
}
