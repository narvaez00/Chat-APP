// Sistema de memoria y aprendizaje para el asistente

// Tipos de datos para el sistema de memoria
export interface MemoryItem {
  id: string
  timestamp: number
  content: string
  category: string
  tags: string[]
  source: "user" | "assistant"
  importance: number // 1-10
  relatedTo?: string[] // IDs de otros elementos relacionados
  metadata: Record<string, any>
}

export interface UserProfile {
  id: string
  preferences: {
    topics: { [topic: string]: number } // tema -> nivel de interés (1-10)
    communicationStyle: string
    responseLength: "short" | "medium" | "long"
    technicalLevel: "beginner" | "intermediate" | "advanced"
    personalityPreference?: string
  }
  facts: { [key: string]: any } // Información conocida sobre el usuario
  interests: string[]
  avoidTopics: string[]
  lastInteraction: number
  interactionCount: number
  sessionHistory: {
    sessionId: string
    timestamp: number
    duration: number
    topics: string[]
    sentiment: number // -1 a 1
  }[]
}

export interface ConversationSummary {
  id: string
  timestamp: number
  duration: number
  topics: string[]
  keyPoints: string[]
  userSentiment: number // -1 a 1
  assistantPerformance: number // 1-10
  actionItems?: string[]
  followUpNeeded: boolean
}

export interface ClassificationModel {
  id: string
  name: string
  description: string
  categories: string[]
  trainingData: {
    text: string
    category: string
  }[]
  created: number
  lastUpdated: number
  accuracy?: number
  parameters?: Record<string, any>
}

export interface PredictionModel {
  id: string
  name: string
  description: string
  features: string[]
  target: string
  trainingData: Record<string, any>[]
  created: number
  lastUpdated: number
  accuracy?: number
  parameters?: Record<string, any>
}

// Tipo para el historial de mensajes
export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

// Clase principal para gestionar la memoria del asistente
export class MemoryManager {
  private memories: MemoryItem[] = []
  private userProfile: UserProfile
  private conversationSummaries: ConversationSummary[] = []
  private classificationModels: ClassificationModel[] = []
  private predictionModels: PredictionModel[] = []
  private currentSessionId: string
  private sessionStartTime: number
  private sessionTopics: Set<string> = new Set()

  constructor(userId: string) {
    // Cargar datos existentes si están disponibles
    this.loadFromStorage(userId)

    // Inicializar perfil de usuario si no existe
    if (!this.userProfile) {
      this.userProfile = {
        id: userId,
        preferences: {
          topics: {},
          communicationStyle: "neutral",
          responseLength: "medium",
          technicalLevel: "intermediate",
        },
        facts: {},
        interests: [],
        avoidTopics: [],
        lastInteraction: Date.now(),
        interactionCount: 0,
        sessionHistory: [],
      }
    }

    // Iniciar nueva sesión
    this.currentSessionId = this.generateId()
    this.sessionStartTime = Date.now()
  }

  // Generar ID único
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Cargar datos desde almacenamiento persistente
  private loadFromStorage(userId: string): void {
    try {
      // Intentar cargar desde localStorage (en navegador) o archivo (en servidor)
      if (typeof localStorage !== "undefined") {
        const memoriesJson = localStorage.getItem(`ai-memories-${userId}`)
        const profileJson = localStorage.getItem(`ai-profile-${userId}`)
        const summariesJson = localStorage.getItem(`ai-summaries-${userId}`)
        const classificationJson = localStorage.getItem(`ai-classification-models-${userId}`)
        const predictionJson = localStorage.getItem(`ai-prediction-models-${userId}`)

        if (memoriesJson) this.memories = JSON.parse(memoriesJson)
        if (profileJson) this.userProfile = JSON.parse(profileJson)
        if (summariesJson) this.conversationSummaries = JSON.parse(summariesJson)
        if (classificationJson) this.classificationModels = JSON.parse(classificationJson)
        if (predictionJson) this.predictionModels = JSON.parse(predictionJson)
      }
      // Aquí se podría implementar carga desde servidor o base de datos
    } catch (error) {
      console.error("Error al cargar datos de memoria:", error)
      // Inicializar con valores por defecto en caso de error
      this.memories = []
      this.conversationSummaries = []
      this.classificationModels = []
      this.predictionModels = []
    }
  }

