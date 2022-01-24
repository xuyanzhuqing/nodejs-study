// 基础的 promise

class Promise1 {
  constructor (fn) {
    this.callback = []
    fn(this._resolve.bind(this))
  }

  then (fullFilled) {
    this.callback.push(fullFilled)
    return this
  }

  _resolve (value) {
    setTimeout(() => {
      this.callback.forEach(fn => fn(value))
    })
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