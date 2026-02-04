import { Link } from "react-router-dom";
import { toklogo } from "../assets/images";
import "../App.css";

export const Privacy = () => {
  return (
    <div>
      <header className="hero">
        <nav className="navbar">
          <div className="logo-container">
            <Link to="/">
              <img src={toklogo} alt="Tokbaro Logo" className="logo" />
            </Link>
            <span className="brand-name"> </span>
          </div>
        </nav>
        <div className="hero-content">
          <div className="hero-text">
            <h1>개인정보처리방침</h1>
            <p>똑바로 서비스의 개인정보 처리 방침입니다</p>
          </div>
        </div>
      </header>
      <section className="content container" style={{padding: '40px 20px', maxWidth: '900px', margin: '0 auto'}}>
        <div style={{lineHeight: '1.8', fontSize: '15px'}}>
          <p style={{marginBottom: '30px'}}>
            "똑바로"(이하 "회사")는 이용자의 개인정보를 소중히 여기며, 개인정보 보호법 및 관련 법령(이하 "관련 법령")을 준수합니다. 
            본 개인정보처리방침(이하 "본 방침")은 이용자의 개인정보가 어떠한 용도와 방식으로 수집·이용·보관·파기 등 처리되는지 설명하고, 
            개인정보 보호를 위해 회사가 어떠한 조치를 취하는지 명확히 알리기 위해 작성되었습니다. 
            또한 회사는 정보주체의 고충을 원활하게 처리할 수 있도록 하며, 그에 따라 다음과 같이 본 방침을 수립·공개합니다.
          </p>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>목차</h2>
          <ol style={{marginBottom: '30px', paddingLeft: '20px'}}>
            <li>개인정보의 수집 항목, 수집 및 이용목적, 보유 및 이용기간</li>
            <li>개인정보의 수집 및 이용목적</li>
            <li>개인정보의 제3자 제공</li>
            <li>개인정보처리의 위탁</li>
            <li>개인정보의 파기에 관한 사항</li>
            <li>이용자 및 법정대리인의 권리와 그 행사방법</li>
            <li>개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</li>
            <li>개인정보의 안전성 확보 조치</li>
            <li>개인정보 보호책임자 및 담당부서</li>
            <li>개인정보 처리방침의 변경에 관한 사항</li>
          </ol>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            1. 개인정보의 수집 항목, 수집 및 이용목적, 보유 및 이용기간
          </h2>
          <p>
            회사는 서비스 제공을 위해 아래와 같이 개인정보를 수집합니다. 서비스 제공을 위해 반드시 필요한 최소한의 정보를 필수항목으로, 
            그 외 특화된 서비스를 제공하기 위해 추가 수집하는 정보는 선택항목으로 동의를 받고 있으며, 
            선택항목에 동의하지 않은 경우에도 서비스 이용에 제한은 없습니다.
          </p>

          <div style={{overflowX: 'auto', marginTop: '20px', marginBottom: '30px'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd'}}>
              <thead>
                <tr style={{backgroundColor: '#f5f5f5'}}>
                  <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>구분</th>
                  <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>수집 항목</th>
                  <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>수집 방법</th>
                  <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>수집 및 이용목적</th>
                  <th style={{border: '1px solid #ddd', padding: '12px', textAlign: 'left'}}>보유 및 이용기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>필수</td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>
                    [계정 정보] 이름(또는 닉네임), 이메일, 비밀번호
                  </td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>회원가입 시 직접 입력</td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>
                    회원 식별, 계정 관리, 회원가입 의사 확인, 본인 확인, 공지사항 전달, 문의응답, 민원처리 등 고객지원, 분쟁 대응
                  </td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>회원 탈퇴 시까지</td>
                </tr>
                <tr>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>필수(민감)</td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>
                    [핵심 기능 정보/민감정보] HealthKit 연동 정보(심박수, 걸음 수, 에너지소모량), 
                    처리된 자세 분석 지표(일일 평균 목 각도, 나쁜 자세 시간, 활동 요약 등)
                  </td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>이용자 동의 후 API 연동 및 자동 측정</td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>
                    서비스 핵심 기능 제공(자세 인식, 자세 분석, 알림, 활동 분석, AI 웰니스 리포트 제공, 사용자 피드백 제공, 포인트의 산정·제공·활용)
                  </td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>회원 탈퇴 또는 동의 철회 시까지</td>
                </tr>
                <tr>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>선택</td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>
                    [맞춤형 정보] 성별, 연령대, 직업, 거주지(시/도), 관심사<br/>
                    [맞춤형 정보/민감정보] 흡연/음주 여부
                  </td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>사용자 직접 입력</td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>개인 맞춤형 피드백 제공, 통계 분석</td>
                  <td style={{border: '1px solid #ddd', padding: '12px'}}>회원 탈퇴 시까지</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{marginTop: '20px'}}>
            회사는 위에 명시된 항목 외에 추가적인 개인정보를 수집할 경우, 반드시 사전에 이용자에게 해당 사실을 알리고 별도의 동의를 받습니다.
          </p>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            2. 개인정보의 수집 및 이용목적
          </h2>
          <p>회사는 제1조에 따라 수집한 개인정보들을 다음의 목적으로도 이용합니다:</p>
          <ul style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li>서비스의 원활한 운영에 지장을 주는 행위에 대한 방지 및 제재</li>
            <li>인구통계학적 특성과 이용자의 관심, 기호, 성향의 추정을 통한 맞춤형 콘텐츠 추천 및 제공, 개인화된 서비스 제공</li>
            <li>서비스 오류 분석, 서비스 제공·유지·개선, 신규 서비스 개발</li>
            <li>서비스 이용 기록, 접속 빈도 및 서비스 이용에 대한 통계 등 내부 통계 분석</li>
            <li>시스템 안정성 확보</li>
          </ul>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            3. 개인정보의 제3자 제공
          </h2>
          <p>
            회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 
            다만, 아래의 경우에는 예외로 합니다:
          </p>
          <ul style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li>이용자가 사전에 제3자 제공에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            8. 개인정보의 안전성 확보 조치
          </h2>
          <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
          <ul style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
            <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
            <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
          </ul>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            9. 개인정보 보호책임자 및 담당부서
          </h2>
          <p>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 
            아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <div style={{marginTop: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px'}}>
            <p><strong>개인정보 보호책임자</strong></p>
            <p>성명: 정수현</p>
            <p>직책: 대표</p>
            <p>연락처: tokbaro.connect@gmail.com</p>
          </div>
          <p style={{marginTop: '20px'}}>
            정보주체는 회사의 서비스를 이용하면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 
            위 이메일로 요청할 수 있으며, 회사는 이에 대해 지체 없이 답변하고 처리하겠습니다.
          </p>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            개인정보 관련 신고 기관
          </h2>
          <p>개인정보 관련 신고나 상담이 필요한 경우에는 아래 기관을 통하여 도움을 받을 수 있습니다:</p>
          <ul style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li>개인정보침해 신고센터: (국번 없이) 118, <a href="https://privacy.kisa.or.kr" target="_blank" rel="noopener noreferrer">https://privacy.kisa.or.kr</a></li>
            <li>경찰청 사이버수사국: (국번 없이) 182, <a href="https://ecrm.cyber.go.kr" target="_blank" rel="noopener noreferrer">https://ecrm.cyber.go.kr</a></li>
            <li>개인정보 분쟁조정위원회: (국번 없이) 1833-6972, <a href="https://www.kopico.go.kr" target="_blank" rel="noopener noreferrer">https://www.kopico.go.kr</a></li>
          </ul>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            10. 개인정보 처리방침의 변경에 관한 사항
          </h2>
          <p>
            본 방침의 내용이 추가, 삭제 및 수정되는 등 변경될 경우, 회사는 개정 최소 7일 전(단, 이용자에게 불리한 변경 시 30일 전)부터 
            앱 내 공지사항 또는 팝업을 통해 사전 고지합니다. 변경된 방침에는 개정일자, 시행일자 및 주요 변경사항을 명시합니다.
          </p>

          <div style={{marginTop: '40px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', textAlign: 'center'}}>
            <p><strong>이 개인정보 처리방침의 시행일</strong></p>
            <p>2025년 [*]월 [*]일</p>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer-info">
            <div className="footer-logo">
              <img
                src={toklogo}
                alt="Tokbaro Logo"
                className="footer-logo-img"
              />
              <span className="footer-brand">똑바로 (Tokbaro)</span>
            </div>
            <div className="business-info">
              <p>
                <strong>
                  상호명: 똑바로 (Tokbaro) | 대표자: 정수현 | 사업자 등록번호:
                  640-65-00753
                </strong>
              </p>
              <p>
                <strong>주소:</strong> 서울특별시 종로구 동숭길 64, 5층
                S49호(동숭동), 03085
              </p>
              <p>
                <strong>이메일:</strong> tokbaro.connect@gmail.com
              </p>
              <p className="legal-links">
                <Link to="/privacy">개인정보처리방침</Link> |{" "}
                <Link to="/terms">이용약관</Link>
              </p>
            </div>
          </div>
          <p className="copyright">© 2025 Tokbaro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