  // Guardar datos en almacenamiento persistente
  private saveToStorage(): void {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(`ai-memories-${this.userProfile.id}`, JSON.stringify(this.memories))
        localStorage.setItem(`ai-profile-${this.userProfile.id}`, JSON.stringify(this.userProfile))
        localStorage.setItem(`ai-summaries-${this.userProfile.id}`, JSON.stringify(this.conversationSummaries))
        localStorage.setItem(
          `ai-classification-models-${this.userProfile.id}`,
          JSON.stringify(this.classificationModels),
        )
        localStorage.setItem(`ai-prediction-models-${this.userProfile.id}`, JSON.stringify(this.predictionModels))
      }
      // Aquí se podría implementar guardado en servidor o base de datos
    } catch (error) {
      console.error("Error al guardar datos de memoria:", error)
    }
  }

  // Añadir un nuevo elemento a la memoria
  public addMemory(
    content: string,
    category: string,
    source: "user" | "assistant",
    importance = 5,
    tags: string[] = [],
    metadata: Record<string, any> = {},
  ): string {
    const id = this.generateId()
    const memory: MemoryItem = {
      id,
      timestamp: Date.now(),
      content,
      category,
      tags,
      source,
      importance,
      metadata,
    }

    this.memories.push(memory)

    // Actualizar temas de la sesión actual
    if (tags.length > 0) {
      tags.forEach((tag) => this.sessionTopics.add(tag))
    }

    // Guardar cambios
    this.saveToStorage()

    return id
  }

  // Buscar en la memoria
  public searchMemories(
    query: string,
    options: {
      categories?: string[]
      tags?: string[]
      source?: "user" | "assistant"
      minImportance?: number
      limit?: number
      sortBy?: "timestamp" | "importance"
    } = {},
  ): MemoryItem[] {
    let results = this.memories.filter((memory) => {
      // Filtrar por contenido
      const contentMatch = memory.content.toLowerCase().includes(query.toLowerCase())

      // Filtrar por categoría si se especifica
      const categoryMatch = !options.categories || options.categories.includes(memory.category)

      // Filtrar por etiquetas si se especifican
      const tagsMatch = !options.tags || options.tags.some((tag) => memory.tags.includes(tag))

      // Filtrar por fuente si se especifica
      const sourceMatch = !options.source || memory.source === options.source

      // Filtrar por importancia mínima si se especifica
      const importanceMatch = !options.minImportance || memory.importance >= options.minImportance

      return contentMatch && categoryMatch && tagsMatch && sourceMatch && importanceMatch
    })

    // Ordenar resultados
    if (options.sortBy) {
      results.sort((a, b) => {
        if (options.sortBy === "timestamp") {
          return b.timestamp - a.timestamp // Más recientes primero
        } else if (options.sortBy === "importance") {
          return b.importance - a.importance // Más importantes primero
        }
        return 0
      })
    }

    // Limitar resultados si se especifica
    if (options.limit && options.limit > 0) {
      results = results.slice(0, options.limit)
    }

    return results
  }

  // Actualizar perfil de usuario basado en la interacción
  public updateUserProfile(interaction: {
    topics?: { [topic: string]: number }
    communicationStyle?: string
    responseLength?: "short" | "medium" | "long"
    technicalLevel?: "beginner" | "intermediate" | "advanced"
    personalityPreference?: string
    facts?: { [key: string]: any }
    interests?: string[]
    avoidTopics?: string[]
  }): void {
    // Actualizar preferencias de temas
    if (interaction.topics) {
      for (const [topic, interest] of Object.entries(interaction.topics)) {
        this.userProfile.preferences.topics[topic] = interest
      }
    }

    // Actualizar estilo de comunicación si se proporciona
    if (interaction.communicationStyle) {
      this.userProfile.preferences.communicationStyle = interaction.communicationStyle
    }

    // Actualizar longitud de respuesta preferida si se proporciona
    if (interaction.responseLength) {
      this.userProfile.preferences.responseLength = interaction.responseLength
    }

    // Actualizar nivel técnico si se proporciona
    if (interaction.technicalLevel) {
      this.userProfile.preferences.technicalLevel = interaction.technicalLevel
    }

    // Actualizar preferencia de personalidad si se proporciona
    if (interaction.personalityPreference) {
      this.userProfile.preferences.personalityPreference = interaction.personalityPreference
    }

    // Actualizar hechos conocidos sobre el usuario
    if (interaction.facts) {
      this.userProfile.facts = { ...this.userProfile.facts, ...interaction.facts }
    }

    // Actualizar intereses
    if (interaction.interests) {
      // Añadir nuevos intereses sin duplicar
      interaction.interests.forEach((interest) => {
        if (!this.userProfile.interests.includes(interest)) {
          this.userProfile.interests.push(interest)
        }
      })
    }

    // Actualizar temas a evitar
    if (interaction.avoidTopics) {
      // Añadir nuevos temas a evitar sin duplicar
      interaction.avoidTopics.forEach((topic) => {
        if (!this.userProfile.avoidTopics.includes(topic)) {
          this.userProfile.avoidTopics.push(topic)
        }
      })
    }

    // Actualizar contador de interacciones y timestamp
    this.userProfile.interactionCount++
    this.userProfile.lastInteraction = Date.now()

    // Guardar cambios
    this.saveToStorage()
  }

  // Finalizar sesión actual y crear resumen
  public endSession(
    keyPoints: string[] = [],
    userSentiment = 0,
    assistantPerformance = 5,
    actionItems: string[] = [],
    followUpNeeded = false,
  ): void {
    const endTime = Date.now()
    const duration = endTime - this.sessionStartTime

    // Crear resumen de la conversación
    const summary: ConversationSummary = {
      id: this.currentSessionId,
      timestamp: this.sessionStartTime,
      duration,
      topics: Array.from(this.sessionTopics),
      keyPoints,
      userSentiment,
      assistantPerformance,
      actionItems,
      followUpNeeded,
    }

    this.conversationSummaries.push(summary)

    // Añadir a historial de sesiones del usuario
    this.userProfile.sessionHistory.push({
      sessionId: this.currentSessionId,
      timestamp: this.sessionStartTime,
      duration,
      topics: Array.from(this.sessionTopics),
      sentiment: userSentiment,
    })

    // Guardar cambios
    this.saveToStorage()

    // Reiniciar para nueva sesión
    this.currentSessionId = this.generateId()
    this.sessionStartTime = Date.now()
    this.sessionTopics = new Set()
  }

  // Crear un nuevo modelo de clasificación
  public createClassificationModel(name: string, description: string, categories: string[]): string {
    const id = this.generateId()
    const model: ClassificationModel = {
      id,
      name,
      description,
      categories,
      trainingData: [],
      created: Date.now(),
      lastUpdated: Date.now(),
    }

    this.classificationModels.push(model)
    this.saveToStorage()

    return id
  }

  // Añadir datos de entrenamiento al modelo de clasificación
  public addClassificationTrainingData(modelId: string, text: string, category: string): boolean {
    const modelIndex = this.classificationModels.findIndex((model) => model.id === modelId)
    if (modelIndex === -1) return false

    // Verificar que la categoría es válida para este modelo
    if (!this.classificationModels[modelIndex].categories.includes(category)) {
      return false
    }

    // Añadir datos de entrenamiento
    this.classificationModels[modelIndex].trainingData.push({ text, category })
    this.classificationModels[modelIndex].lastUpdated = Date.now()

    this.saveToStorage()
    return true
  }

  // Clasificar texto usando un modelo entrenado
  public classifyText(modelId: string, text: string): { category: string; confidence: number } | null {
    const model = this.classificationModels.find((m) => m.id === modelId)
    if (!model || model.trainingData.length === 0) return null

    // Implementación simple de clasificación basada en coincidencia de palabras
    // En una implementación real, se usaría un algoritmo más sofisticado

    const scores: { [category: string]: number } = {}
    model.categories.forEach((category) => {
      scores[category] = 0
    })

    // Tokenizar el texto de entrada
    const inputTokens = text
      .toLowerCase()
      .split(/\W+/)
      .filter((token) => token.length > 0)

    // Calcular puntuación para cada categoría
    for (const { text: trainingText, category } of model.trainingData) {
      const trainingTokens = trainingText
        .toLowerCase()
        .split(/\W+/)
        .filter((token) => token.length > 0)

      // Contar coincidencias de tokens
      let matches = 0
      for (const token of inputTokens) {
        if (trainingTokens.includes(token)) {
          matches++
        }
      }

      // Calcular similitud como proporción de coincidencias
      const similarity = matches / Math.max(inputTokens.length, 1)
      scores[category] += similarity
    }

    // Normalizar puntuaciones
    let totalScore = 0
    for (const category of model.categories) {
      totalScore += scores[category]
    }

    if (totalScore === 0) {
      // No hay suficiente información para clasificar
      return null
    }

    // Encontrar la categoría con mayor puntuación
    let bestCategory = model.categories[0]
    let bestScore = scores[bestCategory]

    for (const category of model.categories) {
      if (scores[category] > bestScore) {
        bestCategory = category
        bestScore = scores[category]
      }
    }

    // Calcular confianza como proporción de la puntuación total
    const confidence = bestScore / totalScore

    return { category: bestCategory, confidence }
  }

  // Crear un nuevo modelo de predicción
  public createPredictionModel(name: string, description: string, features: string[], target: string): string {
    const id = this.generateId()
    const model: PredictionModel = {
      id,
      name,
      description,
      features,
      target,
      trainingData: [],
      created: Date.now(),
      lastUpdated: Date.now(),
    }

    this.predictionModels.push(model)
    this.saveToStorage()

    return id
  }

  // Añadir datos de entrenamiento al modelo de predicción
  public addPredictionTrainingData(modelId: string, data: Record<string, any>): boolean {
    const modelIndex = this.predictionModels.findIndex((model) => model.id === modelId)
    if (modelIndex === -1) return false

    const model = this.predictionModels[modelIndex]

    // Verificar que los datos contienen todas las características y el objetivo
    const requiredFields = [...model.features, model.target]
    for (const field of requiredFields) {
      if (!(field in data)) {
        return false
      }
    }

    // Añadir datos de entrenamiento
    model.trainingData.push(data)
    model.lastUpdated = Date.now()

    this.saveToStorage()
    return true
  }

  // Realizar predicción usando un modelo entrenado
  public predict(modelId: string, features: Record<string, any>): { prediction: any; confidence: number } | null {
    const model = this.predictionModels.find((m) => m.id === modelId)
    if (!model || model.trainingData.length === 0) return null

    // Verificar que se proporcionan todas las características requeridas
    for (const feature of model.features) {
      if (!(feature in features)) {
        return null
      }
    }

    // Implementación simple de predicción basada en similitud de características
    // En una implementación real, se usaría un algoritmo más sofisticado

    // Calcular similitud con cada ejemplo de entrenamiento
    const similarities: { index: number; similarity: number }[] = []

    for (let i = 0; i < model.trainingData.length; i++) {
      const trainingExample = model.trainingData[i]
      let similarity = 0

      // Calcular similitud para cada característica
      for (const feature of model.features) {
        if (typeof features[feature] === "number" && typeof trainingExample[feature] === "number") {
          // Para valores numéricos, usar diferencia normalizada
          const diff = Math.abs(features[feature] - trainingExample[feature])
          const maxValue = Math.max(...model.trainingData.map((d) => d[feature]))
          const minValue = Math.min(...model.trainingData.map((d) => d[feature]))
          const range = maxValue - minValue || 1 // Evitar división por cero
          similarity += 1 - diff / range
        } else if (features[feature] === trainingExample[feature]) {
          // Para valores no numéricos, coincidencia exacta
          similarity += 1
        }
      }

      // Normalizar similitud
      similarity /= model.features.length

      similarities.push({ index: i, similarity })
    }

    // Ordenar por similitud (mayor a menor)
    similarities.sort((a, b) => b.similarity - a.similarity)

    // Tomar los k ejemplos más similares (k=3 en este caso simple)
    const k = Math.min(3, similarities.length)
    const topK = similarities.slice(0, k)

    if (topK.length === 0) {
      return null
    }

    // Para valores numéricos, calcular promedio ponderado
    if (typeof model.trainingData[0][model.target] === "number") {
      let weightedSum = 0
      let totalWeight = 0

      for (const { index, similarity } of topK) {
        const weight = similarity
        weightedSum += model.trainingData[index][model.target] * weight
        totalWeight += weight
      }

      const prediction = totalWeight > 0 ? weightedSum / totalWeight : null
      const confidence = topK[0].similarity

      return prediction !== null ? { prediction, confidence } : null
    }

    // Para valores categóricos, usar votación ponderada
    const votes: { [value: string]: number } = {}
    let totalWeight = 0

    for (const { index, similarity } of topK) {
      const value = String(model.trainingData[index][model.target])
      const weight = similarity

      votes[value] = (votes[value] || 0) + weight
      totalWeight += weight
    }

    // Encontrar el valor con más votos
    let bestValue = Object.keys(votes)[0]
    let bestVotes = votes[bestValue]

    for (const [value, voteCount] of Object.entries(votes)) {
      if (voteCount > bestVotes) {
        bestValue = value
        bestVotes = voteCount
      }
    }

    const confidence = totalWeight > 0 ? bestVotes / totalWeight : 0

    return { prediction: bestValue, confidence }
  }

  // Obtener perfil de usuario
  public getUserProfile(): UserProfile {
    return { ...this.userProfile }
  }

  // Obtener resúmenes de conversaciones
  public getConversationSummaries(limit = 10): ConversationSummary[] {
    return [...this.conversationSummaries].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
  }

  // Obtener modelos de clasificación
  public getClassificationModels(): { id: string; name: string; description: string; categories: string[] }[] {
    return this.classificationModels.map((model) => ({
      id: model.id,
      name: model.name,
      description: model.description,
      categories: [...model.categories],
    }))
  }

  // Obtener modelos de predicción
  public getPredictionModels(): {
    id: string
    name: string
    description: string
    features: string[]
    target: string
  }[] {
    return this.predictionModels.map((model) => ({
      id: model.id,
      name: model.name,
      description: model.description,
      features: [...model.features],
      target: model.target,
    }))
  }

  // Extraer información relevante de un mensaje
  public extractInformation(message: string): {
    entities: { text: string; type: string }[]
    keywords: string[]
    sentiment: number
    topics: string[]
  } {
    // Implementación simple de extracción de información
    // En una implementación real, se usarían técnicas de NLP más avanzadas

    const entities: { text: string; type: string }[] = []
    const keywords: string[] = []
    let sentiment = 0
    const topics: string[] = []

    // Palabras positivas y negativas para análisis de sentimiento simple
    const positiveWords = [
      "bueno",
      "excelente",
      "genial",
      "increíble",
      "fantástico",
      "maravilloso",
      "feliz",
      "contento",
      "alegre",
      "satisfecho",
      "agradecido",
      "encantado",
    ]
    const negativeWords = [
      "malo",
      "terrible",
      "horrible",
      "pésimo",
      "desastroso",
      "triste",
      "enojado",
      "frustrado",
      "decepcionado",
      "molesto",
      "irritado",
      "enfadado",
    ]

    // Tokenizar mensaje
    const tokens = message
      .toLowerCase()
      .split(/\W+/)
      .filter((token) => token.length > 0)

    // Calcular sentimiento
    for (const token of tokens) {
      if (positiveWords.includes(token)) {
        sentiment += 0.1
      } else if (negativeWords.includes(token)) {
        sentiment -= 0.1
      }
    }

    // Limitar sentimiento al rango [-1, 1]
    sentiment = Math.max(-1, Math.min(1, sentiment))

    // Extraer palabras clave (palabras con más de 4 letras que no sean stopwords)
    const stopwords = [
      "para",
      "como",
      "pero",
      "porque",
      "cuando",
      "donde",
      "quien",
      "cual",
      "esto",
      "esta",
      "estos",
      "estas",
      "desde",
      "hasta",
      "entre",
      "sobre",
      "bajo",
      "ante",
      "tras",
    ]
    for (const token of tokens) {
      if (token.length > 4 && !stopwords.includes(token) && !keywords.includes(token)) {
        keywords.push(token)
      }
    }

    // Detectar temas basados en palabras clave
    const topicKeywords: { [topic: string]: string[] } = {
      tecnología: [
        "tecnología",
        "computadora",
        "software",
        "hardware",
        "internet",
        "digital",
        "programación",
        "aplicación",
        "móvil",
        "dispositivo",
      ],
      salud: [
        "salud",
        "médico",
        "enfermedad",
        "tratamiento",
        "síntoma",
        "hospital",
        "doctor",
        "medicina",
        "paciente",
        "diagnóstico",
      ],
      finanzas: [
        "dinero",
        "finanzas",
        "inversión",
        "banco",
        "economía",
        "mercado",
        "acciones",
        "ahorro",
        "préstamo",
        "crédito",
      ],
      educación: [
        "educación",
        "escuela",
        "universidad",
        "estudiante",
        "profesor",
        "aprendizaje",
        "enseñanza",
        "curso",
        "clase",
        "académico",
      ],
      entretenimiento: [
        "película",
        "música",
        "juego",
        "deporte",
        "concierto",
        "festival",
        "teatro",
        "arte",
        "libro",
        "televisión",
      ],
    }

    for (const [topic, topicWords] of Object.entries(topicKeywords)) {
      for (const keyword of keywords) {
        if (topicWords.includes(keyword) && !topics.includes(keyword)) {
          topics.push(topic)
          break
        }
      }
    }

    // Detectar entidades simples (nombres, lugares, organizaciones)
    const entityPatterns: { [type: string]: RegExp } = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      url: /https?:\/\/[^\s]+/g,
      fecha: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
      hora: /\b\d{1,2}:\d{2}\b/g,
      teléfono: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      dinero: /\$\d+(?:\.\d{2})?/g,
    }

    for (const [type, pattern] of Object.entries(entityPatterns)) {
      const matches = message.match(pattern)
      if (matches) {
        for (const match of matches) {
          entities.push({ text: match, type })
        }
      }
    }

    return { entities, keywords, sentiment, topics }
  }

  // Compilar datos para análisis
  public compileData(
    options: {
      startDate?: number
      endDate?: number
      categories?: string[]
      source?: "user" | "assistant"
    } = {},
  ): {
    messageCount: number
    topTopics: { topic: string; count: number }[]
    sentimentTrend: { timestamp: number; sentiment: number }[]
    keywordFrequency: { keyword: string; count: number }[]
    categoryDistribution: { category: string; count: number }[]
  } {
    // Filtrar memorias según opciones
    let filteredMemories = this.memories

    if (options.startDate) {
      filteredMemories = filteredMemories.filter((memory) => memory.timestamp >= options.startDate)
    }

    if (options.endDate) {
      filteredMemories = filteredMemories.filter((memory) => memory.timestamp <= options.endDate)
    }

    if (options.categories) {
      filteredMemories = filteredMemories.filter((memory) => options.categories!.includes(memory.category))
    }

    if (options.source) {
      filteredMemories = filteredMemories.filter((memory) => memory.source === options.source)
    }

    // Contar mensajes
    const messageCount = filteredMemories.length

    // Calcular temas más frecuentes
    const topicCounts: { [topic: string]: number } = {}
    for (const memory of filteredMemories) {
      for (const tag of memory.tags) {
        topicCounts[tag] = (topicCounts[tag] || 0) + 1
      }
    }

    const topTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calcular tendencia de sentimiento
    // Asumimos que el sentimiento está almacenado en metadata.sentiment
    const sentimentData = filteredMemories
      .filter((memory) => memory.metadata && typeof memory.metadata.sentiment === "number")
      .map((memory) => ({
        timestamp: memory.timestamp,
        sentiment: memory.metadata.sentiment as number,
      }))
      .sort((a, b) => a.timestamp - b.timestamp)

    // Calcular frecuencia de palabras clave
    const keywordCounts: { [keyword: string]: number } = {}
    for (const memory of filteredMemories) {
      if (memory.metadata && Array.isArray(memory.metadata.keywords)) {
        for (const keyword of memory.metadata.keywords) {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1
        }
      }
    }

    const keywordFrequency = Object.entries(keywordCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)

    // Calcular distribución por categoría
    const categoryCounts: { [category: string]: number } = {}
    for (const memory of filteredMemories) {
      categoryCounts[memory.category] = (categoryCounts[memory.category] || 0) + 1
    }

    const categoryDistribution = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    return {
      messageCount,
      topTopics,
      sentimentTrend: sentimentData,
      keywordFrequency,
      categoryDistribution,
    }
  }
}

