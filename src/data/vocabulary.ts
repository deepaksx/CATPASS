export interface VocabWord {
  word: string;
  meaning: string;
}

export const verbalAnalogiesVocabulary: VocabWord[] = [
  // Opposites & contrasts
  { word: 'Ubiquitous', meaning: 'Found everywhere; seemingly present at all times' },
  { word: 'Ephemeral', meaning: 'Lasting a very short time; fleeting' },
  { word: 'Ameliorate', meaning: 'To make something bad or unsatisfactory better' },
  { word: 'Exacerbate', meaning: 'To make a problem, situation, or feeling worse' },
  { word: 'Reticent', meaning: 'Not revealing one\'s thoughts or feelings readily; reserved' },
  { word: 'Loquacious', meaning: 'Tending to talk a great deal; very talkative' },
  { word: 'Sycophant', meaning: 'A person who flatters someone important to gain advantage' },
  { word: 'Iconoclast', meaning: 'A person who attacks cherished beliefs or institutions' },
  { word: 'Pragmatic', meaning: 'Dealing with things sensibly and realistically rather than ideally' },
  { word: 'Quixotic', meaning: 'Exceedingly idealistic; unrealistic and impractical' },
  { word: 'Cogent', meaning: 'Clear, logical, and convincing (of an argument)' },
  { word: 'Specious', meaning: 'Superficially plausible but actually wrong; misleading' },
  { word: 'Magnanimous', meaning: 'Very generous or forgiving, especially toward a rival' },
  { word: 'Vindictive', meaning: 'Having a strong desire for revenge; unforgiving' },

  // Abstract reasoning & thought
  { word: 'Paradigm', meaning: 'A typical example or pattern; a model or framework of thinking' },
  { word: 'Juxtaposition', meaning: 'Placing two things close together to highlight contrast' },
  { word: 'Dichotomy', meaning: 'A division into two mutually exclusive or contradictory groups' },
  { word: 'Paradox', meaning: 'A statement that contradicts itself but may contain a truth' },
  { word: 'Conjecture', meaning: 'An opinion or conclusion formed without complete evidence' },
  { word: 'Axiom', meaning: 'A statement accepted as true without proof; a self-evident truth' },
  { word: 'Tautology', meaning: 'Saying the same thing twice in different words; needless repetition' },
  { word: 'Antithesis', meaning: 'The direct opposite of something; a strong contrast' },

  // Degree & intensity
  { word: 'Annihilate', meaning: 'To destroy utterly and completely (stronger than "destroy")' },
  { word: 'Diminish', meaning: 'To make or become gradually less; to reduce in importance' },
  { word: 'Abhor', meaning: 'To regard with extreme disgust and hatred (stronger than "dislike")' },
  { word: 'Venerate', meaning: 'To regard with great respect and reverence (stronger than "admire")' },
  { word: 'Destitute', meaning: 'Extremely poor; lacking basic necessities (stronger than "poor")' },
  { word: 'Opulent', meaning: 'Ostentatiously rich and luxurious (stronger than "wealthy")' },
  { word: 'Euphoria', meaning: 'An intense feeling of excitement and happiness' },
  { word: 'Despondent', meaning: 'In low spirits from loss of hope or courage' },

  // Cause, effect & process
  { word: 'Precipitate', meaning: 'To cause something to happen suddenly or sooner than expected' },
  { word: 'Mitigate', meaning: 'To make less severe, serious, or painful' },
  { word: 'Catalyze', meaning: 'To cause or accelerate a reaction or change' },
  { word: 'Stagnate', meaning: 'To cease developing; to become inactive or dull' },
  { word: 'Proliferate', meaning: 'To increase rapidly in number; to spread widely' },
  { word: 'Atrophy', meaning: 'To gradually decline in effectiveness or waste away from disuse' },
  { word: 'Galvanize', meaning: 'To shock or excite someone into taking action' },
  { word: 'Ossify', meaning: 'To become rigid or fixed in attitude; to cease developing' },

  // Character & behaviour
  { word: 'Tenacious', meaning: 'Holding firmly to something; persistent and determined' },
  { word: 'Capricious', meaning: 'Given to sudden and unaccountable changes of mood or behaviour' },
  { word: 'Meticulous', meaning: 'Showing great attention to detail; very careful and precise' },
  { word: 'Negligent', meaning: 'Failing to take proper care; careless' },
  { word: 'Altruistic', meaning: 'Showing selfless concern for the well-being of others' },
  { word: 'Avaricious', meaning: 'Having extreme greed for wealth or material gain' },
  { word: 'Audacious', meaning: 'Showing a willingness to take bold risks; daring' },
  { word: 'Circumspect', meaning: 'Wary and unwilling to take risks; cautious' },
  { word: 'Obsequious', meaning: 'Excessively obedient or attentive to gain favour; servile' },
  { word: 'Recalcitrant', meaning: 'Stubbornly resistant to authority or control; defiant' },

  // Communication & expression
  { word: 'Eloquent', meaning: 'Fluent and persuasive in speaking or writing' },
  { word: 'Taciturn', meaning: 'Reserved or uncommunicative; saying very little' },
  { word: 'Candid', meaning: 'Truthful and straightforward; frank' },
  { word: 'Equivocate', meaning: 'To use ambiguous language to conceal the truth or avoid commitment' },
  { word: 'Rhetoric', meaning: 'The art of effective or persuasive speaking or writing' },
  { word: 'Platitude', meaning: 'A remark that has been used too often to be meaningful; a cliche' },
  { word: 'Diatribe', meaning: 'A forceful and bitter verbal attack against someone or something' },
  { word: 'Eulogy', meaning: 'A speech that praises someone highly, especially one given at a funeral' },

  // Relationships & social structures
  { word: 'Hegemony', meaning: 'Leadership or dominance, especially by one country or group over others' },
  { word: 'Autonomy', meaning: 'The right or condition of self-governance; independence' },
  { word: 'Hierarchy', meaning: 'A system in which members are ranked according to status or authority' },
  { word: 'Anarchy', meaning: 'A state of disorder due to absence of authority or governance' },
  { word: 'Nepotism', meaning: 'Favouring relatives or friends by giving them jobs or other advantages' },
  { word: 'Meritocracy', meaning: 'A system where advancement is based on ability and talent, not privilege' },

  // Properties & descriptions
  { word: 'Esoteric', meaning: 'Intended for or understood by only a small number of people with specialized knowledge' },
  { word: 'Mundane', meaning: 'Lacking interest or excitement; dull and ordinary' },
  { word: 'Pernicious', meaning: 'Having a harmful effect, especially in a gradual or subtle way' },
  { word: 'Benign', meaning: 'Gentle and kindly; not harmful in effect' },
  { word: 'Superfluous', meaning: 'Unnecessary, especially through being more than enough' },
  { word: 'Indispensable', meaning: 'Absolutely necessary; too important to do without' },
  { word: 'Ambivalent', meaning: 'Having mixed or contradictory feelings about something' },
  { word: 'Resolute', meaning: 'Admirably purposeful, determined, and unwavering' },
  { word: 'Insidious', meaning: 'Proceeding in a gradual, subtle way but with harmful effects' },
  { word: 'Conspicuous', meaning: 'Standing out so as to be clearly visible; attracting attention' },
  { word: 'Anachronistic', meaning: 'Belonging to a period other than the one being portrayed; outdated' },
  { word: 'Avant-garde', meaning: 'New and experimental; favouring innovation in art or culture' },

  // Science & reasoning
  { word: 'Empirical', meaning: 'Based on observation or experience rather than theory' },
  { word: 'Theoretical', meaning: 'Based on abstract reasoning rather than practical experience' },
  { word: 'Hypothesis', meaning: 'A proposed explanation made on limited evidence as a starting point' },
  { word: 'Postulate', meaning: 'A thing suggested or assumed as true as the basis for reasoning' },
  { word: 'Causation', meaning: 'The relationship between cause and effect' },
  { word: 'Correlation', meaning: 'A mutual relationship between two things that does not imply one causes the other' },
  { word: 'Anomaly', meaning: 'Something that deviates from what is standard, normal, or expected' },
  { word: 'Entropy', meaning: 'Gradual decline into disorder; a measure of randomness in a system' },
];
