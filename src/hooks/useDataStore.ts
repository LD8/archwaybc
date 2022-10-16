import { DataStore } from '@aws-amplify/datastore'
import { useEffect, useState } from 'react'
import { Image, Video } from '../models'

const useDataStore = (isMarked: boolean) => {
  const [images, setImages] = useState<any>()
  const [videos, setVideos] = useState<any>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([DataStore.query(Image), DataStore.query(Video)])
      .then(([imgs, vids]) => {
        setImages(imgs.filter(({ marked }) => marked === isMarked))
        setVideos(vids.filter(({ marked }) => marked === isMarked))
      })
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [isMarked])
  return { images, videos, loading }
}

export default useDataStore