// Clase para gestionar el aprendizaje y adaptación del asistente
export class LearningManager {
  private memoryManager: MemoryManager
  private learningRate = 0.1 // Tasa de aprendizaje para adaptación
  private adaptationThreshold = 0.7 // Umbral para adaptación (0-1)

  constructor(memoryManager: MemoryManager) {
    this.memoryManager = memoryManager
  }

  // Procesar mensaje del usuario para aprendizaje
  public processUserMessage(message: string): void {
    // Extraer información del mensaje
    const extractedInfo = this.memoryManager.extractInformation(message)

    // Guardar en memoria si es relevante
    if (extractedInfo.keywords.length > 0 || extractedInfo.entities.length > 0) {
      const importance = Math.min(10, Math.max(1, extractedInfo.keywords.length + extractedInfo.entities.length))

      this.memoryManager.addMemory(message, "user_message", "user", importance, extractedInfo.topics, {
        keywords: extractedInfo.keywords,
        entities: extractedInfo.entities,
        sentiment: extractedInfo.sentiment,
      })

      // Actualizar perfil de usuario
      const topicInterest: { [topic: string]: number } = {}
      for (const topic of extractedInfo.topics) {
        topicInterest[topic] = 7 // Interés moderado-alto en temas mencionados
      }

      this.memoryManager.updateUserProfile({
        topics: topicInterest,
        interests: extractedInfo.topics,
      })
    }
  }

