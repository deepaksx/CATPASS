export interface VocabWord {
  word: string;
  meaning: string;
}

export const verbalAnalogiesVocabulary: VocabWord[] = [
  // Synonyms — words with similar meanings (commonly paired in exams)
  { word: 'Courageous', meaning: 'Brave; willing to face danger or difficulty' },
  { word: 'Valiant', meaning: 'Showing great courage, especially in battle' },
  { word: 'Precise', meaning: 'Exact and accurate in every detail' },
  { word: 'Sluggish', meaning: 'Slow-moving; lacking energy' },
  { word: 'Joyful', meaning: 'Feeling or showing great happiness' },
  { word: 'Miserable', meaning: 'Very unhappy or uncomfortable' },
  { word: 'Enormous', meaning: 'Very large in size or amount' },
  { word: 'Miniature', meaning: 'Very small; a tiny version of something' },
  { word: 'Murmur', meaning: 'To speak very softly or quietly' },
  { word: 'Persuade', meaning: 'To convince someone to do or believe something' },

  // Antonyms — words with opposite meanings (frequently tested)
  { word: 'Ovation', meaning: 'Enthusiastic applause or praise' },
  { word: 'Silence', meaning: 'Complete absence of sound' },
  { word: 'Expenditure', meaning: 'The amount of money spent on something' },
  { word: 'Savings', meaning: 'Money set aside and not spent' },
  { word: 'Flourish', meaning: 'To grow or develop well; to thrive' },
  { word: 'Fade', meaning: 'To gradually grow weaker or disappear' },
  { word: 'Entice', meaning: 'To attract or tempt someone by offering something appealing' },
  { word: 'Repel', meaning: 'To drive or push away; to cause dislike' },
  { word: 'Drought', meaning: 'A long period of unusually low rainfall' },
  { word: 'Flood', meaning: 'An overflow of water that covers normally dry land' },

  // Degree & intensity — stronger/weaker versions (key exam pattern)
  { word: 'Furious', meaning: 'Extremely angry (stronger than annoyed)' },
  { word: 'Irritated', meaning: 'Slightly annoyed or bothered' },
  { word: 'Terrified', meaning: 'Extremely frightened (stronger than scared)' },
  { word: 'Anxious', meaning: 'Feeling worried or uneasy' },
  { word: 'Ecstatic', meaning: 'Overwhelmingly happy and excited' },
  { word: 'Content', meaning: 'Satisfied and at peace; not wanting more' },
  { word: 'Exhausted', meaning: 'Extremely tired; completely drained of energy' },
  { word: 'Famished', meaning: 'Extremely hungry (stronger than hungry)' },
  { word: 'Freezing', meaning: 'Extremely cold (stronger than chilly)' },
  { word: 'Scorching', meaning: 'Extremely hot (stronger than warm)' },
  { word: 'Drip', meaning: 'A small drop of liquid falling slowly' },
  { word: 'Gush', meaning: 'A sudden, strong flow of liquid' },

  // Worker, role & workplace — person and what they do or where they work
  { word: 'Surgeon', meaning: 'A doctor who performs medical operations' },
  { word: 'Podiatrist', meaning: 'A doctor who specialises in treating feet' },
  { word: 'Neurologist', meaning: 'A doctor who specialises in the brain and nervous system' },
  { word: 'Architect', meaning: 'A person who designs buildings and structures' },
  { word: 'Conductor', meaning: 'A person who directs an orchestra or manages a train' },
  { word: 'Curator', meaning: 'A person who looks after a museum or art collection' },
  { word: 'Apprentice', meaning: 'A person learning a trade from a skilled worker' },
  { word: 'Mentor', meaning: 'An experienced person who guides and teaches someone' },
  { word: 'Pilot', meaning: 'A person who flies an aircraft' },
  { word: 'Barrister', meaning: 'A lawyer who argues cases in higher courts' },

  // Tool / object & function — what something is used for
  { word: 'Compass', meaning: 'An instrument used to find direction (north, south, etc.)' },
  { word: 'Thermometer', meaning: 'An instrument used to measure temperature' },
  { word: 'Microscope', meaning: 'An instrument used to see very small things up close' },
  { word: 'Telescope', meaning: 'An instrument used to see distant objects more clearly' },
  { word: 'Stethoscope', meaning: 'A medical instrument used to listen to heartbeat and breathing' },
  { word: 'Furnace', meaning: 'An enclosed structure used to produce intense heat' },
  { word: 'Generator', meaning: 'A machine that converts energy into electricity' },
  { word: 'Barricade', meaning: 'A barrier used to block passage or access' },

  // Part & whole — one thing is part of another (core exam pattern)
  { word: 'Petal', meaning: 'One of the coloured parts that form a flower' },
  { word: 'Tributary', meaning: 'A smaller river that flows into a larger one' },
  { word: 'Archipelago', meaning: 'A group or chain of islands' },
  { word: 'Peninsula', meaning: 'A piece of land almost completely surrounded by water' },
  { word: 'Constellation', meaning: 'A group of stars forming a recognised pattern' },
  { word: 'Anthology', meaning: 'A published collection of poems, stories, or writings' },
  { word: 'Fragment', meaning: 'A small piece broken off from something larger' },
  { word: 'Component', meaning: 'A part or element of a larger whole' },

  // Category & example — one word is a type of the other
  { word: 'Mammal', meaning: 'A warm-blooded animal that feeds its young with milk' },
  { word: 'Reptile', meaning: 'A cold-blooded animal with scales (e.g. snake, lizard)' },
  { word: 'Herbivore', meaning: 'An animal that eats only plants' },
  { word: 'Carnivore', meaning: 'An animal that eats only meat' },
  { word: 'Omnivore', meaning: 'An animal that eats both plants and meat' },
  { word: 'Predator', meaning: 'An animal that hunts and eats other animals' },
  { word: 'Habitat', meaning: 'The natural home or environment of an animal or plant' },
  { word: 'Vegetation', meaning: 'Plants in general; plant life of a particular area' },

  // Cause & effect — one thing leads to another
  { word: 'Provoke', meaning: 'To deliberately cause a reaction, often anger' },
  { word: 'Consequence', meaning: 'A result or effect of an action or situation' },
  { word: 'Catalyst', meaning: 'Something that causes an important change to happen' },
  { word: 'Erosion', meaning: 'The gradual wearing away of rock or soil by water or wind' },
  { word: 'Fatigue', meaning: 'Extreme tiredness resulting from physical or mental effort' },
  { word: 'Contaminate', meaning: 'To make something impure by adding a harmful substance' },

  // Abstract concepts & academic words (tested in harder questions)
  { word: 'Hypothesis', meaning: 'A proposed explanation based on limited evidence, to be tested' },
  { word: 'Proposition', meaning: 'A statement or suggestion put forward for consideration' },
  { word: 'Assumption', meaning: 'A thing accepted as true without proof' },
  { word: 'Deduction', meaning: 'A conclusion reached by reasoning from general principles' },
  { word: 'Observation', meaning: 'The act of watching something carefully to gain information' },
  { word: 'Compulsory', meaning: 'Required by law or a rule; mandatory' },
  { word: 'Voluntary', meaning: 'Done by choice, not because it is required' },
  { word: 'Permanent', meaning: 'Lasting forever or for a very long time; not temporary' },
  { word: 'Temporary', meaning: 'Lasting for only a limited period of time' },
  { word: 'Abundant', meaning: 'Existing in large quantities; plentiful' },
  { word: 'Scarce', meaning: 'In short supply; not enough to meet demand' },

  // Properties & descriptions — characteristics of things
  { word: 'Opaque', meaning: 'Not see-through; blocking light completely' },
  { word: 'Translucent', meaning: 'Allowing some light through, but not fully transparent' },
  { word: 'Rigid', meaning: 'Stiff and unable to bend; strict and inflexible' },
  { word: 'Flexible', meaning: 'Able to bend easily without breaking; adaptable' },
  { word: 'Fragile', meaning: 'Easily broken or damaged; delicate' },
  { word: 'Durable', meaning: 'Able to withstand wear and tear; long-lasting' },
  { word: 'Concise', meaning: 'Giving information clearly and briefly; to the point' },
  { word: 'Verbose', meaning: 'Using more words than necessary; long-winded' },
  { word: 'Prominent', meaning: 'Important, famous, or standing out clearly' },
  { word: 'Obscure', meaning: 'Not well known; difficult to understand' },
  { word: 'Obsolete', meaning: 'No longer in use or out of date' },
  { word: 'Novel', meaning: 'New and original; not like anything seen before' },

  // Collective nouns & groupings (tested in analogies)
  { word: 'Ensemble', meaning: 'A group of musicians, actors, or things that work together' },
  { word: 'Flock', meaning: 'A group of birds or sheep' },
  { word: 'Swarm', meaning: 'A large group of insects moving together' },
  { word: 'Battalion', meaning: 'A large organised group of soldiers' },

  // Material & product — what something is made from
  { word: 'Lumber', meaning: 'Timber that has been sawn into boards or planks' },
  { word: 'Ore', meaning: 'Rock or earth from which metal can be extracted' },
  { word: 'Fibre', meaning: 'A thread or strand used to make cloth or rope' },
  { word: 'Alloy', meaning: 'A metal made by combining two or more metals' },
];
