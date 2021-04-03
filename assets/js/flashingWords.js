var buttonEl = document.querySelector('#start');
var buttonE2 = document.querySelector('#stop');
var commentEl = document.querySelector('#comment');
var titleEl = document.querySelector('#articleTitle');
var urlEl = document.querySelector('#url');
var wpmEl = document.querySelector('#wpm');
var readerEl = document.querySelector('#reader');
var currentTimer = null;

function processWord(word) {
  var center = Math.floor(word.length / 2);
  var letters = word.split('');
  var result = [];
  return letters.map(function(letter, idx) {
    if (idx === center) {
      return '<span class="highlight">' + letter + '</span>';
    }
    return letter;
  }).join('');
}

function positionWord() {
  var wordEl = readerEl.firstElementChild;
  var highlight = wordEl.firstElementChild;

  var centerOffsetX = (highlight.offsetWidth / 2) + highlight.offsetLeft;
  var centerOffsetY = (highlight.offsetHeight / 2) + highlight.offsetTop;

  wordEl.style.left = ((readerEl.clientWidth / 2) - centerOffsetX) + 'px';
  wordEl.style.top = ((readerEl.clientHeight / 2) - centerOffsetY) + 'px';
}

buttonEl.addEventListener('click', function() {

  buttonEl.innerHTML = "Restart"

  if (urlEl.value != "") {
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://lexper.p.rapidapi.com/v1.1/extract?url=" + urlEl.value,
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "f46e5c8c90msh9778f06fc8c5a49p16d051jsn87608541b961",
        "x-rapidapi-host": "lexper.p.rapidapi.com"
      }
    };

    $.ajax(settings).done(function (response) {
      console.log(response);


      var words = response.article.text.split(/\s+/).map(processWord);
      var currentWord = 0;
      var delay = 60000 / parseInt(wpmEl.value, 10);
      var url = urlEl.value;
      titleEl.innerHTML = response.article.title;

      clearTimeout(currentTimer);

      var displayNextWord = function() {
        var word = words[currentWord++];
        // WTB> nlp.js...
        //var hasPause = /^\(|[,\.\)]$/.test(word);

        // XSS?! :(.
        readerEl.firstElementChild.innerHTML = word;
        positionWord();

        if (currentWord !== words.length) {
          currentTimer = setTimeout(displayNextWord, delay );
        }
      };

      displayNextWord();
    });
  } else {

      var words = commentEl.textContent.split(/\s+/).map(processWord);
      var currentWord = 0;
      var delay = 60000 / parseInt(wpmEl.value, 10);
      var url = urlEl.value;

      clearTimeout(currentTimer);

      var displayNextWord = function() {
        var word = words[currentWord++];
        // WTB> nlp.js...
        //var hasPause = /^\(|[,\.\)]$/.test(word);

        // XSS?! :(.
        readerEl.firstElementChild.innerHTML = word;
        positionWord();

        if (currentWord !== words.length) {
          currentTimer = setTimeout(displayNextWord, delay );
        }
      };

      displayNextWord();
  }

});

buttonE2.addEventListener('click', function() {

  clearTimeout(currentTimer);

});

