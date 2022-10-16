import React, { useEffect, useState } from 'react'
import { Storage } from '@aws-amplify/storage'

const S3Video: React.FC<{ videoKey: string }> = ({ videoKey }) => {
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    Storage.get(videoKey).then(setUrl)
  }, [videoKey])

  return <video controls autoPlay src={url} muted controlsList='nodownload' />
}

export default S3Video
