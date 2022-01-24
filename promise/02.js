// 有状态的 promise

class Promise1 {
  constructor (fn) {
    this.value = ''
    this.status = 'pendding'
    this.callback = []
    fn(this._resolve.bind(this))
  }

  then (fullFilled) {
    if (this.status === 'pendding') {
      this.callback.push(fullFilled)
    } else {
      // 已经有值，直接回调
      fullFilled(this.value)
    }

    return this
  }

  _resolve (value) {
    this.value = value
    this.status = 'fullFilled'
    this.callback.forEach(fn => fn(value))
  }
}

// ---------------------------------------------

const p1 = new Promise1((resolve, reject) => {
  setTimeout(() => {
    resolve(233)
  }, 3000)
})

p1.then(res => {
  console.info('called: ' + res)
})

p1.then((res) => {
  console.info(res)
})