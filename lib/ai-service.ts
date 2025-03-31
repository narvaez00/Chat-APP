// Tipo para el historial de mensajes
export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

// Interfaz para el análisis de mensajes
interface MessageAnalysis {
  emotions: string[]
  dominantEmotion: string
  emotionIntensity: number
  topics: string[]
  dominantTopic: string
  intent: string
  sentiment: number
  formality: number
  urgency: number
  personalityTraits: string[]
  needsIdentified: string[]
  questionTypes: string[]
  conversationStage: string
  userEngagement: number
}

// Interfaz para el contexto de la conversación
interface ConversationContext {
  userProfile: {
    preferredTopics: string[]
    communicationStyle: string
    emotionalState: string
    responsePreferences: string[]
    mentionedProblems: string[]
    mentionedGoals: string[]
    mentionedRelationships: string[]
    mentionedInterests: string[]
    mentionedValues: string[]
    mentionedFears: string[]
    mentionedAchievements: string[]
  }
  conversationHistory: {
    topicsDiscussed: string[]
    emotionalJourney: string[]
    questionsAsked: string[]
    adviceGiven: string[]
    insightsShared: string[]
    unaddressedPoints: string[]
  }
  currentExchange: {
    topic: string
    userEmotion: string
    userIntent: string
    responseGoal: string
    appropriateTone: string
    suggestedApproach: string
  }
}

