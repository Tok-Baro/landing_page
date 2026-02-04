// Mock 인증 서비스 — 향후 api.js의 실제 API 호출로 교체

const STORAGE_KEY = 'ttokbaro_auth';

// Mock 관리자 계정
const MOCK_ADMINS = [
  {
    id: 1,
    name: '김관리자',
    email: 'admin@company.com',
    password: 'admin1234',
    role: 'super_admin',
    companyName: '(주)테크스타트',
  },
];

function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

const authService = {
  async login(email, password) {
    // Mock: 실제 API에서는 POST /api/auth/login
    const admin = MOCK_ADMINS.find((a) => a.email === email && a.password === password);
    if (!admin) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    const token = `mock-token-${Date.now()}`;
    const { password: _, ...adminData } = admin;
    const authData = { token, admin: adminData };
    setStoredAuth(authData);
    return authData;
  },

  async register(data) {
    // Mock: 실제 API에서는 POST /api/auth/register
    const { name, email, password, companyName } = data;
    const exists = MOCK_ADMINS.find((a) => a.email === email);
    if (exists) {
      throw new Error('이미 등록된 이메일입니다.');
    }
    const newAdmin = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'admin',
      companyName,
    };
    MOCK_ADMINS.push(newAdmin);
    const token = `mock-token-${Date.now()}`;
    const { password: _, ...adminData } = newAdmin;
    const authData = { token, admin: adminData };
    setStoredAuth(authData);
    return authData;
  },

  async logout() {
    clearStoredAuth();
  },

  getAuth() {
    return getStoredAuth();
  },

  isAuthenticated() {
    return !!getStoredAuth()?.token;
  },
};

export default authService;
