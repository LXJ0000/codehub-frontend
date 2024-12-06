import { useRouter } from 'vue-router'
const router = useRouter()

export const gotoPage = (path) => {
  console.log('log.gotoPage:', path)
  router.push(path)
}
