import { Link } from "react-router-dom";
import { toklogo } from "../assets/images";
import { useState } from "react";

// Simple SVG Icons
const Icons = {
  Eye: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  EyeOff: () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  HeartPulse: () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Monitor: () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Building: () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Download: () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  BarChart: () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
};

export const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: "VDT란 무엇인가요?",
      a: "VDT(Visual Display Terminal)는 영상표시단말기를 의미하며, 컴퓨터 모니터와 같이 화면을 통해 정보를 표시하는 장치입니다. 산업안전보건법에서는 VDT 작업자의 건강을 보호하기 위해 연속 작업시간 제한과 휴식시간 부여를 의무화하고 있습니다."
    },
    {
      q: "직원 개인정보는 안전한가요?",
      a: "똑바로는 최소한의 정보만 수집합니다. VDT 사용 시간과 휴식 시간만 추적하며, 화면 캡처나 키보드 입력 등은 절대 수집하지 않습니다. 모든 데이터는 암호화되어 저장되며, GDPR 및 개인정보보호법을 준수합니다."
    },
    {
      q: "기존 업무에 방해되지 않나요?",
      a: "직원 PC에 설치되는 앱은 백그라운드에서 조용히 실행되며, 휴식 알림도 스누즈 기능을 제공합니다. Standard 모드에서는 3회까지 스누즈 가능하여, 급한 업무를 방해하지 않습니다."
    },
    {
      q: "도입까지 얼마나 걸리나요?",
      a: "관리자 계정 생성 후 정책 설정까지 5분, 직원 앱 설치까지 포함해도 30분 이내에 도입 가능합니다. 별도의 하드웨어나 복잡한 설정이 필요 없습니다."
    },
    {
      q: "중대재해처벌법과 어떤 관련이 있나요?",
      a: "중대재해처벌법 시행으로 VDT 작업 관리 미흡은 법적 책임으로 이어질 수 있습니다. 똑바로는 산업안전보건법상 VDT 작업 기준(연속 1시간 작업 시 10분 휴식)을 자동으로 관리하고, 준수 여부를 문서화하여 법적 리스크를 최소화합니다."
    },
    {
      q: "해지는 어떻게 하나요?",
      a: "언제든지 자유롭게 해지 가능합니다. 약정 기간이나 위약금이 없으며, 해지 요청 즉시 처리됩니다. 데이터는 30일간 보관 후 완전히 삭제됩니다."
    },
  ];

  return (
    <div style={{backgroundColor: '#0f172a', minHeight: '100vh', color: '#ffffff'}}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Icons.Eye />
            <span style={{fontSize: '1.25rem', fontWeight: 'bold'}}>똑바로</span>
          </div>
          <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
            <button onClick={() => scrollToSection('features')} style={{background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem'}}>
              기능소개
            </button>
            <button onClick={() => scrollToSection('pricing')} style={{background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem'}}>
              요금제
            </button>
            <Link to="/demo/login" style={{textDecoration: 'none', color: '#94a3b8', fontSize: '0.875rem'}}>
              로그인
            </Link>
            <Link 
              to="/demo/register"
              style={{
                background: 'linear-gradient(to right, #6366f1, #a855f7)',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              무료 시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{padding: '5rem 1.5rem', maxWidth: '1280px', margin: '0 auto'}}>
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            padding: '0.375rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '2rem'
          }}>
            중대재해처벌법 대응 솔루션
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            직원의 눈 건강,<br />
            법적 의무를 넘어 기업 문화로
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            color: '#94a3b8',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem'
          }}>
            VDT 작업시간 자동 추적부터 휴식 알림, 법적 준수 리포트까지.<br />
            똑바로 하나로 끝내세요.
          </p>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link 
              to="/demo/register"
              style={{
                background: 'linear-gradient(to right, #6366f1, #a855f7)',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '1.125rem',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              무료로 시작하기
            </Link>
            <Link 
              to="/demo"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '1.125rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              데모 체험하기
            </Link>
          </div>

          <p style={{marginTop: '2rem', fontSize: '0.875rem', color: '#64748b'}}>
            현재 <span style={{color: '#6366f1', fontWeight: '600'}}>127개 기업</span>이 사용 중
          </p>
        </div>

        {/* Dashboard Preview Mockup */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1.5rem',
          padding: '2rem',
          marginTop: '4rem'
        }}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem'}}>
            <div style={{backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '1rem'}}>
              <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem'}}>활성 직원</div>
              <div style={{fontSize: '2rem', fontWeight: 'bold'}}>23명</div>
            </div>
            <div style={{backgroundColor: 'rgba(168, 85, 247, 0.1)', padding: '1.5rem', borderRadius: '1rem'}}>
              <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem'}}>평균 VDT</div>
              <div style={{fontSize: '2rem', fontWeight: 'bold'}}>6.5시간</div>
            </div>
            <div style={{backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '1.5rem', borderRadius: '1rem'}}>
              <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem'}}>준수율</div>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#22c55e'}}>76%</div>
            </div>
            <div style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '1rem'}}>
              <div style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem'}}>위험군</div>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ef4444'}}>2명</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section style={{padding: '5rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
        <div style={{maxWidth: '1280px', margin: '0 auto'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem'}}>
            이런 고민, 하고 계신가요?
          </h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <div style={{color: '#6366f1', marginBottom: '1rem'}}>
                <Icons.Shield />
              </div>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem'}}>법적 리스크</h3>
              <p style={{color: '#94a3b8', lineHeight: '1.7'}}>
                중대재해처벌법 위반 시 최대 1년 징역, 10억 과태료.<br />
                VDT 작업 관리 미비로 산업안전보건법 위반 적발 증가
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <div style={{color: '#a855f7', marginBottom: '1rem'}}>
                <Icons.EyeOff />
              </div>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem'}}>관리 사각지대</h3>
              <p style={{color: '#94a3b8', lineHeight: '1.7'}}>
                누가 얼마나 쉬고 있는지 파악 불가.<br />
                엑셀 수기 관리로는 100명 이상 추적 불가능
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <div style={{color: '#22c55e', marginBottom: '1rem'}}>
                <Icons.HeartPulse />
              </div>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem'}}>직원 건강 악화</h3>
              <p style={{color: '#94a3b8', lineHeight: '1.7'}}>
                VDT 증후군: 안구건조, 거북목, 손목터널.<br />
                장시간 연속 작업으로 생산성 오히려 하락
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{padding: '5rem 1.5rem'}}>
        <div style={{maxWidth: '1280px', margin: '0 auto'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem'}}>
            핵심 기능
          </h2>
          <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '1.125rem', marginBottom: '4rem'}}>
            구체적으로 무엇을 해결해드릴까요?
          </p>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem'}}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <div style={{color: '#6366f1', marginBottom: '1.5rem'}}>
                <Icons.Monitor />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>실시간 모니터링</h3>
              <p style={{color: '#94a3b8', lineHeight: '1.7', marginBottom: '1rem'}}>
                직원별 VDT 사용 현황을 한눈에.<br />
                활성/주의/오프라인 상태 실시간 확인
              </p>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                [직원 리스트 + 상태 뱃지]
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <div style={{color: '#a855f7', marginBottom: '1.5rem'}}>
                <Icons.Bell />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>스마트 휴식 알림</h3>
              <p style={{color: '#94a3b8', lineHeight: '1.7', marginBottom: '1rem'}}>
                연속 작업 50분 → 자동 휴식 알림.<br />
                스누즈 횟수 제한, soft/standard/strict 모드
              </p>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                [알림 팝업 UI]
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <div style={{color: '#22c55e', marginBottom: '1.5rem'}}>
                <Icons.FileText />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>법적 준수 리포트</h3>
              <p style={{color: '#94a3b8', lineHeight: '1.7', marginBottom: '1rem'}}>
                산업안전보건법 기준 VDT 관리 문서 원클릭 생성.<br />
                부서별/기간별 준수율 리포트
              </p>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                [리포트 프리뷰]
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <div style={{color: '#f59e0b', marginBottom: '1.5rem'}}>
                <Icons.Building />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>조직별 맞춤 정책</h3>
              <p style={{color: '#94a3b8', lineHeight: '1.7', marginBottom: '1rem'}}>
                본부/팀/파트 3단계 조직 구조.<br />
                부서별로 다른 휴식 정책 설정 가능
              </p>
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                [정책 설정 UI]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section style={{padding: '5rem 1.5rem', backgroundColor: 'rgba(99, 102, 241, 0.05)'}}>
        <div style={{maxWidth: '1280px', margin: '0 auto'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem'}}>
            도입 효과
          </h2>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '4rem', fontWeight: 'bold', color: '#6366f1', marginBottom: '0.5rem'}}>
                89%
              </div>
              <p style={{fontSize: '1.125rem', color: '#94a3b8'}}>휴식 준수율 평균 향상</p>
            </div>

            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '4rem', fontWeight: 'bold', color: '#a855f7', marginBottom: '0.5rem'}}>
                3시간
              </div>
              <p style={{fontSize: '1.125rem', color: '#94a3b8'}}>월간 관리 업무 절감</p>
            </div>

            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '4rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '0.5rem'}}>
                100%
              </div>
              <p style={{fontSize: '1.125rem', color: '#94a3b8'}}>법적 준수 리포트 자동화</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{padding: '5rem 1.5rem'}}>
        <div style={{maxWidth: '1280px', margin: '0 auto'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem'}}>
            도입 절차
          </h2>
          <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '1.125rem', marginBottom: '4rem'}}>
            복잡하지 않습니다
          </p>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '2px solid #6366f1',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#6366f1',
                margin: '0 auto 1.5rem'
              }}>
                1
              </div>
              <div style={{color: '#6366f1', marginBottom: '1rem', display: 'flex', justifyContent: 'center'}}>
                <Icons.Settings />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem'}}>정책 설정</h3>
              <p style={{color: '#94a3b8', lineHeight: '1.7'}}>
                관리자가 웹에서 연속 작업시간, 휴식시간, 알림 모드 설정
              </p>
              <p style={{color: '#6366f1', fontSize: '0.875rem', marginTop: '0.5rem'}}>5분이면 끝납니다</p>
            </div>

            <div style={{textAlign: 'center'}}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                border: '2px solid #a855f7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#a855f7',
                margin: '0 auto 1.5rem'
              }}>
                2
              </div>
              <div style={{color: '#a855f7', marginBottom: '1rem', display: 'flex', justifyContent: 'center'}}>
                <Icons.Download />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem'}}>직원 앱 설치</h3>
              <p style={{color: '#94a3b8', lineHeight: '1.7'}}>
                직원 PC에 경량 앱 배포 (30MB 이하)
              </p>
              <p style={{color: '#a855f7', fontSize: '0.875rem', marginTop: '0.5rem'}}>백그라운드 자동 실행, 업무 방해 없음</p>
            </div>

            <div style={{textAlign: 'center'}}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '2px solid #22c55e',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#22c55e',
                margin: '0 auto 1.5rem'
              }}>
                3
              </div>
              <div style={{color: '#22c55e', marginBottom: '1rem', display: 'flex', justifyContent: 'center'}}>
                <Icons.BarChart />
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem'}}>대시보드 확인</h3>
              <p style={{color: '#94a3b8', lineHeight: '1.7'}}>
                실시간 현황 모니터링
              </p>
              <p style={{color: '#22c55e', fontSize: '0.875rem', marginTop: '0.5rem'}}>위험군 알림 + 리포트 생성</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{padding: '5rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
        <div style={{maxWidth: '1280px', margin: '0 auto'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem'}}>
            요금제
          </h2>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            {/* Starter */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem'}}>Starter</h3>
              <div style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
                무료
              </div>
              <p style={{color: '#94a3b8', marginBottom: '2rem'}}>10명까지</p>
              
              <div style={{marginBottom: '2rem'}}>
                {['대시보드', '기본 리포트', '전사 1개 정책', 'standard 알림', '이메일 지원'].map((feature) => (
                  <div key={feature} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <div style={{color: '#22c55e'}}>
                      <Icons.Check />
                    </div>
                    <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/demo/register"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                무료 시작
              </Link>
            </div>

            {/* Pro */}
            <div style={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              backdropFilter: 'blur(24px)',
              border: '2px solid #6366f1',
              borderRadius: '1.5rem',
              padding: '2rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#6366f1',
                color: 'white',
                padding: '0.25rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                MOST POPULAR
              </div>

              <h3 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem'}}>Pro</h3>
              <div style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
                월 49,000원
              </div>
              <p style={{color: '#94a3b8', marginBottom: '2rem'}}>50명까지</p>
              
              <div style={{marginBottom: '2rem'}}>
                {['대시보드', '상세 리포트', '부서별 정책', '전체 알림 모드', '이메일 + 채팅 지원'].map((feature) => (
                  <div key={feature} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <div style={{color: '#22c55e'}}>
                      <Icons.Check />
                    </div>
                    <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/demo/register"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: 'linear-gradient(to right, #6366f1, #a855f7)',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                14일 무료 체험
              </Link>
            </div>

            {/* Enterprise */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '2rem'
            }}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem'}}>Enterprise</h3>
              <div style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
                별도 문의
              </div>
              <p style={{color: '#94a3b8', marginBottom: '2rem'}}>무제한</p>
              
              <div style={{marginBottom: '2rem'}}>
                {['대시보드', '커스텀 리포트', '부서별 정책 + API', '전체 알림 모드', '전담 매니저'].map((feature) => (
                  <div key={feature} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
                    <div style={{color: '#22c55e'}}>
                      <Icons.Check />
                    </div>
                    <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href="mailto:tokbaro.connect@gmail.com"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                도입 문의
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding: '5rem 1.5rem'}}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem'}}>
            자주 묻는 질문
          </h2>

          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '1.125rem',
                    fontWeight: '600'
                  }}
                >
                  {faq.q}
                  <div style={{
                    transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                  }}>
                    <Icons.ChevronDown />
                  </div>
                </button>
                {openFaq === index && (
                  <div style={{
                    padding: '0 1.5rem 1.5rem',
                    color: '#94a3b8',
                    lineHeight: '1.7'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
        textAlign: 'center'
      }}>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>
            지금 바로 직원 건강 관리를 시작하세요
          </h2>
          <p style={{fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9}}>
            5분 안에 설정 완료. 신용카드 필요 없음.
          </p>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link 
              to="/demo/register"
              style={{
                backgroundColor: 'white',
                color: '#6366f1',
                padding: '0.875rem 2rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '1.125rem'
              }}
            >
              무료로 시작하기
            </Link>
            <Link 
              to="/demo"
              style={{
                border: '2px solid white',
                color: 'white',
                padding: '0.875rem 2rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '1.125rem'
              }}
            >
              데모 체험하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{padding: '3rem 1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)'}}>
        <div style={{maxWidth: '1280px', margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem'}}>
            <div>
              <h4 style={{fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: '#94a3b8'}}>서비스</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <button onClick={() => scrollToSection('features')} style={{background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem'}}>
                  기능소개
                </button>
                <button onClick={() => scrollToSection('pricing')} style={{background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem'}}>
                  요금제
                </button>
              </div>
            </div>

            <div>
              <h4 style={{fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: '#94a3b8'}}>지원</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <a href="mailto:tokbaro.connect@gmail.com" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.875rem'}}>
                  도움말
                </a>
                <a href="mailto:tokbaro.connect@gmail.com" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.875rem'}}>
                  도입문의
                </a>
              </div>
            </div>

            <div>
              <h4 style={{fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: '#94a3b8'}}>법적</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <Link to="/terms" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.875rem'}}>
                  이용약관
                </Link>
                <Link to="/privacy" style={{color: '#64748b', textDecoration: 'none', fontSize: '0.875rem'}}>
                  개인정보처리방침
                </Link>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <img src={toklogo} alt="Tokbaro Logo" style={{width: '24px', height: '24px'}} />
              <span style={{fontWeight: '600'}}>똑바로 (Tokbaro)</span>
            </div>
            
            <div style={{fontSize: '0.875rem', color: '#64748b', lineHeight: '1.7'}}>
              <p><strong>상호명:</strong> 똑바로 (Tokbaro) | <strong>대표자:</strong> 정수현 | <strong>사업자 등록번호:</strong> 640-65-00753</p>
              <p><strong>주소:</strong> 서울특별시 종로구 동숭길 64, 5층 S49호(동숭동), 03085</p>
              <p><strong>이메일:</strong> tokbaro.connect@gmail.com</p>
            </div>

            <p style={{fontSize: '0.875rem', color: '#64748b'}}>
              © 2025 Tokbaro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
