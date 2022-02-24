import './App.css';
import { flesch } from 'flesch' //Flesch API 
import React, { useState } from 'react';
import TextField from "@mui/material/TextField"

//import {fleschKincaid} from 'flesch-kincaid' - DELETE???

//PLAN
//the FLESCH API requires the following values:
//1. number of words (word)
//2. number of sentences (sentence)
//3. number of syllables (syllable)

// OR use this formula: RE = 206.835 – (1.015 x ASL) – (84.6 x ASW)
// 4. Where RE = Readability Ease
// 5. ASL = Average Sentence Length (i.e., the number of words divided by the number of sentences)
// 6. ASW = Average number of syllables per word (i.e., the number of syllables divided by the number of words)

function App() {

  // Use the React USESTATE Hook to capture text input
  const [input, setInput] = useState('This is a sentence. Another sentence.');
  // Splitting input by punctuation to get individual sentences
  const sentences = input.split(/[.?!]/).filter(Boolean) // Boolean() => true /false (this removes all 'falsy' values)


  // loop through each sentence and trim off any spaces before and after each sentence. Use .filter(Boolean) to remove any spaces after the final sentence. 
  let finalSentences = []
  sentences.forEach((x) => {
    let y = x.trim()
    finalSentences.push(y)
  })

  finalSentences = finalSentences.filter(Boolean)

  //.filter(Boolean); // Boolean() => true /false
  // Assign total number of syllables to variable 
  const output_syllables = number_of_syllables(finalSentences)


  // 1. Work out total number of words
  // Pass in 'sentences' from the input field
  // Loop through 'sentences' and split the sentences by each ' ' to give individual words
  // 'Count' returns the number of words
  function number_of_words(finalSentences) {
    let count = 0;
    finalSentences.forEach(element => {
      count += element.split(' ').length
    });
    return count
  }

  // 3a. Count the syllables in a word (taken from Stack overflow)
  function new_count(word) {
    console.log(word);
    try {
      word = word.toLowerCase();                                       //word.downcase!
      if (word.length <= 3) { return 1; }                               //return 1 if word.length <= 3
      if (word.match(/\d/)) { return 1; }
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '') 
      word = word.replace(/^y/, '')                               //word.sub!(/^y/, '')
      return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
    }
    catch (error) {
      console.log("error = " + error);
    }
  }
  // 3b. Calculate total number of syllables in a sentence
  // pass each word into 'new_count' function (syllable count) from words array
  function number_of_syllables(finalSentences) {
    let count = 0;

    finalSentences.forEach(finalSentences => {
      const words = finalSentences.split(' ')
      words.forEach(word => {
        count += new_count(word)
      })
    });

    console.log(count);

    return count
  }
  /**
   * ATTEMPT AT MANUAL FORMULA
   * 
   * const RE = 206.835 - (1.015 * ASL) - (84.6 * ASW)
   * const ASL = number_of_words(sentences) / (sentences.length)
   * const ASW = number_of_words(sentences) / (output_syllables)
   */

  // The Flesch API takes the calculated values for word, sentence and syllable to calcualte the Flesch reading ease SCORE
  // sentence = number of sentences
  // word = number of words
  // syllable = nuber of syllables
  let score = flesch({ sentence: (finalSentences.length), word: number_of_words(finalSentences), syllable: output_syllables })

  return (
    <div className="App">
      <div id="main_section">
        <div id="box-1">
          <div id="title-header">
            <p>www.flesch.co.uk</p>
            <h1>Readability Checker</h1>
            <h2 className="subheading">Check your content's readability.</h2>
            <h2 className="subheading">Reach wider audiences.</h2>
          </div>
        </div>
        <div id="main-area" class="flex-container">
          <div id="text-area">
            <TextField
              id="standard-multiline-static"
              label="Input Sentence"
              placeholder={input}
              multiline
              rows=""
              variant="standard"
              style={{ outline: "none", flexGrow: 1 }}
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
          </div><div id="score-area">
            <div id="results">
              <h1>Your results</h1>
              <div id="results-circle">
                <h2 >{score ? Math.round((score + Number.EPSILON) * 100) / 100 : "Invalid Input"}</h2>
              </div>
              <h3>Flesch reading ease score</h3>
            </div>
            <div id="linebreak"></div>
            <div id="statistics">
              <h4>syllables: {output_syllables}</h4>
              <h4>sentences: {sentences.length}</h4>
              <h4>words: {number_of_words(sentences)}</h4>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div class="footer-left">
          <h1>
            What do we do?
          </h1>
          <p>
            It’s simple! We check the readability of your content, using the Flesch reading ease scale.
          </p>
          <p>We recommend aiming for a score of 60 and above. This means your content will be easily understood by 13-15 year old students.
          </p>
        </div>
        <div class="break"></div>
        <div class="footer-right">
          <h1>Why check Readability?</h1>
          <p>If you do not use too many difficult words and you keep your sentences short, the check will pass. Your score will show up in green if your text’s reading ease score is higher than 60. Why this number? Because, for web copy, a reading ease of 60-70 is considered acceptable. Translated into simpler terms, that means that a good web text should be easily understood by a 13-15-year-old.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
