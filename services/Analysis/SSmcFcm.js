const M = 2;
const _M = 10;
const epsilon = 0.0001

class SSmcFcm {
  X = [];
  C = [];
  m = [];
  V = [];
  V_ = [];
  U = [];
  tag = null;
  keys = null;

  isDone = false;

  constructor(X, C, tagField, keys) {
    this.X = X;
    this.C = C;
    this.tag = tagField;
    this.keys = keys;

  }

  run() {
    let self = this;
    return new Promise((resolve, reject) => {
      self.#init();
      resolve(self);
    })
  }

  #init() {
    this.X.forEach(x => {
      let m = []

      this.C.forEach((c, ic) => {
        // this.colors[c] = colors[ic];
        m.push(x[this.tag] == c ? _M : M)
      })
      this.m.push(m)

    })

    this.#step1()
  }

  #step1() {
    this.C.forEach(c => {
      let ele = this.X.filter(x => x[this.tag] == c)
      let v = {}
      ele && ele.forEach(e => {
        Object.keys(e).forEach(field => {
          if (![...this.keys, this.tag].includes(field) && typeof e[field] == 'number') {
            v[field] = 0
            v[field] += e[field]
          } else {
            v[field] = null;
          }
        })
      })

      ele && Object.keys(v).forEach(field => {
        if (![...this.keys, this.tag].includes(field) && typeof v[field] == 'number') {
          v[field] = v[field] / ele.length
        }
      })

      if (ele.length <= 0) {
        Object.keys(this.X[0]).forEach(field => {
          if (![...this.keys, this.tag].includes(field) && typeof this.X[0][field] == 'number') {
            v[field] = Math.random() * 10
          } else {
            v[field] = null;
          }
        })
      }
      // gán nhãn cho tâm
      v[this.tag] = c;
      this.V.push(v)
    })
    this.#step2()
  }

  #step2() {
    this.U = []
    this.X.forEach(x => {
      let u = []
      let ds = []
      this.V.forEach(v => {
        ds.push(this.distance(x, v))
      })

      if (ds.some(d => d == 0)) {
        u = ds.map(d => d == 0 ? 1 : 0)
      } else {
        let supervisedV = this.isSupervised(x)
        if (supervisedV < 0) { // unsupervised
          ds.forEach(d => {
            let u_ = 0;
            ds.forEach(d_ => {
              u_ += Math.pow((d / d_), 2 / (M - 1))
            })
            u.push(1 / u_)
          })
        } else {
          // supervised
          let ds_converted = ds.map(d => (d / Math.min(...ds)))
          let muy = []
          this.V.forEach((v, j) => {
            if (j != supervisedV) {
              // j != k
              muy.push(Math.pow(1 / (M * Math.pow(ds_converted[j], 2)), 1 / (M - 1)))
            } else {
              muy.push(0)
            }
          })

          let right = Math.pow(1 / (_M * Math.pow(ds_converted[supervisedV], 2)), 1 / (_M - 1))
          let minusAnswer = -1
          while (true) {
            minusAnswer = (muy[supervisedV] / Math.pow(muy[supervisedV] + this.sum(muy), (_M - M) / (_M - 1))) - right
            if (minusAnswer >= 0) break;

            muy[supervisedV] += epsilon;
          }

          u.push(...muy.map(e => e / this.sum(muy)))
        }
      }

      this.U.push(u)
    })

    this.#step3()
  }

  #step3() {
    // vị trí tâm mới
    this.V_ = []

    this.C.forEach((c, ic) => {
      let up = {},
        down = 0;

      this.X.forEach((x, ix) => {
        let down_ = Math.pow(this.U[ix][ic], this.m[ix][ic])
        down += down_

        up = this.addOfD(this.timesOfD(down_, x), up)
      })

      this.V_.push(this.divideOfD(down, up))
    })

    this.#step4()
  }

  #step4() {
    let ds = []
    for (let i = 0; i < this.V.length; i++) {
      ds.push(this.distance(this.V[i], this.V_[i]))
    }

    // update vị trí các tâm
    this.V.forEach((v, iv) => {
      Object.keys(v).forEach(field => {
        if (![...this.keys, this.tag].includes(field) && typeof v[field] == 'number') {
          v[field] = this.V_[iv][field]
        }
      })
    })

    let isLoop = ds.some(d => d > epsilon)

    // draw V
    // this.#drawV();

    // let loop = setTimeout(() => {
      if (isLoop) {
        this.#step2();
      } else {
        this.#setLabel()
        this.isDone = true;
        // clearTimeout(loop);
      }
    // }, 1000)
  }

  /**
   * 
   * @param {number} timeout 
   * @returns Promise
   */
  done() {
    let self = this;
    return new Promise(function(resolve, reject) {
      let loopCheck = setInterval(() => {
        if (self.isDone) {
          resolve(self);
          clearInterval(loopCheck);
        }
      }, 20);
    })
  }

  distance(x, v) {
    let sumOfSquares = 0;
    Object.keys(v).forEach(field => {
      if (![...this.keys, this.tag].includes(field) && typeof v[field] == 'number') {
        sumOfSquares += Math.pow(x[field] - v[field], 2)
      }
    })

    return Math.sqrt(sumOfSquares);
  }

  isSupervised(x) {
    return this.C.findIndex(e => x[this.tag] == e)
  }

  sum(array) {
    return array.reduce((a, b) => a + b, 0)
  }

  sumRange(max) {
    return this.sum([...Array(max).keys()]);
  }

  timesOfD(num, x) {
    let newX = {}
    Object.keys(x).forEach(field => {
      if (![...this.keys, this.tag].includes(field) && typeof x[field] == 'number') {
        newX[field] = x[field] * num
      } else {
        newX[field] = null
      }
    })

    return newX
  }

  addOfD(x, y) {
    let result = {}
    Object.keys(x).forEach(field => {
      if (![...this.keys, this.tag].includes(field) && typeof x[field] == 'number') {
        result[field] = x[field] + (y[field] ? y[field] : 0)
      } else {
        result[field] = null
      }
    })

    return result
  }

  divideOfD(num, x) {
    let result = {}
    Object.keys(x).forEach(field => {
      if (![...this.keys, this.tag].includes(field) && typeof x[field] == 'number') {
        result[field] = x[field] / num
      } else {
        result[field] = null
      }
    })
    return result
  }

  dataToPoint(x) {
    let positionX = 0, positionY = 0;
    let fieldsX = 0, fieldsY = 0;
    Object.keys(x).forEach((field, i) => {
      if (![...this.keys, this.tag].includes(field) && typeof x[field] == 'number') {
        if (i % 2 == 0) {
          fieldsX++;
          positionX += x[field];
        } else {
          fieldsY++;
          positionY += x[field];
        }
      }
    });

    return {
      x: positionX, 
      y: positionY
    }
  }

  #setLabel() {
    this.X.forEach((x, ix) => {
      if (!x[this.tag]) {
        let uMax = Math.max(...this.U[ix]);
        let cIndex = (this.U[ix]).findIndex(u => u == uMax);
        x[this.tag] = this.C[cIndex];
      }
    })
  }

}


module.exports = SSmcFcm