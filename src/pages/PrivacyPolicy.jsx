import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageHero from '../components/PageHero';
import SectionLabel from '../components/SectionLabel';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const sections = [
  {
    number: '01',
    title: 'Introduction',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          Reliance Oil Limited ("we", "us", or "our") is committed to protecting the privacy and personal data of all individuals who interact with our services, website, and operations. This Privacy Policy explains how we collect, use, store, and protect your personal data in accordance with the Ghana Data Protection Act, 2012 (Act 843).
        </p>
        <p style={{ color: '#555', lineHeight: 1.75 }}>
          By accessing our services or website, you consent to the practices described in this policy.
        </p>
      </>
    ),
  },
  {
    number: '02',
    title: 'Data Controller',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        Reliance Oil Limited, licensed by the National Petroleum Authority (NPA) since January 2020, is the Data Controller responsible for your personal information. Our registered address is P.O. Box 164, Apam, with operational offices at Bortianor (Radiance), Winneba Road, Weija 162, and Tema, Community 7.
      </p>
    ),
  },
  {
    number: '03',
    title: 'Lawful Basis for Processing',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>We process personal data on the following lawful bases:</p>
        {[
          'Consent — where you have given clear, informed consent',
          'Contractual necessity — to fulfil a service or transaction',
          'Legal obligation — to comply with applicable Ghanaian laws and NPA regulations',
          'Legitimate interests — for business operations, security, and fraud prevention',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
      </>
    ),
  },
  {
    number: '04',
    title: 'Personal Data We Collect',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>We may collect the following categories of personal data:</p>
        <p style={{ color: '#333', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>a) Identity & Contact Data</p>
        {['Full name', 'Phone number', 'Email address', 'Postal address'].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem' }}>{item}</span>
          </div>
        ))}
        <p style={{ color: '#333', fontWeight: 600, margin: '1rem 0 0.5rem', fontSize: '0.9rem' }}>b) Transaction Data</p>
        {['Fuel purchase records', 'Payment method and transaction details', 'Fleet account information'].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem' }}>{item}</span>
          </div>
        ))}
        <p style={{ color: '#333', fontWeight: 600, margin: '1rem 0 0.5rem', fontSize: '0.9rem' }}>c) Technical Data</p>
        {['IP address', 'Browser type and version', 'Pages visited and time spent on our website'].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem' }}>{item}</span>
          </div>
        ))}
        <p style={{ color: '#333', fontWeight: 600, margin: '1rem 0 0.5rem', fontSize: '0.9rem' }}>d) Employment Data (Applicants)</p>
        {['CV and application details', 'Employment history', 'Professional qualifications'].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem' }}>{item}</span>
          </div>
        ))}
      </>
    ),
  },
  {
    number: '05',
    title: 'Purpose of Data Processing',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>Your personal data is used for the following purposes:</p>
        {[
          'Processing fuel purchases, bulk orders, and fleet accounts',
          'Responding to enquiries and providing customer support',
          'Sending service updates, promotions, and newsletters (with consent)',
          'Processing job applications and managing employment relationships',
          'Complying with NPA regulations and other legal obligations',
          'Improving our website, services, and customer experience',
          'Fraud detection, security monitoring, and risk management',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
      </>
    ),
  },
  {
    number: '06',
    title: 'Data Sharing & Disclosure',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          We do not sell your personal data. We may share it with the following parties where necessary:
        </p>
        {[
          'NPA and other regulatory authorities as required by law',
          'Payment processors and financial institutions for transaction processing',
          'IT and technology service providers who support our operations',
          'Legal and professional advisors where required',
          'Law enforcement agencies where legally compelled',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
        <p style={{ color: '#555', lineHeight: 1.75, marginTop: '1rem' }}>
          All third parties are required to maintain the confidentiality and security of your data.
        </p>
      </>
    ),
  },
  {
    number: '07',
    title: 'International Data Transfers',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        Where personal data is transferred outside Ghana, we ensure adequate safeguards are in place in compliance with the Data Protection Act, 2012 (Act 843). We only transfer data to countries or organisations that provide an equivalent level of data protection.
      </p>
    ),
  },
  {
    number: '08',
    title: 'Data Retention Policy',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          We retain personal data only for as long as necessary to fulfil the purposes for which it was collected, including satisfying legal, regulatory, and reporting obligations.
        </p>
        {[
          'Customer transaction records: 7 years (tax and audit requirements)',
          'Job application data: 6 months (unless the applicant is hired)',
          'Website analytics data: 12 months',
          'Marketing consent records: Until consent is withdrawn',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
      </>
    ),
  },
  {
    number: '09',
    title: 'Data Subject Rights',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          Under the Ghana Data Protection Act, 2012, you have the following rights regarding your personal data:
        </p>
        {[
          'Right of access — to obtain a copy of your personal data',
          'Right to rectification — to correct inaccurate or incomplete data',
          'Right to erasure — to request deletion of your data where no legal basis exists',
          'Right to object — to processing based on legitimate interests or for direct marketing',
          'Right to restrict processing — in certain circumstances',
          'Right to data portability — to receive your data in a structured format',
          'Right to withdraw consent — at any time without affecting prior processing',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
        <p style={{ color: '#555', lineHeight: 1.75, marginTop: '1rem' }}>
          To exercise any of these rights, contact us at <a href="mailto:info@relianceoilgh.com" style={{ color: '#CC0000' }}>info@relianceoilgh.com</a>.
        </p>
      </>
    ),
  },
  {
    number: '10',
    title: 'Data Security Measures',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          We implement appropriate technical and organisational security measures to protect your personal data against unauthorised access, loss, destruction, or alteration, including:
        </p>
        {[
          'Encrypted data storage and transmission (SSL/TLS)',
          'Access control and role-based permissions for staff',
          'Regular security audits and vulnerability assessments',
          'Staff training on data protection and confidentiality obligations',
          'Physical security controls at offices and operational sites',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
      </>
    ),
  },
  {
    number: '11',
    title: 'Breach Notification',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        In the event of a personal data breach that is likely to result in risk to your rights and freedoms, we will notify the Data Protection Commission (DPC) of Ghana within 72 hours of becoming aware of the breach, and affected individuals without undue delay, in accordance with Act 843.
      </p>
    ),
  },
  {
    number: '12',
    title: 'Cookies & Website Tracking',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          Our website uses cookies and similar tracking technologies to improve your browsing experience and analyse site performance. Types of cookies we use:
        </p>
        {[
          'Essential cookies — required for the website to function properly',
          'Analytics cookies — help us understand how visitors use the site',
          'Marketing cookies — used for relevant advertising (only with your consent)',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
        <p style={{ color: '#555', lineHeight: 1.75, marginTop: '1rem' }}>
          You may manage your cookie preferences through your browser settings at any time.
        </p>
      </>
    ),
  },
  {
    number: '13',
    title: 'Complaints',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        If you believe your data protection rights have been violated, you have the right to lodge a complaint with the Data Protection Commission (DPC) of Ghana. You may also contact us directly at <a href="mailto:info@relianceoilgh.com" style={{ color: '#CC0000' }}>info@relianceoilgh.com</a> and we will investigate and respond within 30 days.
      </p>
    ),
  },
  {
    number: '14',
    title: 'Updates to Policy',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        We may update this Privacy Policy from time to time to reflect changes in our operations, services, or legal obligations. The updated version will be published on this page with a revised effective date. We encourage you to review this policy periodically.
      </p>
    ),
  },
  {
    number: '15',
    title: 'Contact Information',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1.25rem' }}>
          For any questions, requests, or concerns relating to this Privacy Policy or the handling of your personal data, please contact us:
        </p>
        <div style={{ backgroundColor: '#F8F8F8', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {[
            'P.O. Box 164, Apam',
            'Tema, Community 7, Greater Accra',
            '+233 30 222 0000',
            'info@relianceoilgh.com',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0 }} size={13} />
              <span style={{ color: '#555', fontSize: '0.9rem' }}>{item}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  return (
    <div>
      <PageHero
        title="Privacy Policy"
        subtitle="Ghana Data Protection Act, 2012 (Act 843) Compliant"
        breadcrumb={[{ label: 'Privacy Policy', path: '/privacy' }]}
      />

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#FFF0F0', borderLeft: '4px solid #CC0000', padding: '1rem 1.25rem', borderRadius: '0 0.75rem 0.75rem 0', marginBottom: '2.5rem', fontSize: '0.875rem', color: '#666' }}>
              Effective Date: January 2020 &nbsp;|&nbsp; Data Controller: Reliance Oil Limited
            </div>

            {sections.map((section, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 40}
                style={i === 0 ? {} : { borderTop: '1px solid #f3f4f6', marginTop: '2.5rem', paddingTop: '2.5rem' }}
              >
                <p style={{ color: '#CC0000', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  {section.number}
                </p>
                <h3 style={{ fontWeight: 800, color: '#0D0D0D', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  {section.title}
                </h3>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
