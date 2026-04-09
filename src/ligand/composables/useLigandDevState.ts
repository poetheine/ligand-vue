import { ref } from 'vue'

const COOKIE_KEY = 'lig-dev-show-data'

function getCookie(key: string): boolean {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${key}=`))
    ?.split('=')[1] === 'true'
}

function setCookie(key: string, value: boolean) {
  document.cookie = `${key}=${value}; path=/; max-age=${60 * 60 * 24 * 30}`
}

// Module-scope singleton state.
const showDevData = ref(getCookie(COOKIE_KEY))

export function useLigandDevState() {
  function toggleShowDevData(val: boolean) {
    showDevData.value = val
    setCookie(COOKIE_KEY, val)
  }

  return { showDevData, toggleShowDevData }
}