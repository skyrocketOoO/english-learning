'use client';

import { useState, useEffect } from 'react';

// Define types for Word and Option
interface Word {
  english: string;
  chinese: string;
  partOfSpeech: string;
  id: string
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
  const [currentIwordInd, setCurrentWordInd] = useState<number>(0);
  const [finish, setFinish] = useState<boolean>(false);

  useEffect(() => {
    const fetchWords = async () => {
      const sessionToken = localStorage.getItem('sessionToken');
      const response = await fetch('/api/words', {
        headers: {
          'Authorization': `${sessionToken}`,
        },
      });
      const data: Word[] = await response.json(); // Type the data as an array of Word objects
      setWordList(data);
      setCurrentWordInd(0);
      if (data.length > 0) {
        console.log(data.length);
        chooseNextWord(data);
      }
    };

    fetchWords();
  }, []);

  const chooseNextWord = (wordList: Word[]) => {
    if (currentIwordInd == 10){
      setFinish(true);
      return;
    }
    setCurrentWordInd(currentIwordInd+1);
    const correctWord = wordList[currentIwordInd];
    const incorrectWords = wordList
      .filter((word) => word.english !== correctWord.english && word.partOfSpeech !== correctWord.partOfSpeech)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const answerOptions = [...incorrectWords, correctWord].sort(() => 0.5 - Math.random());
    setCurrentWord(correctWord);
    setOptions(answerOptions);
    setMessage('');
  };

  const handleAnswerClick = async (selectedChinese: string) => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (selectedChinese === currentWord?.chinese) {
      await fetch('/api/words/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${sessionToken}`,
        },
        body: JSON.stringify({
          wordID: currentWord.id,
          correct: true
        })
      });      
      chooseNextWord(wordList);
    } else {
      await fetch('/api/words/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${sessionToken}`,
        },
        body: JSON.stringify({
          wordID: currentWord?.id,
          correct: false
        })
      }); 
      setMessage("Are you serious?");
    }
  };

  const oneMore = async () => {
    setFinish(false);
    const fetchWords = async () => {
      const sessionToken = localStorage.getItem('sessionToken');
      const response = await fetch('/api/words', {
        headers: {
          'Authorization': `${sessionToken}`,
        },
      });
      const data: Word[] = await response.json(); // Type the data as an array of Word objects
      setWordList(data);
      setCurrentWordInd(0);
      if (data.length > 0) {
        console.log(data.length);
        chooseNextWord(data);
      }
    };

    fetchWords();
  }

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
        <div className="flex items-center justify-center m-3">
          {finish && (
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-blue-700" 
              onClick={() => oneMore()}
            >
              One more?
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
