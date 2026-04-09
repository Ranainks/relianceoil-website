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
          These Terms & Conditions govern your use of all services, stations, and digital platforms operated by Reliance Oil Limited ("Reliance Oil", "we", "us", or "our"). By accessing our services, you agree to be bound by these terms in full.
        </p>
        <p style={{ color: '#555', lineHeight: 1.75 }}>
          Reliance Oil Limited is duly licensed by the National Petroleum Authority (NPA) of Ghana since January 2020 and operates in full compliance with all applicable Ghanaian laws and petroleum industry regulations.
        </p>
      </>
    ),
  },
  {
    number: '02',
    title: 'Regulatory Compliance',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          All operations of Reliance Oil Limited are conducted in accordance with:
        </p>
        {[
          'The National Petroleum Authority Act, 2005 (Act 691)',
          'The Ghana National Fire Service (GNFS) safety standards',
          'The Environmental Protection Agency (EPA) regulations',
          'The Ghana Revenue Authority (GRA) tax obligations',
          'The Data Protection Act, 2012 (Act 843)',
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
    number: '03',
    title: 'Payment Terms',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          Reliance Oil Limited accepts the following payment methods at our stations:
        </p>
        {[
          'Mobile Money (MTN MoMo, Vodafone Cash, AirtelTigo Money)',
          'Cash (Ghana Cedis)',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
        <p style={{ color: '#555', lineHeight: 1.75, marginTop: '1rem' }}>
          All prices are quoted and payable in Ghana Cedis (GHS) at the prevailing pump price as published by the NPA. Fleet account customers are subject to separate contractual billing arrangements. Payment is due immediately upon completion of service unless a corporate credit arrangement is in place.
        </p>
      </>
    ),
  },
  {
    number: '04',
    title: 'Failed or Disputed Transactions',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          In the event of a failed or disputed payment transaction:
        </p>
        {[
          'Mobile Money failures must be reported to the relevant mobile network operator',
          'Disputed fuel transactions should be reported to station management immediately',
          'Reliance Oil is not liable for network failures outside our direct control',
          'Refund requests are reviewed on a case-by-case basis within 5 business days',
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
    number: '05',
    title: 'Fraud Prevention',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          Reliance Oil Limited maintains strict anti-fraud policies. The following activities are strictly prohibited and may result in prosecution:
        </p>
        {[
          'Attempting to manipulate fuel dispensers or payment systems',
          'Providing fraudulent credentials for fleet or corporate accounts',
          'Tampering with receipts or invoices',
          'Misrepresentation for the purpose of obtaining unauthorised fuel credit',
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
    title: 'User Obligations',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          All customers and visitors to Reliance Oil stations and digital platforms are required to:
        </p>
        {[
          'Provide accurate and truthful information when requested',
          'Comply with all instructions given by station staff',
          'Treat staff and other customers with respect and dignity',
          'Not engage in disruptive, abusive, or illegal behaviour on our premises',
          'Use our services and website only for lawful purposes',
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
    number: '07',
    title: 'Safety Enforcement',
    content: (
      <>
        <p style={{ color: '#555', lineHeight: 1.75, marginBottom: '1rem' }}>
          In the interest of public safety, all persons on Reliance Oil premises must observe the following mandatory safety rules:
        </p>
        {[
          'No smoking anywhere on station premises',
          'Engines must be switched off while fuelling',
          'Mobile phones must not be used near fuelling points',
          'Follow all instructions from station staff and safety signage',
          'Report any spillage or safety hazard to station staff immediately',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <FaCheckCircle style={{ color: '#CC0000', flexShrink: 0, marginTop: '0.2rem' }} size={13} />
            <span style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>{item}</span>
          </div>
        ))}
        <p style={{ color: '#555', lineHeight: 1.75, marginTop: '1rem' }}>
          Failure to comply with safety rules may result in refusal of service and removal from the premises.
        </p>
      </>
    ),
  },
  {
    number: '08',
    title: 'Limitation of Liability',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        To the maximum extent permitted by Ghanaian law, Reliance Oil Limited shall not be liable for any indirect, incidental, special, or consequential loss or damage arising from the use of our services, including but not limited to vehicle damage from incorrect fuelling, loss of data, or business interruption. Our total aggregate liability shall not exceed the value of the transaction giving rise to the claim.
      </p>
    ),
  },
  {
    number: '09',
    title: 'Data Protection',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        All personal data collected through our services and digital platforms is handled in accordance with our <Link to="/privacy" style={{ color: '#CC0000' }}>Privacy Policy</Link> and the Ghana Data Protection Act, 2012 (Act 843). By using our services, you consent to our data practices as described therein.
      </p>
    ),
  },
  {
    number: '10',
    title: 'Intellectual Property',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        All content on the Reliance Oil Limited website, including but not limited to the logo, brand name, images, text, graphics, and digital assets, are the exclusive intellectual property of Reliance Oil Limited. No part of this content may be reproduced, distributed, or used without prior written permission from Reliance Oil Limited.
      </p>
    ),
  },
  {
    number: '11',
    title: 'Termination of Service',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        Reliance Oil Limited reserves the right to refuse service, suspend fleet accounts, or restrict access to our digital platforms at any time, without notice, in cases of breach of these Terms & Conditions, fraudulent activity, safety violations, or abusive behaviour towards staff or other customers.
      </p>
    ),
  },
  {
    number: '12',
    title: 'Governing Law',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of Ghana. Any matter arising under these terms shall be subject to the exclusive jurisdiction of the courts of Ghana.
      </p>
    ),
  },
  {
    number: '13',
    title: 'Dispute Resolution',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        In the event of a dispute arising from these Terms & Conditions or the use of our services, the parties agree to first attempt resolution through good-faith negotiation. If the matter cannot be resolved within 30 days, it shall be referred to mediation under the rules of the Ghana Arbitration Centre before any legal proceedings are initiated.
      </p>
    ),
  },
  {
    number: '14',
    title: 'Updates',
    content: (
      <p style={{ color: '#555', lineHeight: 1.75 }}>
        Reliance Oil Limited reserves the right to amend these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of our services following any update constitutes acceptance of the revised terms. We recommend reviewing these terms periodically.
      </p>
    ),
  },
];

export default function Terms() {
  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, once: true });
  }, []);

  return (
    <div>
      <PageHero
        title="Terms & Conditions"
        subtitle="Terms governing all services provided by Reliance Oil Limited"
        breadcrumb={[{ label: 'Terms & Conditions', path: '/terms' }]}
      />

      <section className="rs" style={{ backgroundColor: '#ffffff' }}>
        <div className="rc">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#FFF0F0', borderLeft: '4px solid #CC0000', padding: '1rem 1.25rem', borderRadius: '0 0.75rem 0.75rem 0', marginBottom: '2.5rem', fontSize: '0.875rem', color: '#666' }}>
              Effective Date: January 2020 &nbsp;|&nbsp; Reliance Oil Limited — NPA Licensed Petroleum Retailer
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
