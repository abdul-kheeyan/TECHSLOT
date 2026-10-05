import { getIntent, intents } from './intents.js';

const intentIds = new Set(intents.map(({ id }) => id));
const smallTalkIds = new Set(['greeting', 'thanks', 'bye', 'bot', 'help']);
const validLanguages = new Set(['en', 'hi']);
const contactFields = ['name', 'email', 'projectType', 'budget', 'timeline', 'message'];
const optionFields = ['projectType', 'budget', 'timeline'];
const leadSteps = new Set([...contactFields, 'confirm']);
const fallbackSuggestions = ['services', 'portfolio', 'pricing', 'timeline', 'start'];

export const normalize = (value) => String(value ?? '')
  .toLowerCase()
  .replace(/<[^>]*>/g, ' ')
  .replace(/[^a-z0-9\u0900-\u097f]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const canonicalWord = (word) => {
  if (word.length <= 3) return word;
  if (word.endsWith('ies') && word.length > 4) return `${word.slice(0, -3)}y`;
  if (word.endsWith('es') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('s') && word.length > 4) return word.slice(0, -1);
  if (word.endsWith('ing') && word.length > 6) return word.slice(0, -3);
  return word;
};

const editDistance = (left, right) => {
  if (Math.abs(left.length - right.length) > 1) return 2;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1)
      );
    }
    previous = current;
  }
  return previous[right.length];
};

const wordsMatch = (queryWord, intentWord) => {
  if (queryWord === intentWord) return true;
  if (queryWord.length <= 3 || intentWord.length <= 3) return false;
  const queryRoot = canonicalWord(queryWord);
  const intentRoot = canonicalWord(intentWord);
  if (queryRoot === intentRoot) return true;
  return Math.min(editDistance(queryRoot, intentRoot), editDistance(queryWord, intentWord)) === 1;
};

const containsPhrase = (query, phrase) => {
  const normalizedPhrase = normalize(phrase);
  if (!normalizedPhrase) return false;
  if (query.includes(normalizedPhrase)) return true;
  const queryWords = query.split(' ');
  const phraseWords = normalizedPhrase.split(' ');
  return queryWords.length === phraseWords.length
    && queryWords.every((word, index) => wordsMatch(word, phraseWords[index]));
};

export const scoreIntent = (message, intent) => {
  const query = normalize(message);
  if (!query) return 0;
  const exact = (intent.exact || []).some((phrase) => query === normalize(phrase));
  const phraseScore = (intent.phrases || []).reduce(
    (highest, phrase) => containsPhrase(query, phrase)
      ? Math.max(highest, 8 + normalize(phrase).split(' ').length)
      : highest,
    0
  );
  const queryWords = query.split(' ');
  const keywordScore = (intent.strong || []).reduce((score, keyword) => (
    queryWords.some((word) => wordsMatch(word, normalize(keyword)))
      || containsPhrase(query, keyword)
      ? score + 3
      : score
  ), 0) + (intent.weak || []).reduce((score, keyword) => (
    queryWords.some((word) => wordsMatch(word, normalize(keyword)))
      ? score + 1
      : score
  ), 0);
  return Math.max(exact ? 14 : 0, phraseScore, keywordScore);
};

export const detectLanguage = (message, fallback = 'en') => {
  const words = normalize(message).split(' ');
  const hindiWords = new Set([
    'aur', 'batao', 'chahiye', 'din', 'hai', 'ho', 'hoga', 'ka', 'kaise',
    'kitna', 'kitne', 'lagega', 'mein', 'me', 'paisa', 'karna', 'karein',
    'kya', 'nahi', 'naam', 'shukriya', 'theek', 'aap', 'mera', 'meri',
  ]);
  return words.some((word) => hindiWords.has(word)) ? 'hi' : fallback;
};

const validOptionSet = (options, field) => new Set(
  Array.isArray(options?.[field]) ? options[field].filter((value) => typeof value === 'string') : []
);