  // Procesar respuesta del asistente para aprendizaje
  public processAssistantResponse(
    response: string,
    userFeedback?: {
      helpful: boolean
      relevant: boolean
      sentiment: number // -1 a 1
    },
  ): void {
    // Extraer información de la respuesta
    const extractedInfo = this.memoryManager.extractInformation(response)

    // Calcular importancia basada en feedback si está disponible
    let importance = 5 // Importancia media por defecto

    if (userFeedback) {
      importance = 5
      if (userFeedback.helpful) importance += 2
      if (userFeedback.relevant) importance += 2
      importance += Math.round(userFeedback.sentiment * 2)

      // Limitar al rango 1-10
      importance = Math.min(10, Math.max(1, importance))
    }

    // Guardar en memoria
    this.memoryManager.addMemory(response, "assistant_response", "assistant", importance, extractedInfo.topics, {
      keywords: extractedInfo.keywords,
      entities: extractedInfo.entities,
      sentiment: extractedInfo.sentiment,
      userFeedback,
    })
  }

  // Entrenar modelo de clasificación con nuevos datos
  public trainClassificationModel(modelId: string, text: string, category: string): boolean {
    return this.memoryManager.addClassificationTrainingData(modelId, text, category)
  }

  // Entrenar modelo de predicción con nuevos datos
  public trainPredictionModel(modelId: string, data: Record<string, any>): boolean {
    return this.memoryManager.addPredictionTrainingData(modelId, data)
  }

