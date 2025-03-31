// Translations for the app in different languages

export type Language = "es" | "en" | "pt" | "zh"

export type CountryCode = "CO" | "MX" | "US" | "HN" | "VE" | "PE" | "CR" | "GT" | "SV" | "BZ" | "BR" | "CN"

export const countryNames: Record<CountryCode, string> = {
  CO: "Colombia",
  MX: "México",
  US: "United States",
  HN: "Honduras",
  VE: "Venezuela",
  PE: "Perú",
  CR: "Costa Rica",
  GT: "Guatemala",
  SV: "El Salvador",
  BZ: "Belize",
  BR: "Brasil",
  CN: "中国",
}

export const countryToLanguage: Record<CountryCode, Language> = {
  CO: "es",
  MX: "es",
  US: "en",
  HN: "es",
  VE: "es",
  PE: "es",
  CR: "es",
  GT: "es",
  SV: "es",
  BZ: "es",
  BR: "pt",
  CN: "zh",
}

export const languageNames: Record<Language, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
  zh: "中文",
}

export const translations = {
  es: {
    // Common
    appName: "Chat App",
    search: "Buscar",
    send: "Enviar",
    cancel: "Cancelar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    close: "Cerrar",
    back: "Atrás",
    next: "Siguiente",
    done: "Listo",

    // Auth
    login: "Iniciar sesión",
    signup: "Registrarse",
    logout: "Cerrar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    name: "Nombre",
    forgotPassword: "¿Olvidaste tu contraseña?",
    noAccount: "¿No tienes una cuenta?",
    haveAccount: "¿Ya tienes una cuenta?",

    // Chat
    message: "Mensaje",
    typing: "escribiendo...",
    online: "En línea",
    offline: "Desconectado",
    lastSeen: "Última vez",
    newMessage: "Nuevo mensaje",
    writeMessage: "Escribe un mensaje",

    // Contacts
    contacts: "Contactos",
    allContacts: "Todos los contactos",
    appContacts: "En Chat App",
    invite: "Invitar",
    contactPermission: "Permiso de contactos",
    contactPermissionDesc: "Para encontrar a tus amigos que usan Chat App, necesitamos acceder a tus contactos.",
    allow: "Permitir",
    deny: "No permitir",
    permissionDenied: "Permiso denegado",
    permissionDeniedDesc:
      "No podemos acceder a tus contactos. Puedes cambiar esto en la configuración de tu dispositivo.",
    tryAgain: "Intentar de nuevo",

    // Search
    searchUsers: "Buscar usuarios",
    searchPlaceholder: "Buscar por nombre, usuario o correo",
    results: "Resultados",
    recentSearches: "Búsquedas recientes",
    clearAll: "Borrar todo",
    noResults: "No se encontraron resultados",
    tryOtherTerm: "Intenta con otro término de búsqueda",
    noRecentSearches: "No hay búsquedas recientes",
    recentSearchesDesc: "Tus búsquedas recientes aparecerán aquí",

    // Profile
    profile: "Perfil",
    settings: "Configuración",
    changePhoto: "Cambiar foto",
    uploadPhoto: "Subir foto",
    language: "Idioma",
    country: "País",
    theme: "Tema",
    notifications: "Notificaciones",
    privacy: "Privacidad",
    help: "Ayuda",
    about: "Acerca de",
    version: "Versión",

    // Attachments
    document: "Documento",
    photo: "Foto",
    camera: "Cámara",
    audio: "Audio",
    location: "Ubicación",
    contact: "Contacto",
    file: "Archivo",
    music: "Música",

    // Welcome screen
    welcome: "Bienvenido a Chat App",
    welcomeDesc: "Selecciona un chat para comenzar a enviar mensajes o inicia una nueva conversación.",

    // Settings
    appearance: "Apariencia",
    dark: "Oscuro",
    light: "Claro",
    system: "Sistema",
    languageSettings: "Configuración de idioma",
    countrySettings: "Configuración de país",
    autoDetect: "Detectar automáticamente",
    profileUpdated: "Perfil actualizado correctamente",

    // Terms
    terms: "Al iniciar sesión, aceptas nuestros términos y condiciones.",
  },

  en: {
    // Common
    appName: "Chat App",
    search: "Search",
    send: "Send",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    back: "Back",
    next: "Next",
    done: "Done",

    // Auth
    login: "Log in",
    signup: "Sign up",
    logout: "Log out",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    name: "Name",
    forgotPassword: "Forgot your password?",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",

    // Chat
    message: "Message",
    typing: "typing...",
    online: "Online",
    offline: "Offline",
    lastSeen: "Last seen",
    newMessage: "New message",
    writeMessage: "Write a message",

    // Contacts
    contacts: "Contacts",
    allContacts: "All contacts",
    appContacts: "On Chat App",
    invite: "Invite",
    contactPermission: "Contact permission",
    contactPermissionDesc: "To find your friends who use Chat App, we need access to your contacts.",
    allow: "Allow",
    deny: "Deny",
    permissionDenied: "Permission denied",
    permissionDeniedDesc: "We can't access your contacts. You can change this in your device settings.",
    tryAgain: "Try again",

    // Search
    searchUsers: "Search users",
    searchPlaceholder: "Search by name, username or email",
    results: "Results",
    recentSearches: "Recent searches",
    clearAll: "Clear all",
    noResults: "No results found",
    tryOtherTerm: "Try another search term",
    noRecentSearches: "No recent searches",
    recentSearchesDesc: "Your recent searches will appear here",

    // Profile
    profile: "Profile",
    settings: "Settings",
    changePhoto: "Change photo",
    uploadPhoto: "Upload photo",
    language: "Language",
    country: "Country",
    theme: "Theme",
    notifications: "Notifications",
    privacy: "Privacy",
    help: "Help",
    about: "About",
    version: "Version",

    // Attachments
    document: "Document",
    photo: "Photo",
    camera: "Camera",
    audio: "Audio",
    location: "Location",
    contact: "Contact",
    file: "File",
    music: "Music",

    // Welcome screen
    welcome: "Welcome to Chat App",
    welcomeDesc: "Select a chat to start sending messages or start a new conversation.",

    // Settings
    appearance: "Appearance",
    dark: "Dark",
    light: "Light",
    system: "System",
    languageSettings: "Language settings",
    countrySettings: "Country settings",
    autoDetect: "Auto-detect",
    profileUpdated: "Profile updated successfully",

    // Terms
    terms: "By logging in, you agree to our terms and conditions.",
  },

  pt: {
    // Common
    appName: "Chat App",
    search: "Buscar",
    send: "Enviar",
    cancel: "Cancelar",
    save: "Salvar",
    delete: "Excluir",
    edit: "Editar",
    close: "Fechar",
    back: "Voltar",
    next: "Próximo",
    done: "Concluído",

    // Auth
    login: "Entrar",
    signup: "Cadastrar",
    logout: "Sair",
    email: "E-mail",
    password: "Senha",
    confirmPassword: "Confirmar senha",
    name: "Nome",
    forgotPassword: "Esqueceu sua senha?",
    noAccount: "Não tem uma conta?",
    haveAccount: "Já tem uma conta?",

    // Chat
    message: "Mensagem",
    typing: "digitando...",
    online: "Online",
    offline: "Offline",
    lastSeen: "Visto por último",
    newMessage: "Nova mensagem",
    writeMessage: "Escreva uma mensagem",

    // Contacts
    contacts: "Contatos",
    allContacts: "Todos os contatos",
    appContacts: "No Chat App",
    invite: "Convidar",
    contactPermission: "Permissão de contatos",
    contactPermissionDesc: "Para encontrar seus amigos que usam o Chat App, precisamos acessar seus contatos.",
    allow: "Permitir",
    deny: "Negar",
    permissionDenied: "Permissão negada",
    permissionDeniedDesc:
      "Não podemos acessar seus contatos. Você pode alterar isso nas configurações do seu dispositivo.",
    tryAgain: "Tentar novamente",

    // Search
    searchUsers: "Buscar usuários",
    searchPlaceholder: "Buscar por nome, usuário ou e-mail",
    results: "Resultados",
    recentSearches: "Buscas recentes",
    clearAll: "Limpar tudo",
    noResults: "Nenhum resultado encontrado",
    tryOtherTerm: "Tente outro termo de busca",
    noRecentSearches: "Sem buscas recentes",
    recentSearchesDesc: "Suas buscas recentes aparecerão aqui",

    // Profile
    profile: "Perfil",
    settings: "Configurações",
    changePhoto: "Mudar foto",
    uploadPhoto: "Carregar foto",
    language: "Idioma",
    country: "País",
    theme: "Tema",
    notifications: "Notificações",
    privacy: "Privacidade",
    help: "Ajuda",
    about: "Sobre",
    version: "Versão",

    // Attachments
    document: "Documento",
    photo: "Foto",
    camera: "Câmera",
    audio: "Áudio",
    location: "Localização",
    contact: "Contato",
    file: "Arquivo",
    music: "Música",

    // Welcome screen
    welcome: "Bem-vindo ao Chat App",
    welcomeDesc: "Selecione um chat para começar a enviar mensagens ou inicie uma nova conversa.",

    // Settings
    appearance: "Aparência",
    dark: "Escuro",
    light: "Claro",
    system: "Sistema",
    languageSettings: "Configurações de idioma",
    countrySettings: "Configurações de país",
    autoDetect: "Detectar automaticamente",
    profileUpdated: "Perfil atualizado com sucesso",

    // Terms
    terms: "Ao fazer login, você concorda com nossos termos e condições.",
  },

  zh: {
    // Common
    appName: "聊天应用",
    search: "搜索",
    send: "发送",
    cancel: "取消",
    save: "保存",
    delete: "删除",
    edit: "编辑",
    close: "关闭",
    back: "返回",
    next: "下一步",
    done: "完成",

    // Auth
    login: "登录",
    signup: "注册",
    logout: "退出登录",
    email: "电子邮件",
    password: "密码",
    confirmPassword: "确认密码",
    name: "姓名",
    forgotPassword: "忘记密码？",
    noAccount: "没有账号？",
    haveAccount: "已有账号？",

    // Chat
    message: "消息",
    typing: "正在输入...",
    online: "在线",
    offline: "离线",
    lastSeen: "最后在线",
    newMessage: "新消息",
    writeMessage: "写一条消息",

    // Contacts
    contacts: "联系人",
    allContacts: "所有联系人",
    appContacts: "使用聊天应用的联系人",
    invite: "邀请",
    contactPermission: "联系人权限",
    contactPermissionDesc: "为了找到使用聊天应用的朋友，我们需要访问您的联系人。",
    allow: "允许",
    deny: "拒绝",
    permissionDenied: "权限被拒绝",
    permissionDeniedDesc: "我们无法访问您的联系人。您可以在设备设置中更改此设置。",
    tryAgain: "重试",

    // Search
    searchUsers: "搜索用户",
    searchPlaceholder: "按姓名、用户名或电子邮件搜索",
    results: "结果",
    recentSearches: "最近搜索",
    clearAll: "全部清除",
    noResults: "未找到结果",
    tryOtherTerm: "尝试其他搜索词",
    noRecentSearches: "没有最近搜索",
    recentSearchesDesc: "您的最近搜索将显示在这里",

    // Profile
    profile: "个人资料",
    settings: "设置",
    changePhoto: "更改照片",
    uploadPhoto: "上传照片",
    language: "语言",
    country: "国家",
    theme: "主题",
    notifications: "通知",
    privacy: "隐私",
    help: "帮助",
    about: "关于",
    version: "版本",

    // Attachments
    document: "文档",
    photo: "照片",
    camera: "相机",
    audio: "音频",
    location: "位置",
    contact: "联系人",
    file: "文件",
    music: "音乐",

    // Welcome screen
    welcome: "欢迎使用聊天应用",
    welcomeDesc: "选择一个聊天开始发送消息或开始新对话。",

    // Settings
    appearance: "外观",
    dark: "深色",
    light: "浅色",
    system: "系统",
    languageSettings: "语言设置",
    countrySettings: "国家设置",
    autoDetect: "自动检测",
    profileUpdated: "个人资料已成功更新",

    // Terms
    terms: "登录即表示您同意我们的条款和条件。",
  },
}

