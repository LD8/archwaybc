import moment from 'moment'

// initDraw(document.getElementById('targetCanvas'))

export function initDraw(
  targetCanvas: HTMLElement,
  onFinish: (coord: IBox) => void,
) {
  const mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
  }
  let element: HTMLElement | null = null

  targetCanvas.onclick = function (e: MouseEvent) {
    if (element !== null) {
      element = null
      targetCanvas.style.cursor = 'default'
      console.log('finsihed.', mouse)
      onFinish({
        pointStart: [mouse.startX, mouse.startY],
        pointEnd: [mouse.x, mouse.y],
      })
    } else {
      mouse.startX = mouse.x
      mouse.startY = mouse.y
      console.log('begun.', mouse)
      element = document.createElement('div')
      // className for CSS adaptation
      element.className = 'rectangle'
      element.style.left = mouse.x + 'px'
      element.style.top = mouse.y + 'px'
      targetCanvas.appendChild(element)
      targetCanvas.style.cursor = 'crosshair'
    }
  }

  targetCanvas.onmousemove = function (e: MouseEvent) {
    setMousePosition(e)
    if (element !== null) {
      element.style.width = Math.abs(mouse.x - mouse.startX) + 'px'
      element.style.height = Math.abs(mouse.y - mouse.startY) + 'px'
      element.style.left =
        mouse.x - mouse.startX < 0 ? mouse.x + 'px' : mouse.startX + 'px'
      element.style.top =
        mouse.y - mouse.startY < 0 ? mouse.y + 'px' : mouse.startY + 'px'
    }
  }

  function setMousePosition(e: MouseEvent) {
    const ev = e || window.event //Moz || IE
    if (ev.pageX) {
      //Moz
      mouse.x = ev.pageX + window.pageXOffset
      mouse.y = ev.pageY + window.pageYOffset
    } else if (ev.clientX) {
      //IE
      mouse.x = ev.clientX + document.body.scrollLeft
      mouse.y = ev.clientY + document.body.scrollTop
    }
  }
}

export const regulateTime = (time?: string | null) =>
  !time ? '-' : moment(time).format('YYYY-MM-DD HH:mm:ss')
