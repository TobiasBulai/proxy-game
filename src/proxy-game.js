class ProxyGame {
  #dimension = 10
  #cubes = []
  #solutions = []

  constructor () {
    if (document.getElementById('proxy-game') === null) {
      throw new Error(`Can't find element with id: "proxy-game"`)
    }
  }

  /**
   *
   * @param {number} dimension - minimum is 5 to not make things weird
   */
  setMatrixSize (dimension) {
    if (dimension < 5) {
      dimension = 5
    }

    this.#dimension = dimension
  }

  start () {
    this.#initCubes()
    this.#initSolution()
    this.#buildTable()
  }

  #initCubes () {
    this.#cubes = []
    for (let y = 1; y <= this.#dimension; y++) {
      for (let x = 1; x <= this.#dimension; x++) {
        let hit = (this.#getRandomIntInclusive(0, 1) == 1)
        this.#cubes.push({ x: x, y: y, hit: hit })
      }
    }
  }

  #getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  #initSolution () {
    this.#solutions = []
    this.#initSolutionY(1)
    this.#initSolutionX(1)
  }

  #initSolutionX (y) {
    let numHits = 0
    let proximities = { y: y, prox: [] }

    for (let x = 1; x <= this.#dimension; x++) {
      const cube = this.#cubes.find((cubeObj) => {
        return (
          cubeObj.x == x
          && cubeObj.y == y
          && cubeObj.hit === true
        )
      })

      if (cube !== undefined) {
        numHits++

        if (x === this.#dimension) proximities.prox.push(numHits)
      } else {
        if (numHits > 0) proximities.prox.push(numHits)
        numHits = 0
      }
    }

    this.#solutions.push(proximities)
    if (y < this.#dimension) {
      y = y + 1
      this.#initSolutionX(y)
    }
  }

  #initSolutionY (x) {
    let numHits = 0
    let proximities = { x: x, prox: [] }

    for (let y = 1; y <= this.#dimension; y++) {
      const cube = this.#cubes.find((cubeObj) => {
        return (
          cubeObj.x == x
          && cubeObj.y == y
          && cubeObj.hit === true
        )
      })

      if (cube !== undefined) {
        numHits++

        if (y === this.#dimension) proximities.prox.push(numHits)
      } else {
        if (numHits > 0) proximities.prox.push(numHits)
        numHits = 0
      }
    }

    this.#solutions.push(proximities)
    if (x < this.#dimension) {
      x = x + 1
      this.#initSolutionY(x)
    }
  }

  #buildTable () {
    document.getElementById('proxy-game').innerHTML = ''

    let table = document.createElement('table')
    let tbody = document.createElement('tbody')
    table.setAttribute('id', 'game-table')

    for (let y = 1; y <= this.#dimension; y++) {
      let row = document.createElement('tr')

      for (let x = 1; x <= this.#dimension; x++) {
        let td = document.createElement('td')
        td.innerHTML = "&nbsp"
        td.dataset.x = x
        td.dataset.y = y

        td.addEventListener('mouseup', function(event) {
          if (this.dataset.guessedHit == 'false' || this.dataset.guessedHit === undefined) {
            this.dataset.guessedHit = true
            this.innerText = 'O'
          } else {
            this.dataset.guessedHit = false
            this.innerText = 'X'
          }
        })

        row.appendChild(td)
      }

      tbody.appendChild(row)
    }

    table.appendChild(tbody)
    this.#buildSolutionTable(table);
    document.getElementById('proxy-game').appendChild(table)
  }

  #buildSolutionTable (table) {
    // build Y-column
    let row = document.createElement('tr')
    const emptyCol = document.createElement('td')
    emptyCol.setAttribute('class', 'empty')
    row.appendChild(emptyCol)

    this.#solutions.forEach((solution) => {
      if (solution.hasOwnProperty('x')) {
        const col = document.createElement('td')

        solution.prox.forEach(prox => {
          col.innerHTML += `${prox}<br/>`
        })

        col.setAttribute('class', 'solution')
        row.appendChild(col)
      }
    })

    table.prepend(row)

    // build X-column
    table.querySelectorAll('tbody > tr').forEach((tableRow, index) => {
      index = index + 1
      const solution = this.#solutions.find((solution) => {
        return (
          solution.hasOwnProperty('y') &&
          solution.y === index
        )
      })

      if (solution !== undefined) {
        const col = document.createElement('td')
        col.setAttribute('class', 'solution')

        solution.prox.forEach(prox => {
          col.innerHTML += `${prox}&nbsp;`
        })

        tableRow.prepend(col)
      }
    })
  }

  solve () {
    const td = document.querySelectorAll('#proxy-game #game-table > tbody > tr > td:not(.solution):not(.empty)')

    td.forEach((element) => {
      const cube = this.#cubes.find((cubeObj) => {
        return (
          cubeObj.x == parseInt(element.dataset.x)
          && cubeObj.y == parseInt(element.dataset.y)
        )
      })

      if (cube !== undefined) {
        if (
          (element.dataset.guessedHit == 'false' && !cube.hit) ||
          (element.dataset.guessedHit == 'true' && cube.hit)
        ) {
          element.style.backgroundColor = 'lightgreen'
        } else if (element.dataset.guessedHit === undefined) {
          element.style.backgroundColor = 'orange'
        } else {
          element.style.backgroundColor = 'red'
        }
      }
    })
  }
}
