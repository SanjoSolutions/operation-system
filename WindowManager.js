import { disableIFramePointerEvents } from './disableIFramePointerEvents.js'
import { enableIFramePointerEvents } from './enableIFramePointerEvents.js'

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
    this._registerResizeHandlers(window)
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
    let size = null
    window.addEventListener('maximize', () => {
      if (window.classList.contains('window--maximized')) {
        window.classList.remove('window--maximized')
        if (position) {
          window.style.left = position.x
          window.style.top = position.y
        }
        if (size) {
          window.style.width = size.width + 'px'
          window.style.height = size.height + 'px'
        }
        position = null
        size = null
      } else {
        position = {
          x: window.style.left,
          y: window.style.top
        }
        size = {
          width: window.clientWidth,
          height: window.clientHeight
        }
        window.style.left = null
        window.style.top = null
        window.style.width = null
        window.style.height = null
        window.classList.add('window--maximized')
      }
    })
  }

  _registerResizeHandlers($window) {
    const onPointerMove = (event) => {
      $window.style.width = Math.max(0, $window.clientWidth + event.movementX) + 'px'
      $window.style.height = Math.max(0, $window.clientHeight + event.movementY) + 'px'
    }

    $window.addEventListener('resize-start', () => {
      disableIFramePointerEvents()
      window.addEventListener('pointermove', onPointerMove)
    })

    $window.addEventListener('resize-end', () => {
      enableIFramePointerEvents()
      window.removeEventListener('pointermove', onPointerMove)
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
