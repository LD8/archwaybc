import { Storage, StorageListConfig } from '@aws-amplify/storage'
import { useEffect, useState } from 'react'

export const useGetS3List = <T extends Record<string, any>>({
  path,
  cb,
  config,
}: {
  path: string
  cb?: (p: IS3Items) => void
  config?: StorageListConfig<T>
}) => {
  const [list, setList] = useState<IS3Items>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Storage.list<T>(path, config)
      .then((res) => {
        const l = res.filter((r) => r.size)
        setList(l)
        return l
      })
      .then(cb)
      .catch(console.log)
      .finally(() => setLoading(false))
  }, [cb, config, path])

  return { list, loading }
}
