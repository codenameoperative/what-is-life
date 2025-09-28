export interface TriviaQuestion {
  id: string
  question: string
  options: [string, string, string]
  correctAnswer: number // 0, 1, or 2
  bonus: {
    wtc: number
    type: 'wtc' | 'item' | 'both'
    itemId?: string // if type is 'item' or 'both'
  }
}

export const triviaQuestions: TriviaQuestion[] = [
  {
    id: 'math_1',
    question: 'What is 15 + 27?',
    options: ['42', '41', '43'],
    correctAnswer: 0,
    bonus: { wtc: 25, type: 'wtc' }
  },
  {
    id: 'math_2',
    question: 'What is 8 × 7?',
    options: ['54', '56', '58'],
    correctAnswer: 1,
    bonus: { wtc: 30, type: 'wtc' }
  },
  {
    id: 'math_3',
    question: 'What is 144 ÷ 12?',
    options: ['11', '12', '13'],
    correctAnswer: 1,
    bonus: { wtc: 20, type: 'wtc' }
  },
  {
    id: 'science_1',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au'],
    correctAnswer: 2,
    bonus: { wtc: 35, type: 'wtc' }
  },
  {
    id: 'science_2',
    question: 'How many bones are in the adult human body?',
    options: ['206', '208', '210'],
    correctAnswer: 0,
    bonus: { wtc: 40, type: 'wtc' }
  },
  {
    id: 'science_3',
    question: 'What is the largest planet in our solar system?',
    options: ['Saturn', 'Jupiter', 'Neptune'],
    correctAnswer: 1,
    bonus: { wtc: 45, type: 'wtc' }
  },
  {
    id: 'history_1',
    question: 'In which year did World War II end?',
    options: ['1944', '1945', '1946'],
    correctAnswer: 1,
    bonus: { wtc: 50, type: 'wtc' }
  },
  {
    id: 'history_2',
    question: 'Who was the first person to walk on the moon?',
    options: ['Buzz Aldrin', 'Neil Armstrong', 'Michael Collins'],
    correctAnswer: 1,
    bonus: { wtc: 55, type: 'wtc' }
  },
  {
    id: 'history_3',
    question: 'Which ancient wonder was located in Alexandria?',
    options: ['Hanging Gardens', 'Lighthouse', 'Colossus'],
    correctAnswer: 1,
    bonus: { wtc: 60, type: 'wtc' }
  },
  {
    id: 'geography_1',
    question: 'What is the capital of Japan?',
    options: ['Seoul', 'Tokyo', 'Beijing'],
    correctAnswer: 1,
    bonus: { wtc: 25, type: 'wtc' }
  },
  {
    id: 'geography_2',
    question: 'Which is the longest river in the world?',
    options: ['Amazon', 'Nile', 'Mississippi'],
    correctAnswer: 1,
    bonus: { wtc: 30, type: 'wtc' }
  },
  {
    id: 'geography_3',
    question: 'What is the smallest country in the world?',
    options: ['Monaco', 'Vatican City', 'San Marino'],
    correctAnswer: 1,
    bonus: { wtc: 35, type: 'wtc' }
  },
  {
    id: 'literature_1',
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Shakespeare', 'Dickens', 'Austen'],
    correctAnswer: 0,
    bonus: { wtc: 40, type: 'wtc' }
  },
  {
    id: 'literature_2',
    question: 'What is the first book in the Harry Potter series?',
    options: ['Chamber of Secrets', 'Philosopher\'s Stone', 'Prisoner of Azkaban'],
    correctAnswer: 1,
    bonus: { wtc: 45, type: 'wtc' }
  },
  {
    id: 'literature_3',
    question: 'Who wrote "1984"?',
    options: ['Aldous Huxley', 'George Orwell', 'Ray Bradbury'],
    correctAnswer: 1,
    bonus: { wtc: 50, type: 'wtc' }
  },
  {
    id: 'sports_1',
    question: 'How many players are on a basketball team on the court?',
    options: ['4', '5', '6'],
    correctAnswer: 1,
    bonus: { wtc: 25, type: 'wtc' }
  },
  {
    id: 'sports_2',
    question: 'In which sport would you perform a slam dunk?',
    options: ['Tennis', 'Basketball', 'Volleyball'],
    correctAnswer: 1,
    bonus: { wtc: 30, type: 'wtc' }
  },
  {
    id: 'sports_3',
    question: 'What does FIFA stand for?',
    options: ['Federation of International Football Associations', 'Federation of International Football Association', 'Federation Internationale de Football Association'],
    correctAnswer: 2,
    bonus: { wtc: 35, type: 'wtc' }
  },
  {
    id: 'technology_1',
    question: 'What does "www" stand for in a website address?',
    options: ['World Wide Web', 'World Web Wide', 'Wide World Web'],
    correctAnswer: 0,
    bonus: { wtc: 25, type: 'wtc' }
  },
  {
    id: 'technology_2',
    question: 'Who is the founder of Microsoft?',
    options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg'],
    correctAnswer: 1,
    bonus: { wtc: 40, type: 'wtc' }
  },
  {
    id: 'technology_3',
    question: 'What does "AI" stand for?',
    options: ['Automated Intelligence', 'Artificial Intelligence', 'Advanced Intelligence'],
    correctAnswer: 1,
    bonus: { wtc: 45, type: 'wtc' }
  },
  {
    id: 'music_1',
    question: 'Which instrument has 88 keys?',
    options: ['Guitar', 'Piano', 'Violin'],
    correctAnswer: 1,
    bonus: { wtc: 25, type: 'wtc' }
  },
  {
    id: 'music_2',
    question: 'Who composed "The Four Seasons"?',
    options: ['Mozart', 'Vivaldi', 'Beethoven'],
    correctAnswer: 1,
    bonus: { wtc: 35, type: 'wtc' }
  },
  {
    id: 'music_3',
    question: 'What is the most famous work by Beethoven?',
    options: ['Symphony No. 5', 'Symphony No. 9', 'Symphony No. 7'],
    correctAnswer: 1,
    bonus: { wtc: 40, type: 'wtc' }
  },
  {
    id: 'food_1',
    question: 'Which country is famous for sushi?',
    options: ['China', 'Japan', 'Korea'],
    correctAnswer: 1,
    bonus: { wtc: 25, type: 'wtc' }
  },
  {
    id: 'food_2',
    question: 'What is the main ingredient in guacamole?',
    options: ['Tomato', 'Avocado', 'Onion'],
    correctAnswer: 1,
    bonus: { wtc: 30, type: 'wtc' }
  },
  {
    id: 'hunting_license_1',
    question: 'What is the best way to approach wildlife?',
    options: ['Run towards them', 'Stay quiet and observe', 'Make loud noises'],
    correctAnswer: 1,
    bonus: { wtc: 0, type: 'item', itemId: 'hunters_license' }
  },
  {
    id: 'hunting_license_2',
    question: 'What is the most important rule of ethical hunting?',
    options: ['Take only what you need', 'Take as much as possible', 'Only hunt rare animals'],
    correctAnswer: 0,
    bonus: { wtc: 0, type: 'item', itemId: 'hunters_license' }
  },
  {
    id: 'work_bonus_1',
    question: 'What is the key to workplace success?',
    options: ['Being the loudest', 'Hard work and dedication', 'Taking long breaks'],
    correctAnswer: 1,
    bonus: { wtc: 100, type: 'wtc' }
  },
  {
    id: 'work_bonus_2',
    question: 'How do you handle workplace conflicts?',
    options: ['Avoid them', 'Address them professionally', 'Start arguments'],
    correctAnswer: 1,
    bonus: { wtc: 150, type: 'both', itemId: 'hunters_license' }
  },
  {
    id: 'rare_item_1',
    question: 'What makes a leader effective?',
    options: ['Giving orders', 'Inspiring others', 'Working alone'],
    correctAnswer: 1,
    bonus: { wtc: 200, type: 'item', itemId: 'hunters_license' }
  },
  {
    id: 'gaming_1',
    question: 'What was the first commercially successful video game?',
    options: ['Pong', 'Space Invaders', 'Pac-Man'],
    correctAnswer: 0,
    bonus: { wtc: 75, type: 'wtc' }
  },
  {
    id: 'gaming_2',
    question: 'Which company created the PlayStation?',
    options: ['Nintendo', 'Sony', 'Microsoft'],
    correctAnswer: 1,
    bonus: { wtc: 80, type: 'wtc' }
  },
  {
    id: 'gaming_3',
    question: 'What is the highest-selling video game of all time?',
    options: ['Minecraft', 'Grand Theft Auto V', 'Tetris'],
    correctAnswer: 2,
    bonus: { wtc: 85, type: 'wtc' }
  },
  {
    id: 'animals_1',
    question: 'What is the fastest land animal?',
    options: ['Lion', 'Cheetah', 'Leopard'],
    correctAnswer: 1,
    bonus: { wtc: 65, type: 'wtc' }
  },
  {
    id: 'animals_2',
    question: 'Which animal can hold its breath underwater for up to 2 hours?',
    options: ['Dolphin', 'Whale', 'Beaver'],
    correctAnswer: 2,
    bonus: { wtc: 70, type: 'wtc' }
  },
  {
    id: 'animals_3',
    question: 'What is a group of flamingos called?',
    options: ['Herd', 'Flock', 'Flamboyance'],
    correctAnswer: 2,
    bonus: { wtc: 60, type: 'wtc' }
  },
  {
    id: 'space_1',
    question: 'How many planets are there in our solar system?',
    options: ['7', '8', '9'],
    correctAnswer: 1,
    bonus: { wtc: 90, type: 'wtc' }
  },
  {
    id: 'space_2',
    question: 'What is the largest moon in our solar system?',
    options: ['Titan', 'Ganymede', 'Europa'],
    correctAnswer: 1,
    bonus: { wtc: 95, type: 'wtc' }
  },
  {
    id: 'space_3',
    question: 'Who was the first human in space?',
    options: ['John Glenn', 'Alan Shepard', 'Yuri Gagarin'],
    correctAnswer: 2,
    bonus: { wtc: 100, type: 'wtc' }
  },
  {
    id: 'movies_1',
    question: 'Which movie won the first Academy Award for Best Picture?',
    options: ['Gone with the Wind', 'Wings', 'Casablanca'],
    correctAnswer: 1,
    bonus: { wtc: 110, type: 'wtc' }
  },
  {
    id: 'movies_2',
    question: 'Who directed "Jurassic Park"?',
    options: ['George Lucas', 'Steven Spielberg', 'James Cameron'],
    correctAnswer: 1,
    bonus: { wtc: 115, type: 'wtc' }
  },
  {
    id: 'movies_3',
    question: 'What is the highest-grossing film of all time?',
    options: ['Titanic', 'Avatar', 'Avengers: Endgame'],
    correctAnswer: 2,
    bonus: { wtc: 120, type: 'wtc' }
  },
  {
    id: 'programming_1',
    question: 'What does HTML stand for?',
    options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'],
    correctAnswer: 0,
    bonus: { wtc: 130, type: 'wtc' }
  },
  {
    id: 'programming_2',
    question: 'Which programming language is known as the "mother of all languages"?',
    options: ['C', 'Assembly', 'BASIC'],
    correctAnswer: 0,
    bonus: { wtc: 135, type: 'wtc' }
  },
  {
    id: 'programming_3',
    question: 'What is the most used programming language in 2023?',
    options: ['Python', 'JavaScript', 'Java'],
    correctAnswer: 1,
    bonus: { wtc: 140, type: 'wtc' }
  },
  {
    id: 'crypto_1',
    question: 'What is the maximum supply of Bitcoin?',
    options: ['18 million', '21 million', '25 million'],
    correctAnswer: 1,
    bonus: { wtc: 150, type: 'wtc' }
  },
  {
    id: 'crypto_2',
    question: 'Who created Bitcoin?',
    options: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Charlie Lee'],
    correctAnswer: 1,
    bonus: { wtc: 155, type: 'wtc' }
  },
  {
    id: 'crypto_3',
    question: 'What is the second largest cryptocurrency by market cap?',
    options: ['Bitcoin Cash', 'Ethereum', 'Litecoin'],
    correctAnswer: 1,
    bonus: { wtc: 160, type: 'wtc' }
  }
];

// Helper function to get a random trivia question
export function getRandomTriviaQuestion(): TriviaQuestion {
  const randomIndex = Math.floor(Math.random() * triviaQuestions.length)
  return triviaQuestions[randomIndex]
}
