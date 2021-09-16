export class WindowManager {
  static WINDOW_POSITION_OFFSET = 16

  constructor() {
    this._windows = []
    this._zIndex = 0
  }

  spawnWindow(window) {
    this._addWindow(window)
    this._positionWindow(window)
    this._registerPointerDownHandler(window)
    this._registerMaximizeHandler(window)
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

  _registerPointerDownHandler(window) {
    window.addEventListener('pointerdown', this._putWindowOnTop.bind(this, window))
  }

  _registerMaximizeHandler(window) {
    let position = null
    window.addEventListener('maximize', () => {
      if (window.classList.contains('window--maximized')) {
        window.classList.remove('window--maximized')
        if (position) {
          window.style.left = position.x
          window.style.top = position.y
        }
        position = null
      } else {
        position = {
          x: window.style.left,
          y: window.style.top
        }
        window.style.left = null
        window.style.top = null
        window.classList.add('window--maximized')
      }
    })
  }

  _putWindowOnTop(window) {
    this._zIndex += 1
    window.style.zIndex = this._zIndex
  }

  _determineWindowPosition(window) {
    const offset = (this._windows.length - 1) * WindowManager.WINDOW_POSITION_OFFSET
    return {
      x: offset,
      y: offset,
    }
  }
}
