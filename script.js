class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.graphMode = false
      this.clear()
    }
  
    clear() {
      this.currentOperand = ''
      this.previousOperand = ''
      this.operation = undefined
      this.graphMode = false
    }
  
    delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
    
    // normal mode

    appendNumber(number) {
      if (this.graphMode) return
      if (number === '.' && this.currentOperand.includes('.')) return
      this.currentOperand = this.currentOperand.toString() + number.toString()
    }
  
    chooseOperation(operation) {
      if (this.graphMode) return
      if (this.currentOperand === '') return
      if (this.previousOperand !== '') {
        this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    }
  
    compute() {
      if (this.graphMode) return
      let computation
      const prev = parseFloat(this.previousOperand)
      const current = parseFloat(this.currentOperand)
      //if (isNaN(prev) || isNaN(current)) return
      switch (this.operation) {
        case '+':
          computation = prev + current
          break
        case '-':
          computation = prev - current
          break
        case '*':
          computation = prev * current
          break
        case '÷':
          computation = prev / current
          break
        case '^':
          computation = prev ** current
          break
        case '^(1/':
          computation = prev ** (1/current)
          break
        case 'Sin':
          computation = Math.sin(prev * Math.PI / 180)
          break
        case 'Cos':
          computation = Math.cos(prev * Math.PI / 180)
          break
        case 'Tan':
          computation = Math.tan(prev * Math.PI / 180)
          break
        case 'Log10':
          computation = Math.log10(prev)
          break
        case 'Ln':
          computation = Math.log(prev)
          break
        default:
          return
      }
      this.currentOperand = computation
      this.operation = undefined
      this.previousOperand = ''
    }
  
    getDisplayNumber(number) {
      if (this.graphMode) return
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
  
    updateDisplay() {
      if (this.graphMode) return
      this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand)
      
      if (this.operation != null) {
        if(this.operation === 'aⁿ') {
          this.operation = '^'
        } else if (this.operation === 'ⁿ√a'){
          this.operation = '^(1/'
        } 

        if (this.operation === 'Sin' ||  this.operation === 'Cos' || this.operation === 'Tan'
        || this.operation === 'Ln'|| this.operation === 'Log10') {
          this.previousOperandTextElement.innerText =
          `${this.operation}(${this.getDisplayNumber(this.previousOperand)})`
        } else {
          this.previousOperandTextElement.innerText =
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        }
        
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }

    // graphing mode

    initializeFunction() {
      this.previousOperand = 'f(x)='
      this.graphMode = true
    }

    appendNumberGraph(number) {
      if (!this.graphMode) return
      this.previousOperand = this.previousOperand.toString() + number.toString()
    }

    chooseOperationGraph(operation) {
      if (!this.graphMode && this.previousOperand !== 'f(x)=') return
      if(operation === 'aⁿ') {
        operation = '^'
      }
      this.previousOperand = this.previousOperand + operation
    }

    updateDisplayGraph() {
      if (!this.graphMode) return
      this.previousOperandTextElement.innerText = this.previousOperand
    }

  }
  
  
  const numberButtons = document.querySelectorAll('[data-number]')
  const operationButtons = document.querySelectorAll('[data-operation]')
  const equalsButton = document.querySelector('[data-equals]')
  const deleteButton = document.querySelector('[data-delete]')
  const allClearButton = document.querySelector('[data-all-clear]')
  const previousOperandTextElement = document.querySelector('[data-previous-operand]')
  const currentOperandTextElement = document.querySelector('[data-current-operand]')
  const functionButton = document.querySelector('[data-initial-function]')
  const varButton = document.querySelector('[data-var]')
  
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
  
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
      calculator.appendNumberGraph(button.innerText)
      calculator.updateDisplayGraph()
    })
  })
  
  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText)
      calculator.updateDisplay()
      calculator.chooseOperationGraph(button.innerText)
      calculator.updateDisplayGraph()
    })
  })
  
  equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
  })
  
  allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
  })
  
  deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
  })

  functionButton.addEventListener('click', button => {
    calculator.initializeFunction()
    calculator.updateDisplayGraph()
  })

// fungsi lain-lain

  function myFunction() {
    const x = document.getElementById("keypad");
    const y = document.getElementById("show-btn");
    if (x.style.display === "none") {
      x.style.display = "grid";
      y.style.bottom = "65%"
    } else {
      x.style.display = "none";
      y.style.bottom = "45px"
    }
  }

  const elt = document.getElementById('graph');
  const graph = Desmos.GraphingCalculator(elt);
  let equation = 'f(x)=x^2';
  graph.setExpression({ id: 'graph1', latex: equation });
  graph.updateSettings({expressions:false, keypad:false, settingsMenu:false, zoomButtons: false});
