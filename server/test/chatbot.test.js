import test from 'node:test';
import assert from 'node:assert/strict';
import { intents } from '../chatbot/intents.js';
import { processChatMessage, scoreIntent } from '../chatbot/engine.js';

const contactOptions = {
  projectType: ['Website', 'Web Application', 'MERN Application', 'Frontend', 'Backend/API', 'Other'],
  budget: ['Under ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', '₹50,000+', 'Custom'],
  timeline: ['1-2 Weeks', '2-4 Weeks', '1-2 Months', 'Flexible'],
};
const savedLeads = [];
const providers = {
  contactOptions,
  getProjects: async () => [{ title: 'Demo Project', slug: 'demo-project', shortDescription: 'A published project', liveUrl: 'https://example.com' }],
  getServices: async () => [{ title: 'Web Development', description: 'Published web development service' }],
  saveLead: async (lead) => {
    savedLeads.push(lead);
    return lead;
  },
};

const ask = (message, context = {}) => processChatMessage(message, context, providers);
const combinedAnswer = (result) => result.answers.map(({ answer }) => answer).join('\n');

test('matches English and Hinglish pricing questions', async () => {
  const english = await ask('how much for react website');
  const hinglish = await ask('website kitne ka banega?');
  assert.match(combinedAnswer(english), /does not publish fixed prices/i);
  assert.match(combinedAnswer(hinglish), /fixed prices publish nahi hain/i);
  assert.equal(hinglish.context.language, 'hi');
});

test('matches portfolio, greeting, and thanks', async () => {
  const portfolio = await ask('Can I see your portfolio?');
  assert.match(combinedAnswer(portfolio), /projects published/i);
  assert.match(combinedAnswer(portfolio), /Demo Project/);
  assert.ok(portfolio.answers[0].links.some(({ url }) => url === '/projects/demo-project'));
  assert.ok(portfolio.answers[0].links.some(({ url }) => url === 'https://example.com'));
  assert.match(combinedAnswer(await ask('hi')), /Hi!/);
  assert.match(combinedAnswer(await ask('thanks')), /welcome/i);
});

test('lists live services and offers a lead after two unanswered turns', async () => {
  assert.match(combinedAnswer(await ask('What services do you offer?')), /Published web development service/);
  const firstMiss = await ask('unknown first topic');
  const secondMiss = await ask('unknown second topic', firstMiss.context);
  assert.equal(firstMiss.unanswered, true);
  assert.equal(secondMiss.unanswered, true);
  assert.match(combinedAnswer(secondMiss), /send your question as an inquiry/i);
  assert.equal(secondMiss.context.pendingAction.type, 'offerLead');
});

test('reports SEO and mobile apps as not listed services', async () => {
  assert.match(combinedAnswer(await ask('Do you do SEO?')), /not listed/i);
  assert.match(combinedAnswer(await ask('do you build mobile apps')), /not listed/i);
});

test('tolerates a small typo', async () => {
  assert.match(combinedAnswer(await ask('pricng')), /does not publish fixed prices/i);
});

test('varies repeated answers and continues the previous topic on more', async () => {
  let context = {};
  const answers = [];
  for (let index = 0; index < 3; index += 1) {
    const result = await ask('How much for a website?', context);
    context = result.context;
    answers.push(result.answers[0].answer);
  }
  assert.notEqual(answers[0], answers[1]);
  assert.notEqual(answers[1], answers[2]);

  const first = await ask('How much for a website?');
  const more = await ask('tell me more', first.context);
  assert.equal(more.context.lastIntent, 'pricing');
  assert.notEqual(first.answers[0].answer, more.answers[0].answer);
});

test('answers two explicit intents in separate bubbles', async () => {
  const result = await ask('price kitna aur kitne din lagenge');
  assert.equal(result.answers.length, 2);
  assert.match(result.answers[0].answer, /budget options/i);
  assert.match(result.answers[1].answer, /timeline preferences/i);
});

test('every English and Hinglish suggestion maps to its own intent', async () => {
  const suggestions = [];
  for (const intent of intents) {
    const message = intent.phrases[0] || intent.exact[0] || intent.strong[0];
    suggestions.push(...(await ask(message)).suggestions);
    suggestions.push(...(await ask(message, { language: 'hi' })).suggestions);
  }
  for (const suggestion of suggestions) {
    const intent = intents.find(({ id }) => id === suggestion.intent);
    assert.ok(intent, `missing intent for ${suggestion.text}`);
    assert.ok(
      scoreIntent(suggestion.text, intent) >= 3,
      `suggestion does not resolve to ${suggestion.intent}: ${suggestion.text}`
    );
  }
});

test('lead flow validates and saves all requested data', async () => {
  savedLeads.length = 0;
  let context = (await ask('How can I start a project?')).context;
  context = (await ask('yes', context)).context;
  context = (await ask('Riya Sharma', context)).context;
  context = (await ask('riya@example.com', context)).context;
  context = (await ask('1', context)).context;
  context = (await ask('3', context)).context;
  context = (await ask('2', context)).context;
  const final = await ask('I need a responsive business website with a contact form.', context);
  assert.equal(final.context.pendingAction.step, 'confirm');
  const saved = await ask('yes', final.context);
  assert.equal(savedLeads.length, 1);
  assert.deepEqual(savedLeads[0], {
    name: 'Riya Sharma',
    email: 'riya@example.com',
    projectType: 'Website',
    budget: '₹25,000 - ₹50,000',
    timeline: '2-4 Weeks',
    message: 'I need a responsive business website with a contact form.',
  });
});

test('rejects invalid email and invalid option values', async () => {
  savedLeads.length = 0;
  const emailContext = {
    pendingAction: {
      type: 'lead',
      step: 'email',
      values: { name: 'Riya' },
    },
  };
  const emailResult = await ask('not-an-email', emailContext);
  assert.equal(emailResult.context.pendingAction.step, 'email');
  assert.match(emailResult.answers[0].answer, /email does not look valid/i);

  const optionContext = {
    pendingAction: {
      type: 'lead',
      step: 'budget',
      values: { name: 'Riya', email: 'riya@example.com', projectType: 'Website' },
    },
  };
  const optionResult = await ask('A million dollars', optionContext);
  assert.equal(optionResult.context.pendingAction.step, 'budget');
  assert.equal(savedLeads.length, 0);
});

test('answers a question during lead capture and then continues the same step', async () => {
  const result = await ask('What services do you offer?', {
    pendingAction: {
      type: 'lead',
      step: 'name',
      values: {},
    },
  });
  assert.match(combinedAnswer(result), /Web Development/);
  assert.equal(result.context.pendingAction.step, 'name');
});

test('cancel clears lead capture and invalid forged confirmation saves nothing', async () => {
  const cancelled = await ask('cancel', {
    pendingAction: { type: 'lead', step: 'name', values: { name: 'Riya' } },
  });
  assert.equal(cancelled.context.pendingAction, null);

  savedLeads.length = 0;
  const forged = await ask('yes', {
    pendingAction: {
      type: 'lead',
      step: 'confirm',
      values: {
        name: 'Riya',
        email: 'not-valid',
        projectType: 'Forged',
        budget: 'Forged',
        timeline: 'Flexible',
        message: 'A long enough message that is not valid because of fields',
      },
    },
  });
  assert.equal(savedLeads.length, 0);
  assert.equal(forged.context.pendingAction.step, 'name');
});

test('empty, oversized, emoji, and HTML input never throw', async () => {
  for (const message of ['', 'x'.repeat(100000), '😀🔥', '<script>alert(1)</script>']) {
    await assert.doesNotReject(() => ask(message));
  }
});