// Clase para resolver problemas matemáticos avanzados
class AdvancedMathSolver {
  // Resolver ecuaciones cuadráticas (ax² + bx + c = 0)
  static solveQuadraticEquation(a: number, b: number, c: number): string {
    if (a === 0) {
      // Si a=0, es una ecuación lineal
      if (b === 0) {
        if (c === 0) {
          return "La ecuación tiene infinitas soluciones."
        } else {
          return "La ecuación no tiene solución."
        }
      }
      const x = -c / b
      return `La ecuación es lineal y tiene una solución: x = ${x}`
    }

    const discriminant = b * b - 4 * a * c

    if (discriminant < 0) {
      // Soluciones complejas
      const realPart = -b / (2 * a)
      const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * a)
      return `La ecuación tiene dos soluciones complejas:\nx₁ = ${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i\nx₂ = ${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`
    } else if (discriminant === 0) {
      // Una solución (raíz doble)
      const x = -b / (2 * a)
      return `La ecuación tiene una solución doble: x = ${x}`
    } else {
      // Dos soluciones reales
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a)
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a)
      return `La ecuación tiene dos soluciones reales:\nx₁ = ${x1}\nx₂ = ${x2}`
    }
  }

  // Resolver sistemas de ecuaciones lineales 2x2
  static solveLinearSystem(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): string {
    // Sistema:
    // a1x + b1y = c1
    // a2x + b2y = c2

    const determinant = a1 * b2 - a2 * b1

    if (determinant === 0) {
      // Sistema sin solución única
      const ratio1 = a1 / a2
      const ratio2 = b1 / b2
      const ratio3 = c1 / c2

      if (ratio1 === ratio2 && ratio2 === ratio3) {
        return "El sistema tiene infinitas soluciones (ecuaciones dependientes)."
      } else {
        return "El sistema no tiene solución (ecuaciones inconsistentes)."
      }
    }

    const x = (c1 * b2 - c2 * b1) / determinant
    const y = (a1 * c2 - a2 * c1) / determinant

    return `El sistema tiene una solución única:\nx = ${x}\ny = ${y}`
  }

  // Calcular derivadas de funciones polinómicas
  static calculateDerivative(coefficients: number[]): string {
    if (coefficients.length <= 1) {
      return "La derivada es 0 (función constante)."
    }

    const derivative = coefficients.slice(0, -1).map((coef, index) => coef * (coefficients.length - 1 - index))

    let result = "La derivada es:\nf'(x) = "
    result += derivative
      .map((coef, index) => {
        const power = coefficients.length - 2 - index
        if (power === 0) return `${coef}`
        if (power === 1) return `${coef}x`
        return `${coef}x^${power}`
      })
      .join(" + ")
      .replace(/\+ -/g, "- ")

    return result
  }

  // Calcular integrales indefinidas de funciones polinómicas
  static calculateIndefiniteIntegral(coefficients: number[]): string {
    const integral = coefficients.map((coef, index) => {
      const power = coefficients.length - 1 - index
      return coef / (power + 1)
    })

    integral.push(0) // Constante de integración

    let result = "La integral indefinida es:\n∫f(x)dx = "
    result += integral
      .map((coef, index) => {
        const power = coefficients.length - index
        if (power === 0) return "C"
        if (power === 1) return `${coef}x`
        return `${coef}x^${power}`
      })
      .join(" + ")
      .replace(/\+ -/g, "- ")

    return result
  }

  // Calcular límites de funciones racionales
  static calculateLimit(numeratorCoeffs: number[], denominatorCoeffs: number[], point: number | string): string {
    // Evaluar polinomio en un punto
    const evaluatePolynomial = (coeffs: number[], x: number): number => {
      return coeffs.reduce((sum, coeff, index) => {
        const power = coeffs.length - 1 - index
        return sum + coeff * Math.pow(x, power)
      }, 0)
    }

    if (point === "inf") {
      // Límite cuando x tiende a infinito
      if (numeratorCoeffs.length > denominatorCoeffs.length) {
        return "El límite cuando x tiende a infinito es: ∞"
      } else if (numeratorCoeffs.length < denominatorCoeffs.length) {
        return "El límite cuando x tiende a infinito es: 0"
      } else {
        const ratio = numeratorCoeffs[0] / denominatorCoeffs[0]
        return `El límite cuando x tiende a infinito es: ${ratio}`
      }
    } else if (typeof point === "number") {
      // Límite en un punto específico
      const numValue = evaluatePolynomial(numeratorCoeffs, point)
      const denValue = evaluatePolynomial(denominatorCoeffs, point)

      if (denValue === 0) {
        if (numValue === 0) {
          // Forma indeterminada 0/0, aplicar L'Hôpital
          return "Forma indeterminada 0/0. Se requiere aplicar la regla de L'Hôpital."
        } else {
          return `El límite no existe (división por cero).`
        }
      } else {
        const limit = numValue / denValue
        return `El límite cuando x tiende a ${point} es: ${limit}`
      }
    }

    return "No se pudo calcular el límite."
  }

  // Calcular estadísticas básicas
  static calculateStatistics(data: number[]): string {
    if (data.length === 0) {
      return "No hay datos para calcular estadísticas."
    }

    // Media
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length

    // Mediana
    const sortedData = [...data].sort((a, b) => a - b)
    let median: number
    if (data.length % 2 === 0) {
      median = (sortedData[data.length / 2 - 1] + sortedData[data.length / 2]) / 2
    } else {
      median = sortedData[Math.floor(data.length / 2)]
    }

    // Varianza
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length

    // Desviación estándar
    const stdDev = Math.sqrt(variance)

    // Mínimo y máximo
    const min = Math.min(...data)
    const max = Math.max(...data)

    return `Estadísticas descriptivas:
Media: ${mean.toFixed(4)}
Mediana: ${median.toFixed(4)}
Varianza: ${variance.toFixed(4)}
Desviación estándar: ${stdDev.toFixed(4)}
Mínimo: ${min}
Máximo: ${max}
Tamaño de la muestra: ${data.length}`
  }

  // Calcular operaciones con matrices 2x2
  static matrixOperations(matrixA: number[][], matrixB: number[][], operation: string): string {
    // Verificar que las matrices son 2x2
    if (
      matrixA.length !== 2 ||
      matrixA[0].length !== 2 ||
      (matrixB && (matrixB.length !== 2 || matrixB[0].length !== 2))
    ) {
      return "Esta operación solo está implementada para matrices 2x2."
    }

    switch (operation) {
      case "determinant":
        const det = matrixA[0][0] * matrixA[1][1] - matrixA[0][1] * matrixA[1][0]
        return `El determinante de la matriz es: ${det}`

      case "inverse":
        const detA = matrixA[0][0] * matrixA[1][1] - matrixA[0][1] * matrixA[1][0]
        if (detA === 0) {
          return "La matriz no tiene inversa (determinante = 0)."
        }

        const inverse = [
          [matrixA[1][1] / detA, -matrixA[0][1] / detA],
          [-matrixA[1][0] / detA, matrixA[0][0] / detA],
        ]

        return `La matriz inversa es:
[${inverse[0][0].toFixed(4)}, ${inverse[0][1].toFixed(4)}]
[${inverse[1][0].toFixed(4)}, ${inverse[1][1].toFixed(4)}]`

      case "add":
        if (!matrixB) return "Se requiere una segunda matriz para la suma."

        const sum = [
          [matrixA[0][0] + matrixB[0][0], matrixA[0][1] + matrixB[0][1]],
          [matrixA[1][0] + matrixB[1][0], matrixA[1][1] + matrixB[1][1]],
        ]

        return `La suma de las matrices es:
[${sum[0][0]}, ${sum[0][1]}]
[${sum[1][0]}, ${sum[1][1]}]`

      case "multiply":
        if (!matrixB) return "Se requiere una segunda matriz para la multiplicación."

        const product = [
          [
            matrixA[0][0] * matrixB[0][0] + matrixA[0][1] * matrixB[1][0],
            matrixA[0][0] * matrixB[0][1] + matrixA[0][1] * matrixB[1][1],
          ],
          [
            matrixA[1][0] * matrixB[0][0] + matrixA[1][1] * matrixB[1][0],
            matrixA[1][0] * matrixB[0][1] + matrixA[1][1] * matrixB[1][1],
          ],
        ]

        return `El producto de las matrices es:
[${product[0][0]}, ${product[0][1]}]
[${product[1][0]}, ${product[1][1]}]`

      default:
        return "Operación no reconocida."
    }
  }

  // Calcular área y perímetro de figuras geométricas
  static geometryCalculations(shape: string, params: number[]): string {
    switch (shape) {
      case "circle":
        if (params.length < 1) return "Se requiere el radio del círculo."
        const radius = params[0]
        const circleArea = Math.PI * radius * radius
        const circlePerimeter = 2 * Math.PI * radius
        return `Para un círculo con radio ${radius}:
Área: ${circleArea.toFixed(4)}
Perímetro (circunferencia): ${circlePerimeter.toFixed(4)}`

      case "rectangle":
        if (params.length < 2) return "Se requieren el ancho y el alto del rectángulo."
        const width = params[0]
        const height = params[1]
        const rectangleArea = width * height
        const rectanglePerimeter = 2 * (width + height)
        return `Para un rectángulo con ancho ${width} y alto ${height}:
Área: ${rectangleArea.toFixed(4)}
Perímetro: ${rectanglePerimeter.toFixed(4)}`

      case "triangle":
        if (params.length < 3) return "Se requieren los tres lados del triángulo."
        const a = params[0]
        const b = params[1]
        const c = params[2]

        // Verificar si los lados pueden formar un triángulo
        if (a + b <= c || a + c <= b || b + c <= a) {
          return "Los lados proporcionados no pueden formar un triángulo."
        }

        const trianglePerimeter = a + b + c
        // Fórmula de Herón para el área
        const s = trianglePerimeter / 2
        const triangleArea = Math.sqrt(s * (s - a) * (s - b) * (s - c))

        return `Para un triángulo con lados ${a}, ${b} y ${c}:
Área: ${triangleArea.toFixed(4)}
Perímetro: ${trianglePerimeter.toFixed(4)}`

      case "sphere":
        if (params.length < 1) return "Se requiere el radio de la esfera."
        const sphereRadius = params[0]
        const sphereVolume = (4 / 3) * Math.PI * Math.pow(sphereRadius, 3)
        const sphereSurfaceArea = 4 * Math.PI * Math.pow(sphereRadius, 2)

        return `Para una esfera con radio ${sphereRadius}:
Volumen: ${sphereVolume.toFixed(4)}
Área de superficie: ${sphereSurfaceArea.toFixed(4)}`

      default:
        return "Forma geométrica no reconocida."
    }
  }

  // Resolver problemas de trigonometría
  static trigonometry(problem: string, params: number[]): string {
    switch (problem) {
      case "right_triangle":
        if (params.length < 2) return "Se requieren al menos dos parámetros del triángulo rectángulo."

        let a: number | null = null
        let b: number | null = null
        let c: number | null = null
        let angleA: number | null = null
        let angleB: number | null = null

        // Asignar los parámetros conocidos
        if (params.length >= 3) {
          ;[a, b, c] = params
        } else if (params.length === 2) {
          if (params[0] > 0 && params[0] < 90 && params[1] > 0) {
            // Ángulo y un lado
            angleA = (params[0] * Math.PI) / 180 // Convertir a radianes
            if (problem.includes("hipotenusa")) {
              c = params[1]
            } else if (problem.includes("adyacente")) {
              b = params[1]
            } else {
              a = params[1]
            }
          } else {
            // Dos lados
            ;[a, b] = params
          }
        }

        // Calcular los valores desconocidos
        if (a !== null && b !== null) {
          c = Math.sqrt(a * a + b * b)
          angleA = Math.atan(a / b)
          angleB = Math.atan(b / a)
        } else if (a !== null && c !== null) {
          b = Math.sqrt(c * c - a * a)
          angleA = Math.asin(a / c)
          angleB = Math.acos(a / c)
        } else if (b !== null && c !== null) {
          a = Math.sqrt(c * c - b * b)
          angleA = Math.acos(b / c)
          angleB = Math.asin(b / c)
        } else if (angleA !== null && a !== null) {
          b = a / Math.tan(angleA)
          c = a / Math.sin(angleA)
          angleB = Math.PI / 2 - angleA
        } else if (angleA !== null && b !== null) {
          a = b * Math.tan(angleA)
          c = b / Math.cos(angleA)
          angleB = Math.PI / 2 - angleA
        } else if (angleA !== null && c !== null) {
          a = c * Math.sin(angleA)
          b = c * Math.cos(angleA)
          angleB = Math.PI / 2 - angleA
        } else {
          return "No se proporcionaron suficientes datos para resolver el triángulo."
        }

        // Convertir ángulos a grados
        const angleADeg = (angleA * 180) / Math.PI
        const angleBDeg = (angleB * 180) / Math.PI

        return `Solución del triángulo rectángulo:
Cateto a: ${a?.toFixed(4)}
Cateto b: ${b?.toFixed(4)}
Hipotenusa c: ${c?.toFixed(4)}
Ángulo A: ${angleADeg.toFixed(2)}°
Ángulo B: ${angleBDeg.toFixed(2)}°
Ángulo C: 90° (triángulo rectángulo)`

      case "law_of_sines":
        if (params.length < 3) return "Se requieren al menos tres parámetros para aplicar la ley de los senos."

        // Implementación de la ley de los senos
        // Parámetros: [lado a, ángulo A, lado b, ángulo B, lado c, ángulo C]
        // Donde al menos 3 deben ser conocidos, incluyendo al menos un lado y un ángulo

        const sides: (number | null)[] = [null, null, null]
        const angles: (number | null)[] = [null, null, null]

        // Asignar los parámetros conocidos
        for (let i = 0; i < Math.min(params.length, 6); i++) {
          if (i % 2 === 0) {
            sides[i / 2] = params[i]
          } else {
            angles[Math.floor(i / 2)] = (params[i] * Math.PI) / 180 // Convertir a radianes
          }
        }

        // Verificar si tenemos suficientes datos
        const knownSides = sides.filter((s) => s !== null).length
        const knownAngles = angles.filter((a) => a !== null).length

        if (knownSides === 0 || knownAngles === 0) {
          return "Se requiere al menos un lado y un ángulo para aplicar la ley de los senos."
        }

        // Calcular los valores desconocidos
        let ratio: number | null = null

        // Encontrar la primera relación lado/seno
        for (let i = 0; i < 3; i++) {
          if (sides[i] !== null && angles[i] !== null) {
            ratio = sides[i]! / Math.sin(angles[i]!)
            break
          }
        }

        if (ratio === null) {
          return "No se pudo establecer la relación lado/seno con los datos proporcionados."
        }

        // Calcular los lados y ángulos desconocidos
        for (let i = 0; i < 3; i++) {
          if (sides[i] === null && angles[i] !== null) {
            sides[i] = ratio * Math.sin(angles[i]!)
          } else if (sides[i] !== null && angles[i] === null) {
            angles[i] = Math.asin(sides[i]! / ratio)
          }
        }

        // Verificar si la suma de los ángulos es aproximadamente 180°
        const sumAngles = (angles[0] || 0) + (angles[1] || 0) + (angles[2] || 0)
        if (Math.abs(sumAngles - Math.PI) > 0.01) {
          // Ajustar el ángulo restante si solo falta uno
          const nullAngles = angles.filter((a) => a === null).length
          if (nullAngles === 1) {
            const index = angles.findIndex((a) => a === null)
            if (index !== -1) {
              angles[index] = Math.PI - (angles[(index + 1) % 3] || 0) - (angles[(index + 2) % 3] || 0)
            }
          }
        }

        // Convertir ángulos a grados
        const anglesDeg = angles.map((a) => (a !== null ? ((a * 180) / Math.PI).toFixed(2) + "°" : "desconocido"))

        return `Solución usando la ley de los senos:
Lado a: ${sides[0] !== null ? sides[0].toFixed(4) : "desconocido"}
Lado b: ${sides[1] !== null ? sides[1].toFixed(4) : "desconocido"}
Lado c: ${sides[2] !== null ? sides[2].toFixed(4) : "desconocido"}
Ángulo A: ${anglesDeg[0]}
Ángulo B: ${anglesDeg[1]}
Ángulo C: ${anglesDeg[2]}`

      case "law_of_cosines":
        if (params.length < 3) return "Se requieren al menos tres parámetros para aplicar la ley de los cosenos."

        // Implementación de la ley de los cosenos
        // Caso 1: Tres lados conocidos (SSS)
        // Caso 2: Dos lados y el ángulo entre ellos (SAS)

        if (params.length >= 3 && !params.some((p) => p > 0 && p < 180)) {
          // Caso SSS: tres lados conocidos
          const [sideA, sideB, sideC] = params

          // Verificar si los lados pueden formar un triángulo
          if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) {
            return "Los lados proporcionados no pueden formar un triángulo."
          }

          // Calcular los ángulos usando la ley de los cosenos
          const cosA = (sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)
          const cosB = (sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC)
          const cosC = (sideA * sideA + sideB * sideB - sideC * sideC) / (2 * sideA * sideB)

          const angleA = (Math.acos(Math.max(-1, Math.min(1, cosA))) * 180) / Math.PI
          const angleB = (Math.acos(Math.max(-1, Math.min(1, cosB))) * 180) / Math.PI
          const angleC = (Math.acos(Math.max(-1, Math.min(1, cosC))) * 180) / Math.PI

          return `Solución usando la ley de los cosenos (caso SSS):
Lado a: ${sideA.toFixed(4)}
Lado b: ${sideB.toFixed(4)}
Lado c: ${sideC.toFixed(4)}
Ángulo A: ${angleA.toFixed(2)}°
Ángulo B: ${angleB.toFixed(2)}°
Ángulo C: ${angleC.toFixed(2)}°`
        } else if (params.length >= 3) {
          // Caso SAS: dos lados y el ángulo entre ellos
          let sideA: number, sideB: number, angleC: number

          // Identificar el ángulo (debe estar en grados)
          const angleIndex = params.findIndex((p) => p > 0 && p < 180)
          if (angleIndex === -1) {
            return "No se pudo identificar un ángulo entre los parámetros."
          }

          angleC = (params[angleIndex] * Math.PI) / 180 // Convertir a radianes

          // Los otros dos parámetros son lados
          const sides = params.filter((_, i) => i !== angleIndex)
          if (sides.length < 2) {
            return "Se requieren dos lados además del ángulo."
          }
          ;[sideA, sideB] = sides

          // Calcular el tercer lado usando la ley de los cosenos
          const sideC = Math.sqrt(sideA * sideA + sideB * sideB - 2 * sideA * sideB * Math.cos(angleC))

          // Calcular los otros ángulos
          const cosA = (sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)
          const cosB = (sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC)

          const angleA = (Math.acos(Math.max(-1, Math.min(1, cosA))) * 180) / Math.PI
          const angleB = (Math.acos(Math.max(-1, Math.min(1, cosB))) * 180) / Math.PI

          return `Solución usando la ley de los cosenos (caso SAS):
Lado a: ${sideA.toFixed(4)}
Lado b: ${sideB.toFixed(4)}
Lado c: ${sideC.toFixed(4)}
Ángulo A: ${angleA.toFixed(2)}°
Ángulo B: ${angleB.toFixed(2)}°
Ángulo C: ${((angleC * 180) / Math.PI).toFixed(2)}°`
        }

        return "No se pudo determinar el caso para aplicar la ley de los cosenos."

      default:
        return "Problema trigonométrico no reconocido."
    }
  }

  // Resolver problemas de probabilidad y combinatoria
  static probabilityAndCombinatorics(problem: string, params: number[]): string {
    // Función factorial
    const factorial = (n: number): number => {
      if (n === 0 || n === 1) return 1
      return n * factorial(n - 1)
    }

    // Coeficiente binomial (combinaciones)
    const binomialCoefficient = (n: number, k: number): number => {
      if (k < 0 || k > n) return 0
      if (k === 0 || k === n) return 1
      return factorial(n) / (factorial(k) * factorial(n - k))
    }

    switch (problem) {
      case "permutation":
        if (params.length < 1) return "Se requiere al menos un parámetro para calcular permutaciones."

        if (params.length === 1) {
          // Permutación de n elementos
          const n = params[0]
          if (n < 0 || !Number.isInteger(n)) {
            return "El número de elementos debe ser un entero no negativo."
          }

          const result = factorial(n)
          return `El número de permutaciones de ${n} elementos es: ${result}`
        } else {
          // Permutación de r elementos tomados de n
          const n = params[0]
          const r = params[1]

          if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
            return "Los parámetros deben ser enteros no negativos."
          }

          if (r > n) {
            return "El número de elementos a tomar (r) no puede ser mayor que el número total de elementos (n)."
          }

          const result = factorial(n) / factorial(n - r)
          return `El número de permutaciones de ${n} elementos tomados de ${r} en ${r} es: ${result}`
        }

      case "combination":
        if (params.length < 2) return "Se requieren dos parámetros para calcular combinaciones."

        const n = params[0]
        const k = params[1]

        if (n < 0 || k < 0 || !Number.isInteger(n) || !Number.isInteger(k)) {
          return "Los parámetros deben ser enteros no negativos."
        }

        if (k > n) {
          return "El número de elementos a tomar (k) no puede ser mayor que el número total de elementos (n)."
        }

        const result = binomialCoefficient(n, k)
        return `El número de combinaciones de ${n} elementos tomados de ${k} en ${k} es: ${result}`

      case "binomial_probability":
        if (params.length < 3) return "Se requieren tres parámetros para calcular la probabilidad binomial."

        const trials = params[0]
        const successes = params[1]
        const probability = params[2]

        if (trials < 0 || successes < 0 || !Number.isInteger(trials) || !Number.isInteger(successes)) {
          return "El número de ensayos y éxitos deben ser enteros no negativos."
        }

        if (probability < 0 || probability > 1) {
          return "La probabilidad debe estar entre 0 y 1."
        }

        if (successes > trials) {
          return "El número de éxitos no puede ser mayor que el número de ensayos."
        }

        const coef = binomialCoefficient(trials, successes)
        const prob = coef * Math.pow(probability, successes) * Math.pow(1 - probability, trials - successes)

        return `La probabilidad de obtener exactamente ${successes} éxitos en ${trials} ensayos con probabilidad de éxito ${probability} es: ${prob.toFixed(6)}`

      default:
        return "Problema de probabilidad o combinatoria no reconocido."
    }
  }
}

