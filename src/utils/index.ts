import moment from 'moment'
import { MOUSE_INIT } from '../components/MarkingModal'

export const regulateTime = (time?: string | null) =>
  !time ? '-' : moment(time).format('YYYY-MM-DD HH:mm:ss')

export const mouseToCoord = (mouse: ReturnType<typeof MOUSE_INIT>): IBox => {
  return [mouse.startX, mouse.startY, mouse.endX, mouse.endY]
}

export const coordToMouse = (coord: IBox) => {
  return { startX: coord[0], startY: coord[1], endX: coord[2], endY: coord[3] }
}