  // Generar recomendaciones para mejorar las respuestas del asistente
  public generateRecommendations(): {
    topicSuggestions: string[]
    communicationStyleSuggestions: string[]
    contentSuggestions: string[]
  } {
    const userProfile = this.memoryManager.getUserProfile()

    // Sugerencias de temas basadas en intereses del usuario
    const topicSuggestions = userProfile.interests.slice(0, 5)

    // Sugerencias de estilo de comunicación
    let communicationStyleSuggestions: string[] = []

    switch (userProfile.preferences.communicationStyle) {
      case "formal":
        communicationStyleSuggestions = [
          "Mantener un tono formal y profesional",
          "Utilizar lenguaje preciso y estructurado",
          "Evitar coloquialismos y expresiones informales",
        ]
        break
      case "casual":
        communicationStyleSuggestions = [
          "Mantener un tono conversacional y cercano",
          "Utilizar expresiones cotidianas",
          "Ser más directo y menos técnico",
        ]
        break
      case "technical":
        communicationStyleSuggestions = [
          "Incluir detalles técnicos relevantes",
          "Utilizar terminología específica del dominio",
          "Proporcionar explicaciones basadas en datos",
        ]
        break
      default:
        communicationStyleSuggestions = [
          "Adaptar el tono según el contexto",
          "Equilibrar formalidad y cercanía",
          "Ajustar el nivel técnico según la consulta",
        ]
    }

    // Sugerencias de contenido basadas en preferencias del usuario
    const contentSuggestions: string[] = []

    if (userProfile.preferences.responseLength === "short") {
      contentSuggestions.push("Proporcionar respuestas concisas y directas")
    } else if (userProfile.preferences.responseLength === "long") {
      contentSuggestions.push("Ofrecer explicaciones detalladas y ejemplos")
    }

    if (userProfile.preferences.technicalLevel === "beginner") {
      contentSuggestions.push("Explicar conceptos básicos sin asumir conocimientos previos")
    } else if (userProfile.preferences.technicalLevel === "advanced") {
      contentSuggestions.push("Incluir información avanzada y referencias técnicas")
    }

    // Evitar temas que el usuario prefiere no tratar
    if (userProfile.avoidTopics.length > 0) {
      contentSuggestions.push(`Evitar temas como: ${userProfile.avoidTopics.join(", ")}`)
    }

    return {
      topicSuggestions,
      communicationStyleSuggestions,
      contentSuggestions,
    }
  }

