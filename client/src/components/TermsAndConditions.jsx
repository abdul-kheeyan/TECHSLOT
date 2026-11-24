import './terms-and-conditions.css';

const termsSections = [
  {
    title: '1. Scope and written agreements',
    paragraphs: [
      'These terms describe the general basis on which Techslot_dev provides website design, development, software, and related services. The specific deliverables, schedule, fees, support arrangements, and any project-specific terms will be set out in a proposal, statement of work, or other written agreement (“Project Agreement”).',
      'If these terms conflict with a signed or otherwise accepted Project Agreement, the Project Agreement will control for that project. A client becomes bound by these terms when they accept a proposal, instruct us to begin work, or use a delivered service.',
    ],
  },
  {
    title: '2. Project scope and changes',
    paragraphs: [
      'We will provide the services and deliverables described in the applicable Project Agreement. Features, revisions, integrations, content, or work not included in that scope may require additional fees and time. We will communicate material changes for approval before proceeding.',
      'Project dates are estimates unless the Project Agreement expressly identifies a date as a firm commitment. Delays in client feedback, approvals, content, access, or decisions may affect delivery dates.',
    ],
  },
  {
    title: '3. Client responsibilities',
    paragraphs: [
      'The client will provide accurate information, required content, timely decisions, and the access and approvals reasonably needed to perform the work. The client is responsible for ensuring that it has the rights and permissions needed for materials, data, trademarks, images, text, and other content it supplies.',
      'The client is responsible for reviewing deliverables, confirming that they meet its business and legal requirements, and checking that published content is accurate and appropriate before launch.',
    ],
  },
  {
    title: '4. Fees and payment',
    paragraphs: [
      'Fees, payment milestones, taxes, and any applicable expenses will be stated in the Project Agreement or invoice. The client agrees to pay those amounts by the stated due dates. We may pause work or withhold launch, access, or transfer of deliverables when an undisputed invoice is overdue, after giving reasonable notice.',
      'Any cancellation charges, deposits, or refunds will be governed by the Project Agreement and applicable law.',
    ],
  },
  {
    title: '5. Delivery and acceptance',
    paragraphs: [
      'The client will review and test deliverables in a timely manner and report material issues against the agreed scope. We will address confirmed scope-related defects in accordance with the Project Agreement. New features, changed requirements, and issues caused by third-party services or later client changes are not defects in the original scope.',
    ],
  },
  {
    title: '6. Ownership and third-party materials',
    paragraphs: [
      'Ownership and licensing of project-specific deliverables will be as stated in the Project Agreement. Unless otherwise agreed, transfer of any rights in custom deliverables is subject to payment of all related fees.',
      'We retain rights to our pre-existing tools, reusable code, processes, know-how, and materials. Third-party software, fonts, stock assets, APIs, and other services remain subject to their own licenses and terms; the client is responsible for ongoing third-party subscription or usage fees unless the Project Agreement says otherwise.',
    ],
  },
  {
    title: '7. Hosting, security, and handover',
    paragraphs: [
      'Unless hosting or ongoing management is expressly included in a Project Agreement, the client is responsible after handover for its hosting account, domain and DNS settings, server configuration, access credentials, backups, software and dependency updates, security monitoring, and recovery arrangements.',
      'We use reasonable care in performing the agreed development work, but no website or online service can be guaranteed to be completely secure or continuously available. Cyberattacks, newly discovered vulnerabilities, compromised credentials, hosting or network failures, and changes made by the client or third parties can affect a website. We are not responsible for incidents to the extent they arise from matters outside our agreed control or from the client’s or a third party’s systems, actions, or omissions, subject to the limits imposed by applicable law.',
      'The client should promptly change credentials shared for development and maintain secure, tested backups. We will provide a handover of project materials and access only to the extent specified in the Project Agreement.',
    ],
  },
  {
    title: '8. Maintenance and support',
    paragraphs: [
      'Ongoing maintenance, monitoring, backups, security updates, incident response, and technical support are not included unless expressly stated in a separate written agreement. Without an active maintenance agreement, we have no obligation to monitor, update, repair, or restore a delivered website after handover.',
      'If we agree to provide maintenance, its scope, response times, fees, exclusions, and security responsibilities will be set out separately.',
    ],
  },
  {
    title: '9. Third-party services',
    paragraphs: [
      'A project may depend on hosting companies, domain registrars, payment processors, plugins, APIs, analytics providers, or other third parties. Those services are governed by their own terms and availability. We do not control and are not responsible for third-party outages, changes, discontinuation, security incidents, or fees, except to the extent liability cannot lawfully be excluded.',
    ],
  },
  {
    title: '10. Privacy and confidential information',
    paragraphs: [
      'Each party will use reasonable care to protect confidential information received from the other and use it only as needed for the project, unless disclosure is required by law. The client should not send sensitive personal, payment, or authentication data unless the project requires it and appropriate arrangements have been agreed in writing.',
      'Where our work involves personal data, each party remains responsible for its obligations under applicable data-protection laws. Any required data-processing terms should be agreed separately.',
    ],
  },
  {
    title: '11. No business or performance guarantee',
    paragraphs: [
      'Unless a Project Agreement expressly guarantees a specific result, we do not guarantee uninterrupted or error-free operation, search-engine rankings, traffic, sales, revenue, business outcomes, or compatibility with every device, browser, or future third-party change.',
    ],
  },
  {
    title: '12. Limitation of liability',
    paragraphs: [
      'To the maximum extent permitted by applicable law, neither party will be liable to the other for indirect or consequential loss, loss of profits, revenue, anticipated savings, business opportunity, goodwill, data, or interruption arising from a project.',
      'To the maximum extent permitted by law, our total aggregate liability arising out of or relating to a project will not exceed the fees paid or payable to us for that project under the applicable Project Agreement. These limits do not apply to liability that cannot legally be limited or excluded, and do not limit any rights that applicable law makes non-waivable.',
    ],
  },
  {
    title: '13. Client indemnity',
    paragraphs: [
      'To the extent permitted by law, the client will be responsible for third-party claims and reasonable losses arising from content or materials supplied by the client, the client’s unlawful use of a deliverable, or the client’s breach of these terms, except to the extent caused by our own breach, negligence, or wrongful act. We will give reasonable notice of a claim and cooperate with the client’s response.',
    ],
  },
  {
    title: '14. Suspension and termination',
    paragraphs: [
      'Either party may terminate a project as provided in the Project Agreement or applicable law. On termination, the client will pay for work completed and approved expenses incurred up to the effective termination date, subject to the Project Agreement and applicable law. Each party will return or securely delete the other party’s confidential information where reasonably practicable, except where retention is legally required.',
    ],
  },
  {
    title: '15. Events outside reasonable control',
    paragraphs: [
      'Neither party will be liable for delay or failure caused by circumstances beyond its reasonable control, such as natural events, widespread network or hosting outages, government action, or failures of third-party providers. The affected party will take reasonable steps to reduce the impact and resume performance.',
    ],
  },
  {
    title: '16. Governing law and changes',
    paragraphs: [
      'The governing law and dispute venue stated in the applicable Project Agreement will apply. If the Project Agreement does not specify them, the laws and courts where Techslot_dev has its principal place of business will apply, subject to any mandatory laws or consumer protections that cannot be waived.',
      'We may update these terms by posting a revised version on this website. The version applicable to an existing project is the version incorporated into that project’s agreement, unless the parties agree otherwise in writing.',
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <article className="terms-content">
      <p className="terms-intro">
        These terms explain the general responsibilities that apply when
        Techslot_dev provides website and software services. Your accepted
        proposal or written project agreement sets the specific terms for your
        project.
      </p>
      {termsSections.map((section) => (
        <section className="terms-section" key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      <p className="terms-contact">
        Questions about these terms? Contact us at{' '}
        <a href="mailto:kheeyanport@gmail.com">kheeyanport@gmail.com</a>.
      </p>
    </article>
  );
}
