import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const questions = [
  {
    question: 'What kind of projects can Techslot help with?',
    answer: 'Business websites, React interfaces, full-stack web applications, backend APIs, and improvements to existing products. The right scope depends on the problem you need to solve.',
  },
  {
    question: 'What should I include in my first inquiry?',
    answer: 'A few lines about your business, who the product is for, what you want it to do, and any timing or budget range you already have in mind. You do not need a finished specification.',
  },
  {
    question: 'Can you work on an existing website or application?',
    answer: 'Yes. The work can start with an existing product, whether the need is a redesign, a new feature, a frontend implementation, or a broader rebuild.',
  },
  {
    question: 'How are project scope, timeline, and budget decided?',
    answer: 'They depend on the requirements, features, and integrations involved. Sharing your priorities and constraints in the inquiry helps shape a realistic scope for discussion.',
  },
  {
    question: 'Is support available after launch?',
    answer: 'Post-launch maintenance and technical support can be discussed as part of the project, based on what the product needs after release.',
  },
];

export default function FaqSection() {
  return (
    <section className="section faq-section">
      <div className="container">
        <div className="faq-layout">
          <div className="faq-heading">
            <span className="section-kicker">A few useful answers / 06</span>
            <h2 className="section-title">Before we get started.</h2>
            <p className="section-subtitle">
              Not seeing your question here? Share a little about the project and we can take it from there.
            </p>
            <Link to="/contact" className="faq-contact-link">
              Ask about your project <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="faq-list">
            {questions.map(({ question, answer }, index) => (
              <details className="faq-item" key={question} open={index === 0}>
                <summary>
                  <span>{question}</span>
                  <span className="faq-toggle" aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