  // Adaptar respuesta según el aprendizaje
  public adaptResponse(
    originalResponse: string,
    context: {
      userMessage: string
      conversationHistory: ChatMessage[]
    },
  ): string {
    const userProfile = this.memoryManager.getUserProfile()
    let adaptedResponse = originalResponse

    // Extraer información del mensaje del usuario
    const userMessageInfo = this.memoryManager.extractInformation(context.userMessage)

    // Buscar memorias relevantes
    const relevantMemories = this.memoryManager.searchMemories("", {
      tags: userMessageInfo.topics,
      minImportance: 7,
      limit: 5,
      sortBy: "importance",
    })

    // Determinar si se debe adaptar la respuesta
    const shouldAdapt = relevantMemories.length > 0 && Math.random() < this.adaptationThreshold

    if (shouldAdapt) {
      // Adaptar según el estilo de comunicación preferido
      if (userProfile.preferences.communicationStyle === "formal") {
        adaptedResponse = this.makeMoreFormal(adaptedResponse)
      } else if (userProfile.preferences.communicationStyle === "casual") {
        adaptedResponse = this.makeMoreCasual(adaptedResponse)
      }

      // Adaptar según la longitud de respuesta preferida
      if (userProfile.preferences.responseLength === "short" && adaptedResponse.length > 500) {
        adaptedResponse = this.shortenResponse(adaptedResponse)
      } else if (userProfile.preferences.responseLength === "long" && adaptedResponse.length < 200) {
        adaptedResponse = this.expandResponse(adaptedResponse, context)
      }

      // Personalizar con información del usuario si es apropiado
      if (Object.keys(userProfile.facts).length > 0) {
        adaptedResponse = this.personalizeResponse(adaptedResponse, userProfile.facts)
      }
    }

    return adaptedResponse
  }

