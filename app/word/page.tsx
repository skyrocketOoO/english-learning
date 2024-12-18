'use client';

import { useState, useEffect } from 'react';

// Define types for Word and Option
interface Word {
  english: string;
  chinese: string;
  partOfSpeech: string;
}

interface Option {
  chinese: string;
}

export default function WordChallengePage() {
  // Define state types
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [message, setMessage] = useState<string>('');

  // Fetch words from the database on component mount
  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch('/api/words');
      const data: Word[] = await response.json(); // Type the data as an array of Word objects
      setWordList(data);
      if (data.length > 0) {
        chooseNewWord(data);
      }
    };

    fetchWords();
  }, []);

  const chooseNewWord = (wordList: Word[]) => {
    const correctWord = wordList[Math.floor(Math.random() * wordList.length)];
    const incorrectWords = wordList
      .filter((word) => word.english !== correctWord.english || word.partOfSpeech !== correctWord.partOfSpeech)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const answerOptions = [...incorrectWords, correctWord].sort(() => 0.5 - Math.random());
    setCurrentWord(correctWord);
    setOptions(answerOptions);
    setMessage('');
  };

  const handleAnswerClick = (selectedChinese: string) => {
    if (selectedChinese === currentWord?.chinese) {
      setMessage('Correct!');
      if (wordList.length > 0) {
        chooseNewWord(wordList);
      }
    } else {
      setMessage("Are you serious?");
      // setMessage(`Wrong! The correct answer is: ${currentWord?.chinese}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Word Challenge</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        {currentWord ? (
          <>
            <p className="text-base font-semibold mb-2">English:</p>
            <div className="text-2xl font-bold text-blue-600 mb-4">{currentWord.english}</div>
            <p className="text-base font-semibold mb-2">Part of Speech:</p>
            <div className="text-lg font-medium text-gray-700 mb-4">{currentWord.partOfSpeech}</div>

            <p className="text-base font-semibold mb-2">Choose the correct Chinese translation:</p>
            <div className="grid grid-cols-1 gap-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option.chinese)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  {option.chinese}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-2xl font-bold text-gray-500 mb-4">Loading...</div>
        )}

        {message && (
          <div className={`mt-4 text-base ${message === 'Correct!' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
