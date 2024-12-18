'use client';

import { useState, useEffect } from 'react';

export default function WordChallengePage() {
  const [inputWord, setInputWord] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [wordList, setWordList] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  // Fetch words from the database on component mount
  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch('/api/words');
      const data = await response.json();
      const words = data.map((word: { text: string }) => word.text);
      setWordList(words);
      if (words.length > 0) {
        setCurrentWord(words[Math.floor(Math.random() * words.length)]);
      }
    };

    fetchWords();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputWord(e.target.value);
  };

  const handleSubmit = () => {
    if (inputWord.toLowerCase() === currentWord.toLowerCase()) {
      setMessage('Correct!');
      setScore((prevScore) => prevScore + 1);

      // Select a new random word
      const newWord = wordList[Math.floor(Math.random() * wordList.length)];
      setCurrentWord(newWord);
    } else {
      setMessage('Try Again!');
    }
    setInputWord('');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Word Challenge</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <p className="text-lg font-semibold">Your word:</p>
        {currentWord ? (
          <div className="text-2xl font-bold text-blue-600 mb-4">{currentWord}</div>
        ) : (
          <div className="text-2xl font-bold text-gray-500 mb-4">Loading...</div>
        )}

        <input
          type="text"
          value={inputWord}
          onChange={handleInputChange}
          placeholder="Type the word here"
          className="w-full px-4 py-2 border rounded-md mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
          disabled={!currentWord}
        >
          Submit
        </button>

        {message && (
          <div className={`mt-4 text-lg ${message === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <p className="mt-4 text-gray-600">Score: {score}</p>
      </div>
    </main>
  );
}
