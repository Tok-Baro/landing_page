# 똑바로 (Tokbaro) - Landing Page

VDT(영상표시단말기) 작업 건강관리 솔루션 랜딩 페이지 + 관리자 데모

## 🚀 Tech Stack

- **React** 19.2.0
- **Vite** 7.2.4
- **React Router** 7.11.0
- **Tailwind CSS** 4.1.18 (데모용)
- **Recharts** (데모 차트)
- **Lucide React** (데모 아이콘)

## 📂 Project Structure

```
landing_page/
├── src/
│   ├── page/                 # 랜딩 페이지
│   │   ├── home.jsx          # 메인 랜딩
│   │   ├── Privacy.jsx       # 개인정보처리방침
│   │   └── Terms.jsx         # 이용약관
│   ├── demo/                 # 관리자 데모 (무료 체험)
│   │   ├── App.jsx           # 데모 메인 앱
│   │   ├── pages/            # 데모 페이지들
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── EmployeesPage.jsx
│   │   │   ├── OrganizationPage.jsx
│   │   │   ├── StatisticsPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── PolicyPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── components/       # 데모 컴포넌트
│   │   ├── services/         # API 서비스 (Mock)
│   │   ├── contexts/         # React Context
│   │   └── data/             # 샘플 데이터
│   ├── App.jsx               # 메인 라우터
│   └── main.jsx              # 엔트리 포인트
├── public/
├── package.json
└── README.md
```

## 🎯 Routes

- `/` - 메인 랜딩 페이지
- `/privacy` - 개인정보처리방침
- `/terms` - 이용약관
- `/demo/*` - 관리자 데모 (무료 체험)
  - `/demo` - 대시보드 (자동 로그인)
  - `/demo/employees` - 직원 관리
  - `/demo/organization` - 조직 관리
  - `/demo/statistics` - 통계 분석
  - `/demo/reports` - 리포트
  - `/demo/policy` - 정책 설정
  - `/demo/settings` - 설정
  - `/demo/login` - 로그인 (선택)
  - `/demo/register` - 회원가입 (선택)

## 🔧 Getting Started

### 의존성 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

개발 서버: http://localhost:5173/

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 미리보기
```bash
npm run preview
```

## 🎨 Demo Features

데모 모드(`/demo`)에서는 자동으로 관리자 계정으로 로그인됩니다.

**자동 로그인 계정:**
- 이메일: admin@company.com
- 비밀번호: admin1234

데모는 Mock 데이터를 사용하며, 실제 서버 연동 없이 작동합니다.

## 📦 Dependencies

### Core
- react, react-dom
- react-router-dom
- vite

### Demo
- lucide-react (아이콘)
- recharts (차트)
- @tailwindcss/postcss (스타일링)

## 🚀 Deployment

Vercel 배포 설정 포함 (`vercel.json`)

```bash
# Vercel CLI로 배포
vercel --prod
```

또는 GitHub 연동으로 자동 배포

## 📝 Notes

- 데모 데이터는 `src/demo/data/sampleData.js`에서 관리
- 인증은 localStorage 기반 Mock 서비스 (`src/demo/services/authService.js`)
- 실제 API 연동은 `src/demo/services/api.js`에서 구현 예정

## 📧 Contact

- Email: tokbaro.connect@gmail.com
- 사업자등록번호: 640-65-00753
