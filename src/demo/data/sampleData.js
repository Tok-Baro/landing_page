export const departmentData = [
  { name: '개발본부', compliance: 82, avgVDT: 7.2, employees: 45 },
  { name: '영업본부', compliance: 65, avgVDT: 5.1, employees: 30 },
  { name: '경영지원', compliance: 91, avgVDT: 6.5, employees: 12 },
  { name: '마케팅팀', compliance: 73, avgVDT: 6.8, employees: 18 },
  { name: 'CS팀', compliance: 68, avgVDT: 7.5, employees: 22 },
];

export const weeklyTrendData = [
  { day: '월', vdt: 6.2, compliance: 75 },
  { day: '화', vdt: 6.8, compliance: 72 },
  { day: '수', vdt: 7.1, compliance: 68 },
  { day: '목', vdt: 6.5, compliance: 78 },
  { day: '금', vdt: 6.0, compliance: 82 },
];

export const riskAlerts = [
  { id: 1, name: '박민수', issue: '휴식 미준수 3일 연속', severity: 'high' },
  { id: 2, name: '윤재호', issue: '일평균 VDT 9시간 초과', severity: 'high' },
  { id: 3, name: '이영희', issue: '자세 경고 빈번 발생', severity: 'medium' },
];

// 조직 관리 - 3단계 계층 구조 (본부 → 팀 → 파트)
export const orgDivisions = [
  {
    id: 'dev',
    name: '개발본부',
    level: 'division',
    children: [
      {
        id: 'frontend',
        name: '프론트엔드팀',
        level: 'team',
        parentId: 'dev',
        children: [
          { id: 'fe-ui', name: 'UI파트', level: 'part', parentId: 'frontend', children: [] },
          { id: 'fe-ux', name: 'UX파트', level: 'part', parentId: 'frontend', children: [] },
        ],
      },
      {
        id: 'backend',
        name: '백엔드팀',
        level: 'team',
        parentId: 'dev',
        children: [
          { id: 'be-api', name: 'API파트', level: 'part', parentId: 'backend', children: [] },
          { id: 'be-infra', name: '인프라파트', level: 'part', parentId: 'backend', children: [] },
        ],
      },
      {
        id: 'qa',
        name: 'QA팀',
        level: 'team',
        parentId: 'dev',
        children: [],
      },
    ],
  },
  {
    id: 'sales',
    name: '영업본부',
    level: 'division',
    children: [
      {
        id: 'sales1',
        name: '영업1팀',
        level: 'team',
        parentId: 'sales',
        children: [
          { id: 'sales1-a', name: '기업영업파트', level: 'part', parentId: 'sales1', children: [] },
          { id: 'sales1-b', name: 'SMB영업파트', level: 'part', parentId: 'sales1', children: [] },
        ],
      },
      {
        id: 'sales2',
        name: '영업2팀',
        level: 'team',
        parentId: 'sales',
        children: [],
      },
    ],
  },
  {
    id: 'support',
    name: '경영지원본부',
    level: 'division',
    children: [
      { id: 'hr', name: '인사팀', level: 'team', parentId: 'support', children: [] },
      { id: 'finance', name: '재무팀', level: 'team', parentId: 'support', children: [] },
    ],
  },
  {
    id: 'marketing',
    name: '마케팅본부',
    level: 'division',
    children: [
      {
        id: 'mk-brand',
        name: '브랜드팀',
        level: 'team',
        parentId: 'marketing',
        children: [],
      },
      {
        id: 'mk-growth',
        name: '그로스팀',
        level: 'team',
        parentId: 'marketing',
        children: [
          { id: 'mk-perf', name: '퍼포먼스파트', level: 'part', parentId: 'mk-growth', children: [] },
          { id: 'mk-content', name: '콘텐츠파트', level: 'part', parentId: 'mk-growth', children: [] },
        ],
      },
    ],
  },
  {
    id: 'cs',
    name: 'CS본부',
    level: 'division',
    children: [
      { id: 'cs-support', name: '고객지원팀', level: 'team', parentId: 'cs', children: [] },
      { id: 'cs-success', name: '고객성공팀', level: 'team', parentId: 'cs', children: [] },
    ],
  },
];

