import { disableIFramePointerEvents } from './unnamed/disable-iframe-pointer-events/disableIFramePointerEvents.js'
import { enableIFramePointerEvents } from './unnamed/disable-iframe-pointer-events/enableIFramePointerEvents.js'
import { getStyle } from './unnamed/getStyle.js'
import { resetStyle } from './unnamed/resetStyle.js'
import { setStyle } from './unnamed/setStyle.js'

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
    const styleNames = ['left', 'top', 'width', 'height']
    let style = null
    window.addEventListener('maximize', () => {
      if (window.classList.contains('window--maximized')) {
        window.classList.remove('window--maximized')
        if (style) {
          setStyle(style, window)
        }
        style = null
      } else {
        style = getStyle(styleNames, window)
        resetStyle(styleNames, window)
        window.classList.add('window--maximized')
      }
    })
  }

  _registerResizeHandlers($window) {
    const onPointerMove = (event) => {
      $window.style.width = Math.max(0, event.clientX - $window.offsetLeft) + 'px'
      $window.style.height = Math.max(0, event.clientY - $window.offsetTop) + 'px'
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
