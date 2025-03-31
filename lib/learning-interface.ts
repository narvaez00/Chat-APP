"use client"

// Interfaz de usuario para el sistema de aprendizaje y clasificación

import { useState, useEffect } from "react"
import { AIAssistantWithLearning } from "./memory-service"

// Componente para gestionar modelos de clasificación
export function ClassificationModelManager({
  assistant,
}: {
  assistant: AIAssistantWithLearning
}) {
  const [models, setModels] = useState<{ id: string; name: string; description: string; categories: string[] }[]>([])
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const [newModelName, setNewModelName] = useState("")
  const [newModelDescription, setNewModelDescription] = useState("")
  const [newModelCategories, setNewModelCategories] = useState("")
  const [trainingText, setTrainingText] = useState("")
  const [trainingCategory, setTrainingCategory] = useState("")
  const [textToClassify, setTextToClassify] = useState("")
  const [classificationResult, setClassificationResult] = useState<{ category: string; confidence: number } | null>(
    null,
  )

  // Cargar modelos al iniciar
  useEffect(() => {
    const loadModels = async () => {
      try {
        const availableModels = await assistant.memoryManager.getClassificationModels()
        setModels(availableModels)
        if (availableModels.length > 0) {
          setSelectedModelId(availableModels[0].id)
        }
      } catch (error) {
        console.error("Error al cargar modelos:", error)
      }
    }

    loadModels()
  }, [assistant])

  // Crear nuevo modelo
  const handleCreateModel = () => {
    if (!newModelName || !newModelDescription || !newModelCategories) {
      alert("Por favor, completa todos los campos")
      return
    }

    const categories = newModelCategories.split(",").map((cat) => cat.trim())

    try {
      const modelId = assistant.createClassificationModel(newModelName, newModelDescription, categories)

      // Actualizar lista de modelos
      setModels([
        ...models,
        {
          id: modelId,
          name: newModelName,
          description: newModelDescription,
          categories,
        },
      ])

      // Seleccionar el nuevo modelo
      setSelectedModelId(modelId)

      // Limpiar formulario
      setNewModelName("")
      setNewModelDescription("")
      setNewModelCategories("")

      alert("Modelo creado correctamente")
    } catch (error) {
      console.error("Error al crear modelo:", error)
      alert("Error al crear modelo")
    }
  }

  // Entrenar modelo
  const handleTrainModel = () => {
    if (!selectedModelId || !trainingText || !trainingCategory) {
      alert("Por favor, selecciona un modelo y completa los campos de entrenamiento")
      return
    }

    try {
      const success = assistant.trainClassificationModel(selectedModelId, trainingText, trainingCategory)

      if (success) {
        alert("Modelo entrenado correctamente")
        setTrainingText("")
      } else {
        alert("Error al entrenar modelo. Verifica que la categoría sea válida para este modelo.")
      }
    } catch (error) {
      console.error("Error al entrenar modelo:", error)
      alert("Error al entrenar modelo")
    }
  }

  // Clasificar texto
  const handleClassifyText = () => {
    if (!selectedModelId || !textToClassify) {
      alert("Por favor, selecciona un modelo e ingresa texto para clasificar")
      return
    }

    try {
      const result = assistant.classifyText(selectedModelId, textToClassify)
      setClassificationResult(result)

      if (!result) {
        alert("No se pudo clasificar el texto. El modelo podría necesitar más datos de entrenamiento.")
      }
    } catch (error) {
      console.error("Error al clasificar texto:", error)
      alert("Error al clasificar texto")
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Modelo de Clasificación</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Modelo</label>
            <input
              type="text"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={newModelDescription}
              onChange={(e) => setNewModelDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categorías (separadas por comas)</label>
            <input
              type="text"
              value={newModelCategories}
              onChange={(e) => setNewModelCategories(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleCreateModel}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Crear Modelo
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Entrenar Modelo</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Seleccionar Modelo</label>
            <select
              value={selectedModelId || ""}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Seleccionar modelo...</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {selectedModelId && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Texto de Entrenamiento</label>
                <textarea
                  value={trainingText}
                  onChange={(e) => setTrainingText(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                  value={trainingCategory}
                  onChange={(e) => setTrainingCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Seleccionar categoría...</option>
                  {models
                    .find((model) => model.id === selectedModelId)
                    ?.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>
              <button
                onClick={handleTrainModel}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Entrenar Modelo
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Clasificar Texto</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Seleccionar Modelo</label>
            <select
              value={selectedModelId || ""}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Seleccionar modelo...</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {selectedModelId && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Texto a Clasificar</label>
                <textarea
                  value={textToClassify}
                  onChange={(e) => setTextToClassify(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={4}
                />
              </div>
              <button
                onClick={handleClassifyText}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clasificar Texto
              </button>

              {classificationResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h3 className="font-medium text-gray-900">Resultado de la Clasificación</h3>
                  <p className="mt-2">
                    <span className="font-bold">Categoría:</span> {classificationResult.category}
                  </p>
                  <p>
                    <span className="font-bold">Confianza:</span> {(classificationResult.confidence * 100).toFixed(2)}%
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente para gestionar modelos de predicción
export function PredictionModelManager({
  assistant,
}: {
  assistant: AIAssistantWithLearning
}) {
  const [models, setModels] = useState<
    { id: string; name: string; description: string; features: string[]; target: string }[]
  >([])
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const [newModelName, setNewModelName] = useState("")
  const [newModelDescription, setNewModelDescription] = useState("")
  const [newModelFeatures, setNewModelFeatures] = useState("")
  const [newModelTarget, setNewModelTarget] = useState("")
  const [trainingData, setTrainingData] = useState<Record<string, string>>({})
  const [featuresToPredict, setFeaturesToPredict] = useState<Record<string, string>>({})
  const [predictionResult, setPredictionResult] = useState<{ prediction: any; confidence: number } | null>(null)

  // Cargar modelos al iniciar
  useEffect(() => {
    const loadModels = async () => {
      try {
        const availableModels = await assistant.memoryManager.getPredictionModels()
        setModels(availableModels)
        if (availableModels.length > 0) {
          setSelectedModelId(availableModels[0].id)

          // Inicializar campos de entrenamiento y predicción
          const selectedModel = availableModels[0]
          const initialTrainingData: Record<string, string> = {}
          const initialFeaturesToPredict: Record<string, string> = {}
          ;[...selectedModel.features, selectedModel.target].forEach((field) => {
            initialTrainingData[field] = ""
          })

          selectedModel.features.forEach((field) => {
            initialFeaturesToPredict[field] = ""
          })

          setTrainingData(initialTrainingData)
          setFeaturesToPredict(initialFeaturesToPredict)
        }
      } catch (error) {
        console.error("Error al cargar modelos:", error)
      }
    }

    loadModels()
  }, [assistant])

  // Crear nuevo modelo
  const handleCreateModel = () => {
    if (!newModelName || !newModelDescription || !newModelFeatures || !newModelTarget) {
      alert("Por favor, completa todos los campos")
      return
    }

    const features = newModelFeatures.split(",").map((feature) => feature.trim())

    try {
      const modelId = assistant.createPredictionModel(newModelName, newModelDescription, features, newModelTarget)

      // Actualizar lista de modelos
      setModels([
        ...models,
        {
          id: modelId,
          name: newModelName,
          description: newModelDescription,
          features,
          target: newModelTarget,
        },
      ])

      // Seleccionar el nuevo modelo
      setSelectedModelId(modelId)

      // Inicializar campos de entrenamiento y predicción
      const initialTrainingData: Record<string, string> = {}
      const initialFeaturesToPredict: Record<string, string> = {}
      ;[...features, newModelTarget].forEach((field) => {
        initialTrainingData[field] = ""
      })

      features.forEach((field) => {
        initialFeaturesToPredict[field] = ""
      })

      setTrainingData(initialTrainingData)
      setFeaturesToPredict(initialFeaturesToPredict)

      // Limpiar formulario
      setNewModelName("")
      setNewModelDescription("")
      setNewModelFeatures("")
      setNewModelTarget("")

      alert("Modelo creado correctamente")
    } catch (error) {
      console.error("Error al crear modelo:", error)
      alert("Error al crear modelo")
    }
  }

  // Manejar cambios en los campos de entrenamiento
  const handleTrainingDataChange = (field: string, value: string) => {
    setTrainingData({
      ...trainingData,
      [field]: value,
    })
  }

  // Manejar cambios en los campos de predicción
  const handleFeaturesToPredictChange = (field: string, value: string) => {
    setFeaturesToPredict({
      ...featuresToPredict,
      [field]: value,
    })
  }

  // Entrenar modelo
  const handleTrainModel = () => {
    if (!selectedModelId) {
      alert("Por favor, selecciona un modelo")
      return
    }

    // Verificar que todos los campos tienen valor
    const selectedModel = models.find((model) => model.id === selectedModelId)
    if (!selectedModel) return

    const allFields = [...selectedModel.features, selectedModel.target]
    const missingFields = allFields.filter((field) => !trainingData[field])

    if (missingFields.length > 0) {
      alert(`Por favor, completa los siguientes campos: ${missingFields.join(", ")}`)
      return
    }

    // Convertir valores a números si es posible
    const processedData: Record<string, any> = {}
    for (const [field, value] of Object.entries(trainingData)) {
      const numValue = Number(value)
      processedData[field] = isNaN(numValue) ? value : numValue
    }

    try {
      const success = assistant.trainPredictionModel(selectedModelId, processedData)

      if (success) {
        alert("Modelo entrenado correctamente")

        // Limpiar campos de entrenamiento
        const resetTrainingData: Record<string, string> = {}
        allFields.forEach((field) => {
          resetTrainingData[field] = ""
        })
        setTrainingData(resetTrainingData)
      } else {
        alert("Error al entrenar modelo")
      }
    } catch (error) {
      console.error("Error al entrenar modelo:", error)
      alert("Error al entrenar modelo")
    }
  }

  // Realizar predicción
  const handlePredict = () => {
    if (!selectedModelId) {
      alert("Por favor, selecciona un modelo")
      return
    }

    // Verificar que todos los campos tienen valor
    const selectedModel = models.find((model) => model.id === selectedModelId)
    if (!selectedModel) return

    const missingFields = selectedModel.features.filter((field) => !featuresToPredict[field])

    if (missingFields.length > 0) {
      alert(`Por favor, completa los siguientes campos: ${missingFields.join(", ")}`)
      return
    }

    // Convertir valores a números si es posible
    const processedFeatures: Record<string, any> = {}
    for (const [field, value] of Object.entries(featuresToPredict)) {
      const numValue = Number(value)
      processedFeatures[field] = isNaN(numValue) ? value : numValue
    }

    try {
      const result = assistant.predict(selectedModelId, processedFeatures)
      setPredictionResult(result)

      if (!result) {
        alert("No se pudo realizar la predicción. El modelo podría necesitar más datos de entrenamiento.")
      }
    } catch (error) {
      console.error("Error al realizar predicción:", error)
      alert("Error al realizar predicción")
    }
  }

  // Manejar cambio de modelo seleccionado
  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId)

    // Reiniciar campos de entrenamiento y predicción
    const selectedModel = models.find((model) => model.id === modelId)
    if (selectedModel) {
      const initialTrainingData: Record<string, string> = {}
      const initialFeaturesToPredict: Record<string, string> = {}
      ;[...selectedModel.features, selectedModel.target].forEach((field) => {
        initialTrainingData[field] = ""
      })

      selectedModel.features.forEach((field) => {
        initialFeaturesToPredict[field] = ""
      })

      setTrainingData(initialTrainingData)
      setFeaturesToPredict(initialFeaturesToPredict)
    }

    // Limpiar resultado de predicción
    setPredictionResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Modelo de Predicción</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Modelo</label>
            <input
              type="text"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={newModelDescription}
              onChange={(e) => setNewModelDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Características (separadas por comas)</label>
            <input
              type="text"
              value={newModelFeatures}
              onChange={(e) => setNewModelFeatures(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">Ejemplo: edad, ingresos, educación</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Variable Objetivo</label>
            <input
              type="text"
              value={newModelTarget}
              onChange={(e) => setNewModelTarget(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">Ejemplo: compra</p>
          </div>
          <button
            onClick={handleCreateModel}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Crear Modelo
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Entrenar Modelo</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Seleccionar Modelo</label>
            <select
              value={selectedModelId || ""}
              onChange={(e) => handleModelChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Seleccionar modelo...</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {selectedModelId && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models
                  .find((model) => model.id === selectedModelId)
                  ?.features.map((feature) => (
                    <div key={feature}>
                      <label className="block text-sm font-medium text-gray-700">{feature}</label>
                      <input
                        type="text"
                        value={trainingData[feature] || ""}
                        onChange={(e) => handleTrainingDataChange(feature, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {models.find((model) => model.id === selectedModelId)?.target}
                  </label>
                  <input
                    type="text"
                    value={trainingData[models.find((model) => model.id === selectedModelId)?.target || ""] || ""}
                    onChange={(e) =>
                      handleTrainingDataChange(
                        models.find((model) => model.id === selectedModelId)?.target || "",
                        e.target.value,
                      )
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleTrainModel}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Entrenar Modelo
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Realizar Predicción</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Seleccionar Modelo</label>
            <select
              value={selectedModelId || ""}
              onChange={(e) => handleModelChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Seleccionar modelo...</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {selectedModelId && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models
                  .find((model) => model.id === selectedModelId)
                  ?.features.map((feature) => (
                    <div key={feature}>
                      <label className="block text-sm font-medium text-gray-700">{feature}</label>
                      <input
                        type="text"
                        value={featuresToPredict[feature] || ""}
                        onChange={(e) => handleFeaturesToPredictChange(feature, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
              </div>

              <button
                onClick={handlePredict}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Realizar Predicción
              </button>

              {predictionResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h3 className="font-medium text-gray-900">Resultado de la Predicción</h3>
                  <p className="mt-2">
                    <span className="font-bold">
                      Predicción para {models.find((model) => model.id === selectedModelId)?.target}:
                    </span>{" "}
                    {predictionResult.prediction}
                  </p>
                  <p>
                    <span className="font-bold">Confianza:</span> {(predictionResult.confidence * 100).toFixed(2)}%
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente para compilar y analizar datos
export function DataCompilationManager({
  assistant,
}: {
  assistant: AIAssistantWithLearning
}) {
  const [compilationOptions, setCompilationOptions] = useState({
    startDate: "",
    endDate: "",
    categories: "",
    source: "",
  })
  const [compiledData, setCompiledData] = useState<any>(null)

  // Compilar datos
  const handleCompileData = () => {
    try {
      const options: any = {}

      if (compilationOptions.startDate) {
        options.startDate = new Date(compilationOptions.startDate).getTime()
      }

      if (compilationOptions.endDate) {
        options.endDate = new Date(compilationOptions.endDate).getTime()
      }

      if (compilationOptions.categories) {
        options.categories = compilationOptions.categories.split(",").map((cat) => cat.trim())
      }

      if (compilationOptions.source) {
        options.source = compilationOptions.source as "user" | "assistant"
      }

      const data = assistant.compileData(options)
      setCompiledData(data)
    } catch (error) {
      console.error("Error al compilar datos:", error)
      alert("Error al compilar datos")
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Compilar y Analizar Datos</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input
                type="date"
                value={compilationOptions.startDate}
                onChange={(e) => setCompilationOptions({ ...compilationOptions, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
              <input
                type="date"
                value={compilationOptions.endDate}
                onChange={(e) => setCompilationOptions({ ...compilationOptions, endDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categorías (separadas por comas)</label>
            <input
              type="text"
              value={compilationOptions.categories}
              onChange={(e) => setCompilationOptions({ ...compilationOptions, categories: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fuente</label>
            <select
              value={compilationOptions.source}
              onChange={(e) => setCompilationOptions({ ...compilationOptions, source: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Todas</option>
              <option value="user">Usuario</option>
              <option value="assistant">Asistente</option>
            </select>
          </div>

          <button
            onClick={handleCompileData}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Compilar Datos
          </button>
        </div>
      </div>

      {compiledData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Resultados del Análisis</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Estadísticas Generales</h3>
              <p className="mt-2">
                <span className="font-bold">Total de mensajes:</span> {compiledData.messageCount}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Temas Principales</h3>
              <div className="mt-2 space-y-2">
                {compiledData.topTopics.map((topic: { topic: string; count: number }) => (
                  <div key={topic.topic} className="flex justify-between">
                    <span>{topic.topic}</span>
                    <span className="font-medium">{topic.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Distribución por Categoría</h3>
              <div className="mt-2 space-y-2">
                {compiledData.categoryDistribution.map((category: { category: string; count: number }) => (
                  <div key={category.category} className="flex justify-between">
                    <span>{category.category}</span>
                    <span className="font-medium">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Palabras Clave Frecuentes</h3>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {compiledData.keywordFrequency.map((keyword: { keyword: string; count: number }) => (
                  <div key={keyword.keyword} className="flex justify-between">
                    <span>{keyword.keyword}</span>
                    <span className="font-medium">{keyword.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {compiledData.sentimentTrend.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Tendencia de Sentimiento</h3>
                <div className="mt-2 h-40 bg-gray-100 rounded-md p-2">
                  {/* Aquí se podría implementar una visualización de la tendencia */}
                  <p className="text-center text-gray-500">Visualización de tendencia de sentimiento</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Componente principal para la interfaz de aprendizaje
export function LearningInterface() {
  const [activeTab, setActiveTab] = useState("classification")
  const [assistant, setAssistant] = useState<AIAssistantWithLearning | null>(null)

  // Inicializar asistente al cargar
  useEffect(() => {
    // Usar un ID de usuario fijo para demo
    // En una aplicación real, se usaría el ID del usuario autenticado
    const userId = "demo-user"

    const newAssistant = new AIAssistantWithLearning(userId)
    setAssistant(newAssistant)
  }, [])

  if (!assistant) {
    return <div className="flex items-center justify-center h-64">Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Aprendizaje y Clasificación</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("classification")}
              className={`${
                activeTab === "classification"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Clasificación
            </button>
            <button
              onClick={() => setActiveTab("prediction")}
              className={`${
                activeTab === "prediction"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Predicción
            </button>
            <button
              onClick={() => setActiveTab("compilation")}
              className={`${
                activeTab === "compilation"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Compilación de Datos
            </button>
          </nav>
        </div>
      </div>

      <div>
        {activeTab === "classification" && <ClassificationModelManager assistant={assistant} />}
        {activeTab === "prediction" && <PredictionModelManager assistant={assistant} />}
        {activeTab === "compilation" && <DataCompilationManager assistant={assistant} />}
      </div>
    </div>
  )
}