  // Métodos auxiliares para adaptación de respuestas

  private makeMoreFormal(text: string): string {
    // Implementación simple para hacer el texto más formal
    const casualPhrases: [string, string][] = [
      [/\bhola\b/gi, "Saludos"],
      [/\ble agradezco\b/gi, "gracias"],
      [/\bexcelente\b/gi, "genial"],
      [/\badecuado\b/gi, "bueno"],
      [/\bapropiado\b/gi, "chévere"],
      [/\bcorrecto\b/gi, "bueno"],
      [/\bclaro\b/gi, "ciertamente"],
      [/\bsí\b/gi, "afirmativo"],
      [/\bno\b/gi, "negativo"],
      [/\bpero\b/gi, "sin embargo"],
      [/\bpuedes\b/gi, "podría usted"],
      [/\bquieres\b/gi, "desearía usted"],
      [/\bte\b/gi, "le"],
      [/\btu\b/gi, "su"],
      [/\btuyo\b/gi, "suyo"],
    ]

    let formalText = text
    for (const [casual, formal] of casualPhrases) {
      formalText = formalText.replace(casual, formal)
    }

    return formalText
  }

  private makeMoreCasual(text: string): string {
    // Implementación simple para hacer el texto más casual
    const formalPhrases: [string, string][] = [
      [/\bsaludos\b/gi, "Hola"],
      [/\ble agradezco\b/gi, "gracias"],
      [/\bexcelente\b/gi, "genial"],
      [/\badecuado\b/gi, "bueno"],
      [/\bapropiado\b/gi, "chévere"],
      [/\bcorrecto\b/gi, "bueno"],
      [/\bciertamente\b/gi, "claro"],
      [/\bafirmativo\b/gi, "sí"],
      [/\bnegativo\b/gi, "no"],
      [/\bsin embargo\b/gi, "pero"],
      [/\bpodría usted\b/gi, "puedes"],
      [/\bdesearía usted\b/gi, "quieres"],
      [/\ble\b/gi, "te"],
      [/\bsu\b/gi, "tu"],
      [/\bsuyo\b/gi, "tuyo"],
    ]

    let casualText = text
    for (const [formal, casual] of formalPhrases) {
      casualText = casualText.replace(formal, casual)
    }

    return casualText
  }

  private shortenResponse(text: string): string {
    // Implementación simple para acortar respuesta
    // Dividir en oraciones
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

    if (sentences.length <= 3) {
      return text
    }

    // Mantener primera y última oración, y una del medio
    const shortened = [sentences[0], sentences[Math.floor(sentences.length / 2)], sentences[sentences.length - 1]].join(
      " ",
    )

    return shortened
  }