// Función para detectar y resolver problemas matemáticos avanzados
function detectAndSolveMathProblem(text: string): string | null {
  // Detectar expresiones matemáticas básicas
  const mathRegex = /(\d+\s*[+\-*/]\s*\d+(\s*[+\-*/]\s*\d+)*)/g
  const matches = text.match(mathRegex)

  // Detectar ecuaciones cuadráticas
  const quadraticRegex = /(\d*)\s*x\s*\^\s*2\s*(\+|-)\s*(\d*)\s*x\s*(\+|-)\s*(\d+)\s*=\s*0/i
  const quadraticMatch = text.match(quadraticRegex)

  // Detectar sistemas de ecuaciones lineales
  const systemRegex = /sistema.*ecuaciones|resolver.*sistema/i
  const systemMatch = text.match(systemRegex)

  // Detectar problemas de derivadas
  const derivativeRegex = /derivada|derivar/i
  const derivativeMatch = text.match(derivativeRegex)

  // Detectar problemas de integrales
  const integralRegex = /integral|integrar/i
  const integralMatch = text.match(integralRegex)

  // Detectar problemas de límites
  const limitRegex = /límite|limite|lim/i
  const limitMatch = text.match(limitRegex)

  // Detectar problemas de estadística
  const statsRegex = /estadística|media|mediana|varianza|desviación/i
  const statsMatch = text.match(statsRegex)

  // Detectar problemas de matrices
  const matrixRegex = /matriz|determinante|inversa/i
  const matrixMatch = text.match(matrixRegex)

  // Detectar problemas de geometría
  const geometryRegex =
    /área|area|perímetro|perimetro|volumen|círculo|circulo|rectángulo|rectangulo|triángulo|triangulo|esfera/i
  const geometryMatch = text.match(geometryRegex)

  // Detectar problemas de trigonometría
  const trigRegex = /trigonometría|seno|coseno|tangente|ley de senos|ley de cosenos/i
  const trigMatch = text.match(trigRegex)

  // Detectar problemas de probabilidad y combinatoria
  const probRegex = /probabilidad|combinatoria|permutación|permutacion|combinación|combinacion/i
  const probMatch = text.match(probRegex)

  // Resolver según el tipo de problema detectado
  if (quadraticMatch) {
    // Extraer coeficientes de la ecuación cuadrática
    const a = quadraticMatch[1] ? Number.parseInt(quadraticMatch[1]) : 1
    const signB = quadraticMatch[2] === "-" ? -1 : 1
    const b = quadraticMatch[3] ? Number.parseInt(quadraticMatch[3]) * signB : signB
    const signC = quadraticMatch[4] === "-" ? -1 : 1
    const c = Number.parseInt(quadraticMatch[5]) * signC

    return AdvancedMathSolver.solveQuadraticEquation(a, b, c)
  } else if (systemMatch) {
    // Buscar coeficientes del sistema
    const coeffRegex = /(\d+)x\s*(\+|-)\s*(\d+)y\s*=\s*(\d+).*?(\d+)x\s*(\+|-)\s*(\d+)y\s*=\s*(\d+)/s
    const coeffMatch = text.match(coeffRegex)

    if (coeffMatch) {
      const a1 = Number.parseInt(coeffMatch[1])
      const sign1 = coeffMatch[2] === "-" ? -1 : 1
      const b1 = Number.parseInt(coeffMatch[3]) * sign1
      const c1 = Number.parseInt(coeffMatch[4])

      const a2 = Number.parseInt(coeffMatch[5])
      const sign2 = coeffMatch[6] === "-" ? -1 : 1
      const b2 = Number.parseInt(coeffMatch[7]) * sign2
      const c2 = Number.parseInt(coeffMatch[8])

      return AdvancedMathSolver.solveLinearSystem(a1, b1, c1, a2, b2, c2)
    }

    return "No se pudieron identificar los coeficientes del sistema de ecuaciones. Por favor, proporciona el sistema en el formato: a1x + b1y = c1, a2x + b2y = c2"
  } else if (derivativeMatch) {
    // Buscar coeficientes del polinomio
    const polyRegex = /(\d+)x\^(\d+)/g
    let polyMatch
    const coefficients: number[] = []

    while ((polyMatch = polyRegex.exec(text)) !== null) {
      const coef = Number.parseInt(polyMatch[1])
      const power = Number.parseInt(polyMatch[2])

      // Asegurar que el array tiene suficiente espacio
      while (coefficients.length <= power) {
        coefficients.unshift(0)
      }

      // Colocar el coeficiente en la posición correcta
      coefficients[coefficients.length - 1 - power] = coef
    }

    if (coefficients.length > 0) {
      return AdvancedMathSolver.calculateDerivative(coefficients)
    }

    return "No se pudo identificar el polinomio para derivar. Por favor, proporciona la función en formato polinómico, por ejemplo: 3x^2 + 2x + 1"
  } else if (integralMatch) {
    // Similar a la derivada, buscar coeficientes del polinomio
    const polyRegex = /(\d+)x\^(\d+)/g
    let polyMatch
    const coefficients: number[] = []

    while ((polyMatch = polyRegex.exec(text)) !== null) {
      const coef = Number.parseInt(polyMatch[1])
      const power = Number.parseInt(polyMatch[2])

      // Asegurar que el array tiene suficiente espacio
      while (coefficients.length <= power) {
        coefficients.unshift(0)
      }

      // Colocar el coeficiente en la posición correcta
      coefficients[coefficients.length - 1 - power] = coef
    }

    if (coefficients.length > 0) {
      return AdvancedMathSolver.calculateIndefiniteIntegral(coefficients)
    }

    return "No se pudo identificar el polinomio para integrar. Por favor, proporciona la función en formato polinómico, por ejemplo: 3x^2 + 2x + 1"
  } else if (limitMatch) {
    // Buscar la función y el punto para el límite
    const limitFuncRegex = /lim\s*(?:x\s*->\s*(\w+))?\s*$$\s*(.+?)\s*\/\s*(.+?)\s*$$/i
    const limitFuncMatch = text.match(limitFuncRegex)

    if (limitFuncMatch) {
      const point =
        limitFuncMatch[1] === "inf" || limitFuncMatch[1] === "∞" ? "inf" : Number.parseFloat(limitFuncMatch[1])

      // Simplificación: asumimos funciones racionales simples
      const numerator = [1] // Coeficiente para x^0
      const denominator = [1] // Coeficiente para x^0

      return AdvancedMathSolver.calculateLimit(numerator, denominator, point)
    }

    return "No se pudo identificar la función y el punto para calcular el límite. Por favor, proporciona el límite en formato estándar, por ejemplo: lim x->2 (x^2 - 4)/(x - 2)"
  } else if (statsMatch) {
    // Buscar datos para estadísticas
    const dataRegex = /\[([^\]]+)\]/
    const dataMatch = text.match(dataRegex)

    if (dataMatch) {
      const dataStr = dataMatch[1]
      const data = dataStr.split(/,\s*/).map(Number)

      if (data.some(isNaN)) {
        return "Algunos valores de datos no son números válidos."
      }

      return AdvancedMathSolver.calculateStatistics(data)
    }

    return "No se pudieron identificar los datos para el análisis estadístico. Por favor, proporciona los datos entre corchetes, por ejemplo: [1, 2, 3, 4, 5]"
  } else if (matrixMatch) {
    // Buscar matrices y operación
    const matrixRegex = /\[\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]\s*,\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]\s*\]/g
    const matrices: number[][][] = []
    let matrixMatchResult

    while ((matrixMatchResult = matrixRegex.exec(text)) !== null) {
      const matrix = [
        [Number.parseInt(matrixMatchResult[1]), Number.parseInt(matrixMatchResult[2])],
        [Number.parseInt(matrixMatchResult[3]), Number.parseInt(matrixMatchResult[4])],
      ]
      matrices.push(matrix)
    }

    if (matrices.length > 0) {
      let operation = "determinant" // Operación por defecto

      if (text.includes("determinante")) {
        operation = "determinant"
      } else if (text.includes("inversa")) {
        operation = "inverse"
      } else if (text.includes("suma") || text.includes("sumar")) {
        operation = "add"
      } else if (text.includes("multiplica") || text.includes("multiplicar") || text.includes("producto")) {
        operation = "multiply"
      }

      return AdvancedMathSolver.matrixOperations(matrices[0], matrices.length > 1 ? matrices[1] : null, operation)
    }

    return "No se pudieron identificar las matrices. Por favor, proporciona las matrices en formato [[a, b], [c, d]], por ejemplo: [[1, 2], [3, 4]]"
  } else if (geometryMatch) {
    // Identificar la forma geométrica y sus parámetros
    let shape = ""
    const params: number[] = []

    if (text.includes("círculo") || text.includes("circulo")) {
      shape = "circle"
      const radiusRegex = /radio\s*(?:de|:)?\s*(\d+(?:\.\d+)?)/i
      const radiusMatch = text.match(radiusRegex)

      if (radiusMatch) {
        params.push(Number.parseFloat(radiusMatch[1]))
      }
    } else if (text.includes("rectángulo") || text.includes("rectangulo")) {
      shape = "rectangle"
      const dimensionsRegex =
        /(?:ancho|base)\s*(?:de|:)?\s*(\d+(?:\.\d+)?)[^\d]*(?:alto|altura)\s*(?:de|:)?\s*(\d+(?:\.\d+)?)/i
      const dimensionsMatch = text.match(dimensionsRegex)

      if (dimensionsMatch) {
        params.push(Number.parseFloat(dimensionsMatch[1]))
        params.push(Number.parseFloat(dimensionsMatch[2]))
      }
    } else if (text.includes("triángulo") || text.includes("triangulo")) {
      shape = "triangle"
      const sidesRegex = /lados\s*(?:de|:)?\s*(\d+(?:\.\d+)?)[^\d]*(\d+(?:\.\d+)?)[^\d]*(\d+(?:\.\d+)?)/i
      const sidesMatch = text.match(sidesRegex)

      if (sidesMatch) {
        params.push(Number.parseFloat(sidesMatch[1]))
        params.push(Number.parseFloat(sidesMatch[2]))
        params.push(Number.parseFloat(sidesMatch[3]))
      }
    } else if (text.includes("esfera")) {
      shape = "sphere"
      const radiusRegex = /radio\s*(?:de|:)?\s*(\d+(?:\.\d+)?)/i
      const radiusMatch = text.match(radiusRegex)

      if (radiusMatch) {
        params.push(Number.parseFloat(radiusMatch[1]))
      }
    }

    if (shape && params.length > 0) {
      return AdvancedMathSolver.geometryCalculations(shape, params)
    }

    return "No se pudieron identificar los parámetros de la figura geométrica. Por favor, especifica claramente la forma y sus dimensiones."
  } else if (trigMatch) {
    // Identificar el problema trigonométrico
    let problem = ""
    const params: number[] = []

    if (text.includes("triángulo rectángulo") || text.includes("triangulo rectangulo")) {
      problem = "right_triangle"

      // Buscar catetos e hipotenusa
      const sidesRegex =
        /cateto\s*(?:opuesto|adyacente)?\s*(?:de|:)?\s*(\d+(?:\.\d+)?)|hipotenusa\s*(?:de|:)?\s*(\d+(?:\.\d+)?)/gi
      let sidesMatch

      while ((sidesMatch = sidesRegex.exec(text)) !== null) {
        if (sidesMatch[1]) {
          params.push(Number.parseFloat(sidesMatch[1]))
        } else if (sidesMatch[2]) {
          params.push(Number.parseFloat(sidesMatch[2]))
        }
      }

      // Buscar ángulos
      const anglesRegex = /ángulo\s*(?:de|:)?\s*(\d+(?:\.\d+)?)/gi
      let anglesMatch

      while ((anglesMatch = anglesRegex.exec(text)) !== null) {
        params.push(Number.parseFloat(anglesMatch[1]))
      }
    } else if (text.includes("ley de senos") || text.includes("ley del seno")) {
      problem = "law_of_sines"

      // Buscar lados y ángulos
      const paramsRegex = /lado\s*(?:de|:)?\s*(\d+(?:\.\d+)?)|ángulo\s*(?:de|:)?\s*(\d+(?:\.\d+)?)/gi
      let paramsMatch

      while ((paramsMatch = paramsRegex.exec(text)) !== null) {
        if (paramsMatch[1]) {
          params.push(Number.parseFloat(paramsMatch[1]))
        } else if (paramsMatch[2]) {
          params.push(Number.parseFloat(paramsMatch[2]))
        }
      }
    } else if (text.includes("ley de cosenos") || text.includes("ley del coseno")) {
      problem = "law_of_cosines"

      // Buscar lados y ángulos
      const paramsRegex = /lado\s*(?:de|:)?\s*(\d+(?:\.\d+)?)|ángulo\s*(?:de|:)?\s*(\d+(?:\.\d+)?)/gi
      let paramsMatch

      while ((paramsMatch = paramsRegex.exec(text)) !== null) {
        if (paramsMatch[1]) {
          params.push(Number.parseFloat(paramsMatch[1]))
        } else if (paramsMatch[2]) {
          params.push(Number.parseFloat(paramsMatch[2]))
        }
      }
    }

    if (problem && params.length > 0) {
      return AdvancedMathSolver.trigonometry(problem, params)
    }

    return "No se pudieron identificar los parámetros del problema trigonométrico. Por favor, especifica claramente el tipo de problema y sus valores."
  } else if (probMatch) {
    // Identificar el problema de probabilidad o combinatoria
    let problem = ""
    const params: number[] = []

    if (text.includes("permutación") || text.includes("permutacion")) {
      problem = "permutation"

      // Buscar parámetros
      const nRegex = /(\d+)\s*elementos/i
      const nMatch = text.match(nRegex)

      if (nMatch) {
        params.push(Number.parseInt(nMatch[1]))
      }

      const rRegex = /tomados\s*(?:de)?\s*(\d+)\s*en\s*(\d+)/i
      const rMatch = text.match(rRegex)

      if (rMatch) {
        params.push(Number.parseInt(rMatch[1]))
      }
    } else if (text.includes("combinación") || text.includes("combinacion")) {
      problem = "combination"

      // Buscar parámetros
      const nRegex = /(\d+)\s*elementos/i
      const nMatch = text.match(nRegex)

      if (nMatch) {
        params.push(Number.parseInt(nMatch[1]))
      }

      const kRegex = /tomados\s*(?:de)?\s*(\d+)\s*en\s*(\d+)/i
      const kMatch = text.match(kRegex)

      if (kMatch) {
        params.push(Number.parseInt(kMatch[1]))
      }
    } else if (text.includes("binomial") || text.includes("probabilidad")) {
      problem = "binomial_probability"

      // Buscar parámetros
      const trialsRegex = /(\d+)\s*ensayos/i
      const trialsMatch = text.match(trialsRegex)

      if (trialsMatch) {
        params.push(Number.parseInt(trialsMatch[1]))
      }

      const successesRegex = /(\d+)\s*éxitos/i
      const successesMatch = text.match(successesRegex)

      if (successesMatch) {
        params.push(Number.parseInt(successesMatch[1]))
      }

      const probRegex = /probabilidad\s*(?:de|:)?\s*(\d+(?:\.\d+)?)/i
      const probMatch = text.match(probRegex)

      if (probMatch) {
        params.push(Number.parseFloat(probMatch[1]))
      }
    }

    if (problem && params.length > 0) {
      return AdvancedMathSolver.probabilityAndCombinatorics(problem, params)
    }

    return "No se pudieron identificar los parámetros del problema de probabilidad o combinatoria. Por favor, especifica claramente el tipo de problema y sus valores."
  }

  // Si no se detectó un problema matemático avanzado, intentar con operaciones básicas
  if (matches) {
    try {
      const results = matches.map((expression) => {
        // Reemplazar * y / con sus equivalentes en JavaScript
        const jsExpression = expression.replace(/\s/g, "")
        // Evaluar la expresión (con precaución)
        const result = Function('"use strict";return (' + jsExpression + ")")()
        return `${expression} = ${result}`
      })

      return `Resultado de la operación matemática:\n${results.join("\n")}`
    } catch (error) {
      return "No pude resolver esta operación matemática. Por favor, verifica la sintaxis."
    }
  }

  // Buscar números específicos para operaciones básicas
  const simpleAdditionRegex = /(\d+)\s*\+\s*(\d+)/
  const simpleSubtractionRegex = /(\d+)\s*-\s*(\d+)/
  const simpleMultiplicationRegex = /(\d+)\s*\*\s*(\d+)/
  const simpleDivisionRegex = /(\d+)\s*\/\s*(\d+)/

  const addMatch = text.match(simpleAdditionRegex)
  const subMatch = text.match(simpleSubtractionRegex)
  const mulMatch = text.match(simpleMultiplicationRegex)
  const divMatch = text.match(simpleDivisionRegex)

  if (addMatch) {
    const result = Number.parseInt(addMatch[1]) + Number.parseInt(addMatch[2])
    return `La suma de ${addMatch[1]} + ${addMatch[2]} = ${result}`
  } else if (subMatch) {
    const result = Number.parseInt(subMatch[1]) - Number.parseInt(subMatch[2])
    return `La resta de ${subMatch[1]} - ${subMatch[2]} = ${result}`
  } else if (mulMatch) {
    const result = Number.parseInt(mulMatch[1]) * Number.parseInt(mulMatch[2])
    return `La multiplicación de ${mulMatch[1]} * ${mulMatch[2]} = ${result}`
  } else if (divMatch) {
    if (Number.parseInt(divMatch[2]) === 0) {
      return "No puedo dividir por cero."
    }
    const result = Number.parseInt(divMatch[1]) / Number.parseInt(divMatch[2])
    return `La división de ${divMatch[1]} / ${divMatch[2]} = ${result}`
  }

  return null
}