const cleanField = (value, maxLength) => typeof value === 'string'
  ? value.replace(/<[^>]*>/g, '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength)
  : '';

export const sanitizeContext = (input, options = {}) => {
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const askedCounts = {};
  if (source.askedCounts && typeof source.askedCounts === 'object' && !Array.isArray(source.askedCounts)) {
    for (const id of intentIds) {
      const count = Number(source.askedCounts[id]);
      if (Number.isFinite(count) && count > 0) askedCounts[id] = Math.min(Math.floor(count), 20);
    }
  }

  const context = {
    lastIntent: intentIds.has(source.lastIntent) ? source.lastIntent : null,
    askedCounts,
    language: validLanguages.has(source.language) ? source.language : 'en',
    pendingAction: null,
    misses: Number.isInteger(source.misses) ? Math.max(0, Math.min(source.misses, 2)) : 0,
  };

  const pending = source.pendingAction;
  if (!pending || typeof pending !== 'object' || Array.isArray(pending)) return context;
  if (pending.type === 'offerLead') {
    context.pendingAction = { type: 'offerLead' };
    return context;
  }
  if (pending.type !== 'lead' || !leadSteps.has(pending.step)) return context;

  const values = {};
  for (const field of contactFields) {
    values[field] = cleanField(pending.values?.[field], field === 'message' ? 2000 : 254);
  }
  for (const field of optionFields) {
    if (!validOptionSet(options, field).has(values[field])) values[field] = '';
  }
  if (!/^\S+@\S+\.\S+$/.test(values.email) || values.email.length > 254) values.email = '';
  if (values.name.length < 2) values.name = '';
  if (values.message.length < 10) values.message = '';
  context.pendingAction = { type: 'lead', step: pending.step, values };
  return context;
};

const localized = (value, language) => typeof value === 'string' ? value : value?.[language] || value?.en || '';
const isAffirmative = (message) => /^(yes|yeah|yep|sure|ok|okay|haan|han|ji|bilkul|theek hai|kar do|send it)$/i.test(normalize(message));
const isNegative = (message) => /^(no|nope|nah|nahi|not now|cancel|rehne do)$/i.test(normalize(message));
const isCancel = (message) => /(^|\s)(cancel|stop|abort)(\s|$)/i.test(normalize(message))
  || /^(nahi|cancel karo|rehne do)$/i.test(normalize(message));
const isLikelyQuestion = (message) => /[?؟]/.test(message)
  || /^(what|which|how|can|do|does|is|are|where|when|why|who|tell me|more|aur|price|pricing|cost|timeline|kitna|kitne)\b/i.test(normalize(message));

const dynamicAnswer = async (intent, language, providers) => {
  const links = (intent.links || []).map(({ label, url }) => ({ label: localized(label, language), url }));
  if (intent.dynamic === 'budgets' || intent.dynamic === 'timelines') {
    const field = intent.dynamic === 'budgets' ? 'budget' : 'timeline';
    const options = providers.contactOptions?.[field] || [];
    return {
      answer: `${localized(intent.answer, language)}\n${options.map((value) => `• ${value}`).join('\n')}`,
      links,
    };
  }
  if (intent.dynamic === 'services') {
    const services = await providers.getServices();
    const answer = services.length
      ? services.map((service) => `• ${service.title}: ${service.shortDescription || service.description}`).join('\n')
      : localized(bilingualFallback('No services are currently listed on the website.', 'Website par filhaal koi service listed nahi hai.'), language);
    return { answer: `${localized(intent.answer, language)}\n${answer}`, links };
  }
  if (intent.dynamic === 'portfolio') {
    const projects = await providers.getProjects();
    const answer = projects.length
      ? projects.map((project) => `• ${project.title}: ${project.shortDescription}`).join('\n')
      : localized(bilingualFallback('No projects are currently listed on the website.', 'Website par filhaal koi project listed nahi hai.'), language);
    const projectLinks = projects.flatMap((project) => [
      ...(project.slug ? [{ label: project.title, url: `/projects/${encodeURIComponent(project.slug)}` }] : []),
      ...(project.liveUrl ? [{ label: `${project.title} — live project`, url: project.liveUrl }] : []),
    ]);
    return { answer: `${localized(intent.answer, language)}\n${answer}`, links: [...links, ...projectLinks] };
  }
  return { answer: localized(intent.answer, language), links };
};

const bilingualFallback = (en, hi) => ({ en, hi });

const promptForStep = (step, language, options) => {
  const prompts = {
    name: bilingualFallback('What name should I put on the inquiry?', 'Inquiry mein kaunsa naam likhoon?'),
    email: bilingualFallback('What email address should I use?', 'Kaunsa email address use karoon?'),
    projectType: bilingualFallback(`Choose a project type:\n${options.projectType.map((item, index) => `${index + 1}. ${item}`).join('\n')}`, `Project type chunein:\n${options.projectType.map((item, index) => `${index + 1}. ${item}`).join('\n')}`),
    budget: bilingualFallback(`Choose a budget:\n${options.budget.map((item, index) => `${index + 1}. ${item}`).join('\n')}`, `Budget chunein:\n${options.budget.map((item, index) => `${index + 1}. ${item}`).join('\n')}`),
    timeline: bilingualFallback(`Choose a timeline:\n${options.timeline.map((item, index) => `${index + 1}. ${item}`).join('\n')}`, `Timeline chunein:\n${options.timeline.map((item, index) => `${index + 1}. ${item}`).join('\n')}`),
    message: bilingualFallback('Please describe your project in at least 10 characters.', 'Apne project ke baare mein kam se kam 10 characters mein batayein.'),
  };
  return localized(prompts[step], language);
};

const suggestionsFor = (intentId, context, language) => {
  const current = getIntent(intentId);
  const candidates = [...(current?.related || []), ...fallbackSuggestions];
  const result = [];
  for (const id of candidates) {
    if (result.length === 3) break;
    if (id === intentId || context.askedCounts[id] || result.some((item) => item.intent === id)) continue;
    const labels = {
      services: bilingualFallback('What services does TechSlot offer?', 'TechSlot kaunsi services deta hai?'),
      portfolio: bilingualFallback('Can I see your portfolio?', 'Kya main portfolio dekh sakta hoon?'),
      pricing: bilingualFallback('How much does a website cost?', 'Website kitne ka banega?'),
      timeline: bilingualFallback('How long will it take?', 'Kitne din lagenge?'),
      process: bilingualFallback('How does your project process work?', 'Aapka project process kaise kaam karta hai?'),
      technology: bilingualFallback('What technologies do you use?', 'Aap kaunsi technologies use karte hain?'),
      maintenance: bilingualFallback('Do you offer maintenance?', 'Kya aap maintenance dete hain?'),
      start: bilingualFallback('How can I start a project?', 'Project kaise shuru karoon?'),
    };
    if (labels[id]) result.push({ text: localized(labels[id], language), intent: id });
  }
  return result;
};

const validLead = (values, options) => Boolean(
  values.name.length >= 2
  && values.name.length <= 100
  && /^\S+@\S+\.\S+$/.test(values.email)
  && values.email.length <= 254
  && validOptionSet(options, 'projectType').has(values.projectType)
  && validOptionSet(options, 'budget').has(values.budget)
  && validOptionSet(options, 'timeline').has(values.timeline)
  && values.message.length >= 10
  && values.message.length <= 2000
);

const matchOption = (message, options) => {
  const normalized = normalize(message);
  const index = Number.parseInt(normalized, 10) - 1;
  if (Number.isInteger(index) && index >= 0 && index < options.length) return options[index];
  return options.find((option) => normalized === normalize(option)
    || normalized.includes(normalize(option))) || null;
};

const matchMessageIntent = (message) => {
  const matches = intents
    .map((intent) => ({ intent, score: scoreIntent(message, intent) }))
    .filter(({ score }) => score >= 3)
    .sort((left, right) => right.score - left.score);
  const substantive = matches.filter(({ intent }) => !smallTalkIds.has(intent.id) && intent.id !== 'more');
  if (substantive.length) {
    const isMultiIntent = /\b(and|also|plus|aur)\b/.test(normalize(message));
    return isMultiIntent ? substantive.slice(0, 2) : substantive.slice(0, 1);
  }
  return matches.slice(0, 1);
};

const turnAnswer = async (message, intentId, context, providers) => {
  const intent = getIntent(intentId);
  const count = context.askedCounts[intentId] || 0;
  if (intentId === 'more') {
    const previous = getIntent(context.lastIntent);
    if (previous && !['greeting', 'thanks', 'bye', 'bot', 'help', 'more'].includes(previous.id)) {
      const expanded = await dynamicAnswer({ ...previous, answer: previous.more }, context.language, providers);
      context.askedCounts[previous.id] = Math.min((context.askedCounts[previous.id] || 0) + 1, 20);
      context.lastIntent = previous.id;
      return { ...expanded, intentId: previous.id, offerLead: previous.offerLead };
    }
    return { answer: localized(intent.answer, context.language), links: [], intentId, offerLead: false };
  }
  const selected = count === 0
    ? intent
    : count === 1
      ? { ...intent, answer: intent.more }
      : { ...intent, answer: intent.later, dynamic: undefined };
  const answer = await dynamicAnswer(selected, context.language, providers);
  context.askedCounts[intentId] = Math.min(count + 1, 20);
  context.lastIntent = intentId;
  return { ...answer, intentId, offerLead: intent.offerLead === true };
};

const response = (answers, context, suggestions = []) => ({ answers, context, suggestions });

export const processChatMessage = async (message, inputContext = {}, providers = {}) => {
  const safeMessage = cleanField(message, 500);
  const context = sanitizeContext(inputContext, providers.contactOptions);
  context.language = detectLanguage(safeMessage, context.language);
  const options = {
    projectType: providers.contactOptions?.projectType || [],
    budget: providers.contactOptions?.budget || [],
    timeline: providers.contactOptions?.timeline || [],
  };

  if (!safeMessage) {
    return response([{ answer: localized(bilingualFallback('Please enter a question.', 'Apna sawaal likhein.')), links: [] }], context);
  }

  const pending = context.pendingAction;
  if (isCancel(safeMessage)) {
    context.pendingAction = null;
    return response([{ answer: localized(bilingualFallback('Your inquiry was cancelled. What else can I help with?', 'Aapki inquiry cancel kar di gayi. Main aur kis baat mein madad karoon?'), context.language), links: [] }], context);
  }

  if (pending?.type === 'offerLead' && isAffirmative(safeMessage)) {
    context.pendingAction = { type: 'lead', step: 'name', values: Object.fromEntries(contactFields.map((field) => [field, ''])) };
    return response([{ answer: promptForStep('name', context.language, options), links: [] }], context, suggestionsFor(context.lastIntent || 'start', context, context.language));
  }

  if (pending?.type === 'lead') {
    if (pending.step === 'confirm') {
      if (isAffirmative(safeMessage)) {
        if (!validLead(pending.values, providers.contactOptions)) {
          context.pendingAction = { type: 'lead', step: 'name', values: Object.fromEntries(contactFields.map((field) => [field, ''])) };
          return response([{ answer: localized(bilingualFallback('Some inquiry details were invalid. Let’s start again. What name should I use?', 'Kuch inquiry details sahi nahi the. Dobara shuru karte hain. Kaunsa naam use karoon?'), context.language), links: [] }], context, suggestionsFor(context.lastIntent || 'start', context, context.language));
        }
        await providers.saveLead({ ...pending.values });
        context.pendingAction = null;
        context.misses = 0;
        return response([{ answer: localized(bilingualFallback('Thanks! Your inquiry has been received.', 'Shukriya! Aapki inquiry mil gayi hai.'), context.language), links: [] }], context, suggestionsFor('start', context, context.language));
      }
      if (isNegative(safeMessage)) {
        context.pendingAction = null;
        return response([{ answer: localized(bilingualFallback('No problem. Your inquiry was not sent.', 'Koi baat nahi. Aapki inquiry nahi bheji gayi.'), context.language), links: [] }], context, suggestionsFor('start', context, context.language));
      }
    } else {
      const questionIntents = isLikelyQuestion(safeMessage) ? matchMessageIntent(safeMessage) : [];
      if (questionIntents.length && !isAffirmative(safeMessage) && !isNegative(safeMessage)) {
        const answers = [];
        for (const { intent } of questionIntents) {
          const answer = await turnAnswer(safeMessage, intent.id, context, providers);
          answers.push({ answer: answer.answer, links: answer.links });
        }
        answers.push({ answer: promptForStep(pending.step, context.language, options), links: [] });
        return response(answers, context, suggestionsFor(context.lastIntent, context, context.language));
      }
      const step = pending.step;
      const value = cleanField(safeMessage, step === 'message' ? 2000 : 254);
      let accepted = value;
      if (step === 'email' && !/^\S+@\S+\.\S+$/.test(value)) accepted = '';
      if (step === 'name' && (value.length < 2 || value.length > 100)) accepted = '';
      if (optionFields.includes(step)) accepted = matchOption(safeMessage, options[step]) || '';
      if (step === 'message' && value.length < 10) accepted = '';

      if (!accepted) {
        const retry = step === 'email'
          ? localized(bilingualFallback('That email does not look valid. Please enter a valid email address.', 'Yeh email valid nahi lagta. Sahi email address bhejein.'), context.language)
          : localized(bilingualFallback('I could not validate that response. Please try again.', 'Yeh jawab validate nahi hua. Dobara koshish karein.'), context.language);
        return response([{ answer: `${retry}\n${promptForStep(step, context.language, options)}`, links: [] }], context, suggestionsFor(context.lastIntent || 'start', context, context.language));
      }

      const values = { ...pending.values, [step]: accepted };
      const nextStep = contactFields[contactFields.indexOf(step) + 1];
      if (nextStep) {
        context.pendingAction = { type: 'lead', step: nextStep, values };
        return response([{ answer: promptForStep(nextStep, context.language, options), links: [] }], context, suggestionsFor(context.lastIntent || 'start', context, context.language));
      }
      if (!validLead(values, providers.contactOptions)) {
        return response([{ answer: localized(bilingualFallback('I could not validate the complete inquiry. Please cancel and start again.', 'Puri inquiry validate nahi ho paayi. Cancel karke dobara shuru karein.'), context.language), links: [] }], context, suggestionsFor(context.lastIntent || 'start', context, context.language));
      }
      context.pendingAction = { type: 'lead', step: 'confirm', values };
      const summary = localized(bilingualFallback(
        `Please confirm this inquiry:\nName: ${values.name}\nEmail: ${values.email}\nProject type: ${values.projectType}\nBudget: ${values.budget}\nTimeline: ${values.timeline}\nMessage: ${values.message}\nReply yes to send or no to discard.`,
        `Inquiry confirm karein:\nNaam: ${values.name}\nEmail: ${values.email}\nProject type: ${values.projectType}\nBudget: ${values.budget}\nTimeline: ${values.timeline}\nMessage: ${values.message}\nBhejne ke liye haan, discard karne ke liye nahi likhein.`
      ), context.language);
      return response([{ answer: summary, links: [] }], context, suggestionsFor(context.lastIntent || 'start', context, context.language));
    }
  }

  if (pending?.type === 'offerLead' && isNegative(safeMessage)) context.pendingAction = null;

  const matches = matchMessageIntent(safeMessage);
  if (!matches.length) {
    context.misses = Math.min(context.misses + 1, 2);
    const offer = context.misses >= 2
      ? localized(bilingualFallback('I’m sorry I missed that twice. Would you like me to send your question as an inquiry?', 'Maaf kijiye, main do baar samajh nahi paaya. Kya aap apna sawaal inquiry ke roop mein bhejna chahenge?'), context.language)
      : localized(bilingualFallback('I’m not sure about that, and I don’t want to guess. Please see the contact page for help with details not published on the website.', 'Mujhe is baare mein pakki jaankari nahi hai, aur main andaaza nahi lagaunga. Website par na di gayi details ke liye contact page dekhein.'), context.language);
    context.pendingAction = context.misses >= 2 ? { type: 'offerLead' } : null;
    return {
      ...response([{
        answer: offer,
        links: [{ label: localized(bilingualFallback('Contact TechSlot', 'TechSlot se contact karein'), context.language), url: '/contact' }],
        contactCta: true,
      }], context, suggestionsFor('help', context, context.language)),
      unanswered: true,
    };
  }

  context.misses = 0;
  const answers = [];
  let leadOfferAdded = false;
  for (const { intent } of matches.slice(0, 2)) {
    const result = await turnAnswer(safeMessage, intent.id, context, providers);
    answers.push({ answer: result.answer, links: result.links, contactCta: result.offerLead });
    if (result.offerLead && !leadOfferAdded) {
      leadOfferAdded = true;
      context.pendingAction = { type: 'offerLead' };
      answers[answers.length - 1].answer += `\n\n${localized(result.intentId === 'pricing' || result.intentId === 'timeline'
        ? getIntent(result.intentId).ask
        : bilingualFallback('Want me to send your inquiry from here?', 'Kya main yahin se aapki inquiry bhejoon?'), context.language)}`;
    }
  }
  const suggestions = suggestionsFor(context.lastIntent, context, context.language);
  return response(answers, context, suggestions);
};
