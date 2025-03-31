// Tipo para los usuarios
export interface User {
  email: string
  password: string
  name?: string
  profileImage?: string
  securityQuestion?: {
    question: string
    answer: string
  }
}

// Función para obtener todos los usuarios
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem("app-users")
  if (!usersJson) return []

  try {
    return JSON.parse(usersJson)
  } catch (error) {
    console.error("Error parsing users:", error)
    return []
  }
}

// Función para guardar todos los usuarios
export const saveUsers = (users: User[]): void => {
  localStorage.setItem("app-users", JSON.stringify(users))
}

// Función para registrar un nuevo usuario
export const registerUser = (email: string, password: string, name?: string): { success: boolean; message: string } => {
  const users = getUsers()

  // Verificar si el usuario ya existe
  const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
  if (existingUser) {
    return {
      success: false,
      message: "Este correo electrónico ya está registrado. Por favor, inicia sesión.",
    }
  }

  // Crear nuevo usuario
  const newUser: User = {
    email,
    password,
    name: name || email.split("@")[0],
  }

  // Guardar usuario
  users.push(newUser)
  saveUsers(users)

  return { success: true, message: "Usuario registrado correctamente." }
}

// Función para iniciar sesión
export const loginUser = (email: string, password: string): { success: boolean; message: string; user?: User } => {
  const users = getUsers()

  // Buscar usuario
  const user = users.find((user) => user.email.toLowerCase() === email.toLowerCase())

  // Verificar si el usuario existe
  if (!user) {
    return {
      success: false,
      message: "No existe una cuenta con este correo electrónico. Por favor, regístrate.",
    }
  }

  // Verificar contraseña
  if (user.password !== password) {
    return {
      success: false,
      message: "Contraseña incorrecta. Por favor, inténtalo de nuevo.",
    }
  }

  // Iniciar sesión exitosa
  return {
    success: true,
    message: "Inicio de sesión exitoso.",
    user,
  }
}

// Función para actualizar datos del usuario
export const updateUser = (email: string, updates: Partial<User>): { success: boolean; message: string } => {
  const users = getUsers()

  // Buscar índice del usuario
  const userIndex = users.findIndex((user) => user.email.toLowerCase() === email.toLowerCase())

  // Verificar si el usuario existe
  if (userIndex === -1) {
    return {
      success: false,
      message: "Usuario no encontrado.",
    }
  }

  // Actualizar usuario
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
  }

  // Guardar cambios
  saveUsers(users)

  return {
    success: true,
    message: "Datos actualizados correctamente.",
  }
}

// Nueva función para recuperar cuenta
export const recoverAccount = (
  email: string,
  newPassword?: string,
): {
  success: boolean
  message: string
  userData?: User
} => {
  const users = getUsers()

  // Buscar usuario
  const userIndex = users.findIndex((user) => user.email.toLowerCase() === email.toLowerCase())

  // Verificar si el usuario existe
  if (userIndex === -1) {
    return {
      success: false,
      message: "No existe una cuenta con este correo electrónico.",
    }
  }

  // Si se proporciona una nueva contraseña, actualizarla
  if (newPassword) {
    users[userIndex].password = newPassword
    saveUsers(users)

    return {
      success: true,
      message: "Contraseña actualizada correctamente.",
    }
  }

  // Si solo se está verificando el email, devolver éxito
  return {
    success: true,
    message: "Usuario encontrado.",
    userData: users[userIndex],
  }
}