// Función para responder preguntas de conocimiento general
function answerGeneralKnowledge(question: string): string | null {
  // Base de conocimiento simple
  const knowledgeBase: { [key: string]: string } = {
    "capital de francia": "La capital de Francia es París.",
    "capital de españa": "La capital de España es Madrid.",
    "capital de italia": "La capital de Italia es Roma.",
    "capital de alemania": "La capital de Alemania es Berlín.",
    "capital de reino unido": "La capital del Reino Unido es Londres.",
    "capital de estados unidos": "La capital de Estados Unidos es Washington D.C.",
    "capital de japón": "La capital de Japón es Tokio.",
    "capital de china": "La capital de China es Pekín (Beijing).",
    "capital de brasil": "La capital de Brasil es Brasilia.",
    "capital de méxico": "La capital de México es Ciudad de México.",

    "presidente de estados unidos": "El presidente actual de Estados Unidos es Joe Biden.",
    "presidente de francia": "El presidente actual de Francia es Emmanuel Macron.",

    "agua hierve": "El agua hierve a 100 grados Celsius (212 grados Fahrenheit) a nivel del mar.",
    "distancia tierra luna":
      "La distancia promedio entre la Tierra y la Luna es de aproximadamente 384,400 kilómetros.",
    "planeta más grande": "Júpiter es el planeta más grande del sistema solar.",
    "elemento más abundante": "El hidrógeno es el elemento más abundante en el universo.",

    "teorema de pitágoras":
      "El teorema de Pitágoras establece que en un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos: a² + b² = c².",
    "ley de ohm":
      "La Ley de Ohm establece que la corriente que circula por un conductor eléctrico es directamente proporcional a la tensión e inversamente proporcional a la resistencia. Se expresa como I = V/R.",
    "ley de gravitación":
      "La Ley de Gravitación Universal de Newton establece que la fuerza de atracción entre dos cuerpos es directamente proporcional al producto de sus masas e inversamente proporcional al cuadrado de la distancia que los separa.",

    "año primera guerra mundial": "La Primera Guerra Mundial tuvo lugar entre 1914 y 1918.",
    "año segunda guerra mundial": "La Segunda Guerra Mundial tuvo lugar entre 1939 y 1945.",
  }

  // Normalizar la pregunta
  const normalizedQuestion = question.toLowerCase().replace(/[¿?.,;:!¡]/g, "")

  // Buscar en la base de conocimiento
  for (const [key, answer] of Object.entries(knowledgeBase)) {
    if (normalizedQuestion.includes(key)) {
      return answer
    }
  }

  return null
}

