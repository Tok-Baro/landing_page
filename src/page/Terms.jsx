import { Link } from "react-router-dom";
import { toklogo } from "../assets/images";
import "../App.css";

export const Terms = () => {
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
            <h1>서비스 이용약관</h1>
            <p>똑바로 서비스 이용약관입니다</p>
          </div>
        </div>
      </header>
      <section className="content container" style={{padding: '40px 20px', maxWidth: '900px', margin: '0 auto'}}>
        <div style={{lineHeight: '1.8', fontSize: '15px'}}>
          <h2 style={{marginTop: '20px', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center'}}>
            "똑바로" 서비스 이용약관
          </h2>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            제1조 (목적)
          </h2>
          <p>
            본 약관은 "똑바로"(이하 "회사")가 제공하는 모바일 웰니스 서비스(이하 "서비스")의 이용과 관련하여 
            회사와 이용자 간의 권리, 의무, 책임, 및 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            제2조 (용어의 정의)
          </h2>
          <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
          <ol style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li style={{marginBottom: '10px'}}>
              <strong>"서비스"</strong>란 AirPods 및 iPhone 센서와 HealthKit 데이터를 이용하여 사용자의 목 자세 및 활동 패턴을 분석하고, 
              이와 관련한 피드백·알림·리포트 등의 기능을 제공하는 서비스를 말합니다. 또한, 그 외에도 회사가 마련하여 제공하는 모든 서비스를 말합니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              <strong>"이용자"</strong>란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              <strong>"회원"</strong>이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 본 약관에 동의하고, 
              회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              <strong>"HealthKit 데이터"</strong>란 Apple의 HealthKit을 통해 연동되는 건강 관련 정보(심박수, 걸음 수, 에너지소모량 등)를 말합니다.
            </li>
          </ol>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            제3조 (약관의 효력 및 변경)
          </h2>
          <ol style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li style={{marginBottom: '10px'}}>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
            <li style={{marginBottom: '10px'}}>본 약관은 앱, 및 회사의 웹 또는 모바일 페이지 내 게시합니다.</li>
            <li style={{marginBottom: '10px'}}>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
            <li style={{marginBottom: '10px'}}>
              회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 그 개정약관을 그 적용일자 7일 전부터 적용일자 전일까지 공지 또는 통지합니다. 
              다만, 회원에게 불리한 약관의 변경의 경우에는, 그 적용일자 30일 전부터 공지 또는 통지합니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회사가 전항에 따라 개정약관을 공지 또는 통지하면서 회원에게 개정약관 적용일자 전까지 명시적으로 거부의 의사표시를 하지 않으면 
              개정약관에 동의하는 의사표시가 표명된 것으로 본다는 뜻을 명확하게 공지 또는 통지하였음에도 회원이 해당 기간 내에 명시적으로 
              거부의 의사표시를 하지 아니한 경우 회원이 개정 약관에 동의한 것으로 봅니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회원이 개정약관의 내용에 동의하지 않는 경우 회사는 해당 회원에 대하여 개정약관의 내용을 적용할 수 없으며, 
              이 경우 회사는 회원의 서비스 이용을 제한할 수 있습니다. 또한 회사가 개정약관에 동의하지 않은 회원에게 기존 약관을 적용할 수 없는 경우 
              회사는 해당 회원과의 이용계약을 해지할 수 있습니다. 회원 역시 이 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.
            </li>
          </ol>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            제4조 (약관 외 준칙)
          </h2>
          <ol style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li style={{marginBottom: '10px'}}>
              본 약관에서 정하지 아니한 사항은 전기통신사업법, 전자상거래 등에서의 소비자보호에 관한 법률, 개인정보 보호법 등 
              관련 법령의 규정과 일반적인 상관례에 의합니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회사는 필요한 경우 특정 서비스에 관하여 별도의 이용약관 및 정책을 둘 수 있으며, 
              해당 내용이 본 약관과 상충할 경우에는 별도의 이용약관 및 정책이 우선하여 적용됩니다.
            </li>
          </ol>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            제5조 (서비스의 성격 및 비의료행위 고지)
          </h2>
          <ol style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li style={{marginBottom: '10px'}}>본 서비스는 의학적 진단·처방·치료·예방을 위한 도구가 아닙니다.</li>
            <li style={{marginBottom: '10px'}}>
              본 서비스는 이용자의 활동 습관을 인식하고 피드백을 제공하는 생활습관 보조 서비스로서, 
              의사·물리치료사 등 의료전문인의 판단을 대체하지 않습니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회사가 제공하는 AI 분석, 리포트, 알림, 색상 신호 등의 모든 정보는 생활습관 개선을 위한 참고 자료일 뿐이며, 
              이를 근거로 의학적 결정을 내려서는 안 됩니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회사는 본 서비스를 통해 제공된 정보로 인한 건강상의 손해 또는 질병의 발생·악화 등에 대해 의료법상 책임을 지지 않습니다.
            </li>
            <li style={{marginBottom: '10px'}}>건강 이상이 의심되는 경우, 반드시 의료기관 전문의 상담을 권장합니다.</li>
          </ol>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            제6조 (이용계약의 체결 및 회원가입)
          </h2>
          <ol style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li style={{marginBottom: '10px'}}>
              이용계약은 이용자가 본 약관에 동의하고 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 가입을 신청하고, 
              회사가 이를 승낙함으로써 체결됩니다.
            </li>
            <li style={{marginBottom: '10px'}}>회원은 본인 명의로 가입해야 하며, 타인의 정보를 도용할 수 없습니다.</li>
            <li style={{marginBottom: '10px'}}>미성년자는 본 서비스를 이용할 수 없습니다.</li>
            <li style={{marginBottom: '10px'}}>회사는 다음 각 호에 해당하는 신청에 대해서는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다:
              <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
                <li>만 14세 미만의 미성년자가 가입을 신청한 경우</li>
                <li>타인의 정보를 도용한 경우</li>
                <li>허위 정보를 기재한 경우</li>
                <li>기타 이용자의 귀책사유로 승인이 불가능하거나 기타 규정한 제반 사항을 위반한 경우</li>
              </ul>
            </li>
          </ol>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            제7조 (서비스의 제공 및 변경)
          </h2>
          <ol style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li style={{marginBottom: '10px'}}>회사는 다음과 같은 서비스를 제공합니다:
              <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
                <li>HealthKit 데이터 연동을 통한 건강 정보 수집 및 분석</li>
                <li>목 자세 인식 및 분석</li>
                <li>자세 개선 알림 및 피드백 제공</li>
                <li>활동 분석 및 AI 웰니스 리포트 제공</li>
                <li>포인트 적립 및 활용 기능</li>
                <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 서비스</li>
              </ul>
            </li>
            <li style={{marginBottom: '10px'}}>
              회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스의 전부 또는 일부를 변경할 수 있습니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              서비스의 내용, 이용방법, 이용시간에 대하여 변경이 있는 경우에는 변경사유, 변경될 서비스의 내용 및 제공일자 등을 
              그 변경 전에 앱 내 공지사항 화면 또는 팝업 등을 통해 통지합니다.
            </li>
          </ol>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            제15조 (면책사항)
          </h2>
          <ol style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li style={{marginBottom: '10px'}}>
              회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 
              그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회사는 이용자가 서비스에 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 회사의 고의 또는 중대한 과실이 없는 한 
              책임을 지지 않습니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              이용자가 본인의 개인정보를 부실하게 기재하여 손해가 발생한 경우에 대해서는, 회사는 회사의 고의 또는 중대한 과실이 없는 한 
              책임을 부담하지 않습니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회사는 제3자가 게재한 정보, 자료, 사실의 신뢰도, 정확성 등 내용에 관하여는 회사의 고의 또는 중대한 과실이 없는 한 
              책임을 지지 않습니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회사는 회원 간 또는 회원과 제3자 상호간에 서비스를 매개로 하여 거래 등을 한 경우에는 책임이 면제됩니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              회사는 HealthKit API 정책 변경 등 외부 요인으로 인해 발생한 서비스 제한에 책임을 지지 않습니다.
            </li>
            <li style={{marginBottom: '10px'}}>
              서비스에서 제공되는 데이터 및 AI 분석 결과는 참고용 정보로, 이를 근거로 한 이용자의 건강 관련 판단 또는 행위에 대하여 
              회사는 책임을 지지 않습니다.
            </li>
          </ol>

          <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>
            제16조 (준거법 및 재판관할)
          </h2>
          <ol style={{marginTop: '15px', paddingLeft: '20px'}}>
            <li style={{marginBottom: '10px'}}>본 약관은 대한민국 법령을 준거법으로 합니다.</li>
            <li style={{marginBottom: '10px'}}>회사와 회원 간 발생한 분쟁에 관한 소송은 민사소송법상의 관할 법원에 제기할 수 있습니다.</li>
          </ol>

          <div style={{marginTop: '40px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px'}}>
            <h3 style={{marginBottom: '15px', fontSize: '18px', fontWeight: 'bold'}}>부칙</h3>
            <p>본 약관은 2025. [*]. [*].부터 시행 및 적용됩니다.</p>
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