// 직원 데이터 (departmentId로 소속 부서 참조, 양 페이지 공용)
export const orgEmployees = [
  { id: 'emp-1', name: '김철수', email: 'kim@company.com', position: '시니어 개발자', departmentId: 'fe-ui', status: 'active', compliance: 85, avgVDT: 6.2, lastActive: '10분 전', todayVDT: '5h 32m', phone: '010-1234-5678', extension: '1001', memo: '' },
  { id: 'emp-2', name: '이영희', email: 'lee@company.com', position: '주니어 개발자', departmentId: 'fe-ui', status: 'active', compliance: 72, avgVDT: 5.8, lastActive: '25분 전', todayVDT: '4h 15m', phone: '010-2345-6789', extension: '1002', memo: '수습 기간 중 (3개월)' },
  { id: 'emp-3', name: '박민수', email: 'park@company.com', position: '프론트엔드 리드', departmentId: 'fe-ux', status: 'warning', compliance: 45, avgVDT: 8.7, lastActive: '1시간 전', todayVDT: '8h 45m', phone: '010-3456-7890', extension: '1003', memo: 'VDT 초과 주의 대상, 면담 예정' },
  { id: 'emp-4', name: '정수진', email: 'jung@company.com', position: 'UX 디자이너', departmentId: 'fe-ux', status: 'active', compliance: 90, avgVDT: 5.5, lastActive: '5분 전', todayVDT: '6h 10m', phone: '010-4567-8901', extension: '', memo: '' },
  { id: 'emp-5', name: '최동훈', email: 'choi@company.com', position: 'UX 리서처', departmentId: 'fe-ux', status: 'active', compliance: 88, avgVDT: 5.1, lastActive: '20분 전', todayVDT: '4h 50m', phone: '010-5678-9012', extension: '1005', memo: '' },
  { id: 'emp-6', name: '강미나', email: 'kang@company.com', position: '백엔드 개발자', departmentId: 'be-api', status: 'active', compliance: 82, avgVDT: 7.0, lastActive: '15분 전', todayVDT: '5h 55m', phone: '010-6789-0123', extension: '2001', memo: '' },
  { id: 'emp-7', name: '윤재호', email: 'yoon@company.com', position: '백엔드 개발자', departmentId: 'be-api', status: 'warning', compliance: 38, avgVDT: 9.3, lastActive: '30분 전', todayVDT: '9h 20m', phone: '010-7890-1234', extension: '2002', memo: '건강 상담 진행 완료 (1/15)' },
  { id: 'emp-8', name: '한소희', email: 'han@company.com', position: 'DevOps 엔지니어', departmentId: 'be-infra', status: 'active', compliance: 78, avgVDT: 6.5, lastActive: '12분 전', todayVDT: '5h 40m', phone: '010-8901-2345', extension: '2003', memo: '' },
  { id: 'emp-9', name: '서준혁', email: 'seo@company.com', position: '인프라 엔지니어', departmentId: 'be-infra', status: 'active', compliance: 80, avgVDT: 7.1, lastActive: '8분 전', todayVDT: '6h 15m', phone: '010-9012-3456', extension: '2004', memo: '' },
  { id: 'emp-10', name: '임다은', email: 'lim@company.com', position: 'QA 엔지니어', departmentId: 'qa', status: 'active', compliance: 92, avgVDT: 5.0, lastActive: '3분 전', todayVDT: '4h 30m', phone: '010-0123-4567', extension: '3001', memo: '' },
  { id: 'emp-11', name: '장현우', email: 'jang@company.com', position: 'QA 리드', departmentId: 'qa', status: 'active', compliance: 87, avgVDT: 5.5, lastActive: '18분 전', todayVDT: '5h 10m', phone: '010-1111-2222', extension: '3002', memo: '' },
  { id: 'emp-12', name: '오지영', email: 'oh@company.com', position: '영업 매니저', departmentId: 'sales1-a', status: 'active', compliance: 65, avgVDT: 4.8, lastActive: '40분 전', todayVDT: '3h 50m', phone: '010-2222-3333', extension: '4001', memo: '' },
  { id: 'emp-13', name: '배성민', email: 'bae@company.com', position: '영업 담당', departmentId: 'sales1-a', status: 'active', compliance: 60, avgVDT: 5.2, lastActive: '1시간 전', todayVDT: '4h 20m', phone: '010-3333-4444', extension: '4002', memo: '' },
  { id: 'emp-14', name: '신유진', email: 'shin@company.com', position: 'SMB 영업', departmentId: 'sales1-b', status: 'active', compliance: 70, avgVDT: 4.5, lastActive: '35분 전', todayVDT: '3h 40m', phone: '010-4444-5555', extension: '', memo: '' },
  { id: 'emp-15', name: '조민재', email: 'jo@company.com', position: '영업 담당', departmentId: 'sales2', status: 'offline', compliance: 0, avgVDT: 0, lastActive: '2일 전', todayVDT: '-', phone: '010-5555-6666', extension: '4004', memo: '휴직 중' },
  { id: 'emp-16', name: '권나영', email: 'kwon@company.com', position: '인사 담당자', departmentId: 'hr', status: 'active', compliance: 95, avgVDT: 5.8, lastActive: '7분 전', todayVDT: '5h 20m', phone: '010-6666-7777', extension: '5001', memo: '' },
  { id: 'emp-17', name: '황도윤', email: 'hwang@company.com', position: '재무 분석가', departmentId: 'finance', status: 'active', compliance: 91, avgVDT: 6.0, lastActive: '22분 전', todayVDT: '5h 45m', phone: '010-7777-8888', extension: '5002', memo: '' },
  { id: 'emp-18', name: '노은서', email: 'noh@company.com', position: '브랜드 매니저', departmentId: 'mk-brand', status: 'active', compliance: 75, avgVDT: 6.3, lastActive: '50분 전', todayVDT: '5h 00m', phone: '010-8888-9999', extension: '6001', memo: '' },
  { id: 'emp-19', name: '문태현', email: 'moon@company.com', position: '퍼포먼스 마케터', departmentId: 'mk-perf', status: 'active', compliance: 68, avgVDT: 7.2, lastActive: '15분 전', todayVDT: '6h 30m', phone: '010-9999-0000', extension: '6002', memo: '' },
  { id: 'emp-20', name: '유서연', email: 'yoo@company.com', position: '콘텐츠 크리에이터', departmentId: 'mk-content', status: 'active', compliance: 73, avgVDT: 6.8, lastActive: '28분 전', todayVDT: '5h 50m', phone: '010-1010-2020', extension: '', memo: '' },
  { id: 'emp-21', name: '송지훈', email: 'song@company.com', position: '고객지원 담당', departmentId: 'cs-support', status: 'active', compliance: 70, avgVDT: 7.5, lastActive: '45분 전', todayVDT: '6h 45m', phone: '010-3030-4040', extension: '7001', memo: '' },
  { id: 'emp-22', name: '양하은', email: 'yang@company.com', position: 'CS 매니저', departmentId: 'cs-success', status: 'active', compliance: 77, avgVDT: 6.9, lastActive: '10분 전', todayVDT: '6h 00m', phone: '010-5050-6060', extension: '7002', memo: '' },
  { id: 'emp-23', name: '백승우', email: 'baek@company.com', position: '프론트엔드 개발자', departmentId: 'fe-ui', status: 'active', compliance: 83, avgVDT: 6.0, lastActive: '6분 전', todayVDT: '5h 15m', phone: '010-7070-8080', extension: '1004', memo: '' },
  { id: 'emp-24', name: '추가영', email: 'chu@company.com', position: '그로스 매니저', departmentId: 'mk-growth', status: 'active', compliance: 80, avgVDT: 6.5, lastActive: '33분 전', todayVDT: '5h 30m', phone: '010-9090-1010', extension: '6003', memo: '' },
  { id: 'emp-25', name: '하민석', email: 'ha@company.com', position: '고객성공 담당', departmentId: 'cs-success', status: 'pending', compliance: 0, avgVDT: 0, lastActive: '-', todayVDT: '-', phone: '010-1212-3434', extension: '', memo: '신규 입사 예정 (2월)' },
];