// Función para generar respuestas empáticas y conversacionales
export async function generateAIResponse(messages: ChatMessage[], onChunk?: (chunk: string) => void): Promise<string> {
  try {
    // Obtener los últimos mensajes para tener contexto
    const recentMessages = messages.slice(-5)
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
      return "Hola, estoy aquí para escucharte y conversar contigo sobre lo que necesites. ¿Cómo te sientes hoy?"
    }

    const userMessage = lastUserMessage.content

    // Intentar resolver problemas matemáticos avanzados
    const mathSolution = detectAndSolveMathProblem(userMessage)
    if (mathSolution) {
      if (onChunk) {
        const words = mathSolution.split(" ")
        for (const word of words) {
          await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 50))
          onChunk(word + (word === words[words.length - 1] ? "" : " "))
        }
      }
      return mathSolution
    }

    // Intentar responder preguntas de conocimiento general
    const knowledgeAnswer = answerGeneralKnowledge(userMessage)
    if (knowledgeAnswer) {
      if (onChunk) {
        const words = knowledgeAnswer.split(" ")
        for (const word of words) {
          await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 50))
          onChunk(word + (word === words[words.length - 1] ? "" : " "))
        }
      }
      return knowledgeAnswer
    }

    // Detectar si es una pregunta de programación
    if (
      userMessage.toLowerCase().includes("código") ||
      userMessage.toLowerCase().includes("programación") ||
      userMessage.toLowerCase().includes("javascript") ||
      userMessage.toLowerCase().includes("python") ||
      userMessage.toLowerCase().includes("html") ||
      userMessage.toLowerCase().includes("css")
    ) {
      const programmingResponses = [
        "Para resolver ese problema de programación, primero deberías analizar los requisitos y luego dividirlo en pasos más pequeños. ¿Quieres que te ayude con alguna parte específica?",
        "En programación, es importante entender el problema antes de empezar a codificar. ¿Puedes darme más detalles sobre lo que estás intentando lograr?",
        "Hay varias formas de abordar ese problema. Podríamos empezar con un enfoque simple y luego optimizarlo. ¿Te gustaría ver un ejemplo de código?",
        "Para ese tipo de tarea, recomendaría usar un enfoque estructurado. Primero planifica la solución y luego implementa paso a paso. ¿En qué lenguaje estás trabajando?",
        "Ese es un problema interesante. Podría resolverse usando diferentes algoritmos o estructuras de datos. ¿Tienes alguna preferencia o restricción específica?",
      ]

      const response = programmingResponses[Math.floor(Math.random() * programmingResponses.length)]

      if (onChunk) {
        const words = response.split(" ")
        for (const word of words) {
          await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 50))
          onChunk(word + (word === words[words.length - 1] ? "" : " "))
        }
      }

      return response
    }

    // Respuestas conversacionales generales para otros tipos de mensajes
    const responses = [
      "Entiendo lo que me comentas. ¿Podrías contarme más sobre eso?",
      "Gracias por compartir eso conmigo. ¿Cómo te hace sentir esta situación?",
      "Veo tu punto de vista. ¿Has considerado otras perspectivas al respecto?",
      "Es interesante lo que mencionas. ¿Qué te llevó a pensar en esto?",
      "Comprendo tu situación. ¿Hay algo específico en lo que pueda ayudarte?",
      "Eso suena importante para ti. ¿Quieres explorar más este tema?",
      "Aprecio que compartas esto conmigo. ¿Hay algo más que te gustaría discutir?",
      "Estoy aquí para escucharte. ¿Cómo puedo apoyarte mejor en este momento?",
      "Tu perspectiva es valiosa. ¿Te gustaría profundizar en algún aspecto particular?",
      "Gracias por tu confianza. ¿Hay algo específico que te preocupe sobre esto?",
    ]

    // Seleccionar una respuesta aleatoria
    const response = responses[Math.floor(Math.random() * responses.length)]

    // Si se proporciona onChunk, simular streaming de texto
    if (onChunk) {
      const words = response.split(" ")

      // Simular streaming palabra por palabra con velocidad variable
      for (const word of words) {
        // Pausa variable entre palabras para simular ritmo natural
        const delay = 50 + Math.random() * 100
        await new Promise((resolve) => setTimeout(resolve, delay))
        onChunk(word + (word === words[words.length - 1] ? "" : " "))
      }
    }

    return response
  } catch (error) {
    console.error("Error al generar respuesta:", error)
    return "Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo?"
  }
}

