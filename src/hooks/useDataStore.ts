import { DataStore } from '@aws-amplify/datastore'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Image, Video } from '../models'

const useDataStore = (isMarked: boolean) => {
  const [images, setImages] = useState<any>()
  const [videos, setVideos] = useState<any>()
  const [loadingImages, setLoadingImages] = useState(false)
  const [loadingVideos, setLoadingVideos] = useState(false)

  const refreshImages = useCallback(() => {
    setLoadingImages(true)
    DataStore.query(Image)
      .then((imgs) =>
        setImages(imgs.filter(({ marked }) => !!marked === isMarked)),
      )
      .catch(console.log)
      .finally(() => setLoadingImages(false))
  }, [isMarked])

  const refreshVideos = useCallback(() => {
    setLoadingVideos(true)
    DataStore.query(Video)
      .then((vids) =>
        setVideos(vids.filter(({ marked }) => !!marked === isMarked)),
      )
      .catch(console.log)
      .finally(() => setLoadingVideos(false))
  }, [isMarked])

  useEffect(() => {
    refreshImages()
    refreshVideos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMarked])

  return {
    images,
    videos,
    loadingImages,
    loadingVideos,
    refreshImages,
    refreshVideos,
  }
}

export default useDataStore

export const useInstanceUpdate = (isVideo = false) => {
  const [updating, setUpdating] = useState(false)
  const updateInstance = useCallback(
    async (id: string, newInstance: Partial<Image | Video>) => {
      if (id && newInstance) {
        setUpdating(true)
        let instance: Image | Video | void
        try {
          if (isVideo) {
            instance = await updateVideo(id, newInstance as Video)
          } else {
            instance = await updateImage(id, newInstance as Image)
          }
          toast.success(
            `Successfully updated ${isVideo ? 'video' : 'image'} - ${
              instance?.itemKey
            }!`,
          )
        } catch (error) {
          toast.error(
            `Error on updating ${isVideo ? 'video' : 'image'} - ${
              instance?.itemKey
            }!`,
          )
        }
        setUpdating(false)
      }
    },
    [isVideo],
  )
  return { updating, updateInstance }
}

async function updateImage(id: string, newImage: Partial<Image>) {
  const original = await DataStore.query(Image, id)
  if (!original)
    return console.log(`Image with id ${id} is not found in DataStore`)

  return await DataStore.save(
    Image.copyOf(original, (updated) => {
      const { box, category } = newImage
      if (box) updated.box = box
      if (category) updated.category = category
      if (box && category) updated.marked = true
    }),
  )
}

async function updateVideo(id: string, newVideo: Partial<Video>) {
  const original = await DataStore.query(Video, id)
  if (!original)
    return console.log(`Video with id ${id} is not found in DataStore`)

  return await DataStore.save(
    Video.copyOf(original, (updated) => {
      const { category } = newVideo
      if (category) updated.category = category
      if (category) updated.marked = true
    }),
  )
}