  private expandResponse(text: string, context: { userMessage: string; conversationHistory: ChatMessage[] }): string {
    // Implementación simple para expandir respuesta
    const userMessageInfo = this.memoryManager.extractInformation(context.userMessage)

    let expanded = text

    // Añadir ejemplo si es apropiado
    if (userMessageInfo.topics.length > 0) {
      expanded += ` Por ejemplo, en el contexto de ${userMessageInfo.topics[0]}, esto significa que puedes aplicar estos conceptos de manera práctica en situaciones cotidianas.`
    }

    // Añadir pregunta de seguimiento
    expanded += ` ¿Te gustaría que profundizara en algún aspecto específico de esta respuesta?`

    return expanded
  }

  private personalizeResponse(text: string, userFacts: { [key: string]: any }): string {
    // Implementación simple para personalizar respuesta con datos del usuario
    let personalized = text

    // Añadir referencia personal si hay un nombre
    if (userFacts.name) {
      // Verificar si el texto ya contiene el nombre para evitar repetición
      if (!personalized.includes(userFacts.name)) {
        // Añadir el nombre al principio o al final aleatoriamente
        if (Math.random() > 0.5) {
          personalized = `${userFacts.name}, ${personalized.charAt(0).toLowerCase() + personalized.slice(1)}`
        } else {
          personalized = `${personalized} ¿Hay algo más en lo que pueda ayudarte, ${userFacts.name}?`
        }
      }
    }

    // Referenciar intereses conocidos si es relevante
    if (userFacts.interests && Array.isArray(userFacts.interests) && userFacts.interests.length > 0) {
      const randomInterest = userFacts.interests[Math.floor(Math.random() * userFacts.interests.length)]

      // Añadir referencia al interés si no está ya mencionado
      if (!personalized.includes(randomInterest)) {
        personalized = personalized.replace(
          /\.$/,
          `. Esto podría ser particularmente útil si lo aplicas a tu interés en ${randomInterest}.`,
        )
      }
    }

    return personalized
  }
}

// Interfaz para integrar el sistema de memoria y aprendizaje con el asistente
export class AIAssistantWithLearning {
  private memoryManager: MemoryManager
  private learningManager: LearningManager
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    this.memoryManager = new MemoryManager(userId)
    this.learningManager = new LearningManager(this.memoryManager)
  }

  // Procesar mensaje del usuario y generar respuesta
  public async processMessage(userMessage: string, conversationHistory: ChatMessage[]): Promise<string> {
    // Procesar mensaje para aprendizaje
    this.learningManager.processUserMessage(userMessage)

    // Generar respuesta base (usando el servicio de IA existente)
    // Aquí se integraría con la función generateAIResponse

    // Simulación de respuesta para este ejemplo
    const baseResponse = "Esta es una respuesta simulada del asistente."

    // Adaptar respuesta según aprendizaje
    const adaptedResponse = this.learningManager.adaptResponse(baseResponse, {
      userMessage,
      conversationHistory,
    })

    // Procesar respuesta para aprendizaje
    this.learningManager.processAssistantResponse(adaptedResponse)

    return adaptedResponse
  }

  // Crear un nuevo modelo de clasificación
  public createClassificationModel(name: string, description: string, categories: string[]): string {
    return this.memoryManager.createClassificationModel(name, description, categories)
  }

  // Clasificar texto usando un modelo
  public classifyText(modelId: string, text: string): { category: string; confidence: number } | null {
    return this.memoryManager.classifyText(modelId, text)
  }

  // Entrenar modelo de clasificación
  public trainClassificationModel(modelId: string, text: string, category: string): boolean {
    return this.learningManager.trainClassificationModel(modelId, text, category)
  }

  // Crear un nuevo modelo de predicción
  public createPredictionModel(name: string, description: string, features: string[], target: string): string {
    return this.memoryManager.createPredictionModel(name, description, features, target)
  }

  // Realizar predicción usando un modelo
  public predict(modelId: string, features: Record<string, any>): { prediction: any; confidence: number } | null {
    return this.memoryManager.predict(modelId, features)
  }

  // Entrenar modelo de predicción
  public trainPredictionModel(modelId: string, data: Record<string, any>): boolean {
    return this.learningManager.trainPredictionModel(modelId, data)
  }

  // Compilar datos para análisis
  public compileData(
    options: {
      startDate?: number
      endDate?: number
      categories?: string[]
      source?: "user" | "assistant"
    } = {},
  ): any {
    return this.memoryManager.compileData(options)
  }

  // Obtener recomendaciones para mejorar las respuestas
  public getRecommendations(): any {
    return this.learningManager.generateRecommendations()
  }

  // Finalizar sesión y crear resumen
  public endSession(keyPoints: string[] = [], userSentiment = 0, assistantPerformance = 5): void {
    this.memoryManager.endSession(keyPoints, userSentiment, assistantPerformance)
  }

  // Obtener perfil de usuario
  public getUserProfile(): UserProfile {
    return this.memoryManager.getUserProfile()
  }

  // Buscar en la memoria
  public searchMemories(query: string, options: any = {}): MemoryItem[] {
    return this.memoryManager.searchMemories(query, options)
  }
}

