// General Resources
type IHRef = string
type IUrl = string

type IVideo = { itemKey: string; marked: boolean; category?: string }
type IImage = {
  itemKey: string
  marked: boolean
  category?: string
  box?: IBox
}
type IBox = { pointStart: IPoint; pointEnd: IPoint }
type IPoint = [number, number]

type IS3Item = S3ProviderListOutputItem
type IS3Items = IS3Item[]