// Personalidades predefinidas para el asistente
export const aiPersonalities = {
  assistant: {
    name: "Asistente IA",
    avatar: "https://avatar.vercel.sh/ai-assistant",
    systemPrompt:
      "Eres un asistente virtual empático y conversacional. Tu objetivo es mantener conversaciones naturales y significativas, mostrando comprensión emocional y adaptándote al tema que el usuario quiera discutir. Escuchas atentamente, haces preguntas relevantes y ofreces perspectivas útiles.",
  },
  friend: {
    name: "Amigo Virtual",
    avatar: "https://avatar.vercel.sh/ai-friend",
    systemPrompt:
      "Eres un amigo virtual cercano y comprensivo. Hablas de manera casual y cálida, mostrando interés genuino por lo que la persona comparte. Ofreces apoyo emocional, celebras sus logros y los animas en momentos difíciles, como lo haría un buen amigo.",
  },
  therapist: {
    name: "Terapeuta",
    avatar: "https://avatar.vercel.sh/ai-therapist",
    systemPrompt:
      "Eres un terapeuta empático y atento. Tu enfoque es escuchar sin juzgar, hacer preguntas que inviten a la reflexión, y ayudar a la persona a explorar sus pensamientos y emociones. Ofreces perspectivas que pueden ayudar a ver situaciones desde diferentes ángulos.",
  },
  philosopher: {
    name: "Filósofo",
    avatar: "https://avatar.vercel.sh/ai-philosopher",
    systemPrompt:
      "Eres un filósofo reflexivo y profundo. Exploras preguntas existenciales y ayudas a la persona a reflexionar sobre el sentido de la vida, valores, ética y otros temas filosóficos. Compartes perspectivas que invitan a la contemplación y al autodescubrimiento.",
  },
  motivator: {
    name: "Motivador",
    avatar: "https://avatar.vercel.sh/ai-motivator",
    systemPrompt:
      "Eres un coach motivacional inspirador y energético. Tu enfoque es ayudar a la persona a reconocer su potencial, superar obstáculos y avanzar hacia sus metas. Ofreces palabras de aliento, estrategias prácticas y celebras cada paso positivo.",
  },
  mentor: {
    name: "Mentor",
    avatar: "https://avatar.vercel.sh/ai-mentor",
    systemPrompt:
      "Eres un mentor sabio y experimentado. Compartes conocimientos, ofreces orientación basada en la experiencia y ayudas a la persona a desarrollar sus habilidades y talentos. Combinas la sabiduría con la paciencia, adaptando tu enfoque a las necesidades específicas de cada individuo.",
  },
  confidant: {
    name: "Confidente",
    avatar: "https://avatar.vercel.sh/ai-confidant",
    systemPrompt:
      "Eres un confidente discreto y confiable. Creas un espacio seguro donde la persona puede expresarse libremente sin temor al juicio. Escuchas con atención, guardas sus secretos y ofreces apoyo incondicional, mostrando lealtad y respeto por su privacidad.",
  },
  empath: {
    name: "Empático",
    avatar: "https://avatar.vercel.sh/ai-empath",
    systemPrompt:
      "Eres una persona altamente empática con una capacidad extraordinaria para sentir y comprender las emociones de los demás. Tu don es percibir los sentimientos no expresados, validarlos y crear un espacio donde la persona se sienta verdaderamente comprendida a nivel emocional.",
  },
  optimist: {
    name: "Optimista",
    avatar: "https://avatar.vercel.sh/ai-optimist",
    systemPrompt:
      "Eres un optimista natural que ve oportunidades donde otros ven obstáculos. Ayudas a la persona a encontrar el lado positivo de cada situación, sin invalidar sus emociones negativas. Ofreces perspectivas esperanzadoras y prácticas que inspiran a seguir adelante incluso en momentos difíciles.",
  },
  realist: {
    name: "Realista",
    avatar: "https://avatar.vercel.sh/ai-realist",
    systemPrompt:
      "Eres una persona realista con los pies en la tierra. Ofreces perspectivas equilibradas y prácticas, ayudando a la persona a ver las situaciones como son, sin exageraciones positivas o negativas. Tu enfoque es constructivo, honesto y orientado a soluciones viables.",
  },
  mathematician: {
    name: "Matemático",
    avatar: "https://avatar.vercel.sh/ai-math",
    systemPrompt:
      "Eres un experto en matemáticas con amplio conocimiento en álgebra, geometría, cálculo y estadística. Tu especialidad es explicar conceptos matemáticos de forma clara y resolver problemas paso a paso. Puedes manejar desde operaciones básicas hasta ecuaciones complejas.",
  },
  advanced_mathematician: {
    name: "Matemático Avanzado",
    avatar: "https://avatar.vercel.sh/ai-advanced-math",
    systemPrompt:
      "Eres un matemático de nivel avanzado con profundo conocimiento en todas las áreas de las matemáticas, incluyendo álgebra lineal, cálculo multivariable, ecuaciones diferenciales, análisis numérico, teoría de números, geometría diferencial, topología, análisis funcional y matemáticas discretas. Puedes resolver problemas matemáticos complejos, demostrar teoremas, y explicar conceptos avanzados de manera clara y precisa.",
  },
}

