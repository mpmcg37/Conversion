var DIGITS = 3;
var showAbbr = false;
var passedAnswers = [];
var answer, difficulty, wattage, time, solution, quantity = 1, units = "Hours",
  correct = 0, attempts = 0, problems = 0, tries = 0, steps = [], step = [];
var t1 = 'How many <span class="kw">Kilowatt Hours</span> does a <span id="watts"></span> \
          Watt Lightbulb use in <span id="time"></span> \
          <span id="units"></span>?',
    t3 = 'How many <span class="kw">Kilowatt Hours</span> do <span id="quantity"></span> \
          <span id="watts"></span> Watt Lightbulbs use in \
          <span id="time"></span> <span id="units"></span>?';

$(function() {
  $( "#gen-question" ).click(genQuestion);
  $('#help').click(showSteps);
  $('#submit').hide();
  $('#answer').hide();
  $('span.kw').hide();
  $( "#submit" ).click(getAnswer);
  $('input:radio[name=difficulty]').click(function() {
    $('#type').text(getDifficulty());
  });
  $('#abbrCheckbox').change(
    function(){
      showAbbr = !showAbbr;
      $('span.kw').text(getKWHText());
  });
  $('#type').text(getDifficulty());
  $( "input#answer" ).keyup(function(e) {
    if ( e.which == 13 ) {
      getAnswer();
    }
  });
  setAttemptedCompleted();
});
function getKWHText(){ return showAbbr ? "kWh" : "Kilowatt Hour"; }
function showSteps(){
  $('#help').toggle();
  console.log("Show Steps: ");
  console.log(step);
  $('body').append('<div class="steps">');
  step.forEach(function (item, i, array1) {
    var html = '';
    var note = ''
    if(item.length>6){
      note = item.pop();
    }
    item.forEach(function(bit, j, array2){
      if(j==1){
        return;
      }
      if(j>0){
        if (j<array2.length-2){
          if(item[1].indexOf('/') != -1){
            bit += '</div><div class="divide">&divide';
          } else if(item[1].indexOf('*') != -1) {
            bit += '</div><div class="multiply">x';
          }
        }else if (j==array2.length-2) {
          bit += '</div><div class="equals">=';
        }
      }
      html += '<div class="bit" id="'+ (j == 0 ? 'title' : j) +'"> ' +bit+ '</div>';
    });
    if(note.length > 0){
      html = '<div class="note"">('+note+')</div>'+html;
    }
    console.log(html);
    $('.steps').append('<div class="step" id="'+i+'">'+html+'</div>').scrollTop(1000);
  });
  $('html, body').animate({scrollTop: $("footer").offset().top}, 2000);
}
function setAttemptedCompleted() {
  if(attempts > 0) {
    $('.correct').text('Correct: '+ (correct/attempts).toFixed(2) * 100 +'%');
  }
  if(problems > 0) {
    $('.total').text('Question #'+problems);
  }
  if(tries>0){
    $('#help').show();
  }else {
    $('#help').hide();
  }
}
function getAnswer() {
  setAttemptedCompleted();
  answer = parseFloat( $( "input#answer" ).val() ).toFixed(DIGITS);
  if(answer > 0) { showSolution(); }
}
function genQuestion() {
  step = [];
  $('#submit').show();
  $('#answer').show();
  $('span.kw').show();
  setTimeout(function() {
    $('div#messages').slideUp(1000);
  }, 3000);
  $( "input#answer" ).val('');
  $('.steps').remove();
  $('html, body').animate({scrollTop: $('#submit').offset().top}, 500);
  problems++;
  tries = 0;
  setAttemptedCompleted();
  var html = t1;
  switch(difficulty) {
    case 'Easy':
      $('.question').html(t1);
      quantity = 1;
      units = "Hours";
      break;
    case 'Medium':
      $('.question').html(t3);
      randomQuantity();
      units = "Hours";
      break;
    case 'Hard':
      $('.question').html(t3);
      randomQuantity();
      randomUnits(randomNum(1, 4, 1));
      break;
    default:
      break;
  }
  passedAnswers = [];
  randomWattage();
  randomTime();
  genSolution();
}
function randomQuantity() {
  quantity = randomNum(2, 99, 1);
  $('#quantity').text(stringifyNumber(quantity));
  return quantity;
}
function genSolution() {
  solution = calcSolution(wattage, time);
  step.push(['Answer', '=', solution+getKWHText()]);
}
function convertTime(t) {
  var r = t;
  switch(units) {
    case 'Days':
      r = 24 * t;
      step.push(['Convert Hours to Days', '*', t, 24, r.toFixed(DIGITS), '24 hours in a day']);
      break;
    case 'Weeks':
      r = 7 * 24 * t;
      step.push(['Convert Hours to Weeks', '*', t, 7, 24, r.toFixed(DIGITS), '7 Days per Week']);
      break;
    case 'Months':
      r = 30 * 24 * t;
      step.push(['Convert Hours to Months', '*', t, 24, 30, r.toFixed(DIGITS), 'Use 30 days per month']);
      break;
    case 'Years':
      r = 365 * 24 * t;
      step.push(['Convert Hours to Years', '*', t, 24, 365, r.toFixed(DIGITS), 'Use 365 days per year']);
      break;
    default:
      break;
  }
  return r;
}
function stringifyNumber(n) {
  var s = '';
  if(n<20) {
    var num = n.toString(10);
    s = tens(num);
  } else {
    var a_Nums = n.toString(10).split('').reverse();
    for(var i = a_Nums.length - 1; i >= 0; i--) {
      s += cToDigits(a_Nums[i],i) + (i==0 ? '' : ' ');
    }
  }
  return n%10 == 0 ? s : s.replace(' ', '-');
}
function cToDigits(n, digits) {
  var s;
  switch(digits) {
    case 0:
      s = tens(n);
      break;
    case 1:
      s = hundreds(n);
      break;
    default:
      s = 'zero';
      break;
    }
    return s;
}
function tens(n) {
  var s = '';
  switch(n){
    case '1':
      s = 'one';
      break;
    case '2':
      s = 'two';
      break;
    case '3':
      s = 'three';
      break;
    case '4':
        s = 'four';
        break;
    case '5':
        s = 'five';
        break;
    case '6':
        s = 'six';
        break;
    case '7':
        s = 'seven';
        break;
    case '8':
      s = 'eight';
      break
    case '9':
      s = 'nine';
      break;
    case '10':
      s = 'ten';
      break;
    case '11':
      s = 'eleven';
      break;
    case '12':
      s = 'twelve';
      break;
    case '13':
      s = 'thirteen';
      break;
    case '15':
      s = 'fifteen';
      break;
    case '18':
      s = 'eighteen';
      break;
    case '14':
    case '16':
    case '17':
    case '19':
      s = tens(n.charAt(1))+'teen';
      break;
    default:
      break;
  }
  return s;
}
function hundreds(n) {
  var s ='';
  switch(n){
    case '2':
      s = 'twenty';
      break;
    case '3':
      s = 'thirty';
      break;
    case '4':
        s = 'forty';
        break;
    case '5':
        s = 'fifty';
        break;
    case '6':
    case '7':
    case '9':
      s = tens(n)+'ty';
      break;
    case '8':
      s = 'eighty';
      break;
    default:
      break;
  }
  return s;
}
function getDifficulty() {
  difficulty = $('input:radio[name=difficulty]:checked').val();
  units = "Hours";
  return ' '+difficulty+' ';
}
function calcSolution(w, t) {
  var cKw = wToKw(w);
  var cTime = convertTime(time);
  var sol = ( cKw *cTime ).toFixed(DIGITS);
  step.push(['Multiply Hours by Wattage', '*', cTime, cKw, sol]);
  return sol;
}
function wToKw(w) {
  var kw = w/1000;
  var tKW = (kw*quantity).toFixed(DIGITS);
  step.push(['Convert Watts to Kilowatts', '/', w, 1000, kw]);
  if(quantity > 1){
    step.push(['Multiply by the number of Lightbulbs', '*', kw, quantity, tKW]);
  }
  return tKW;
}
function randomWattage() {
  wattage = randomNum(10, 23, 5);
  $('#watts').text(wattage);
  return wattage;
}
function randomNum(min, max, stepSize) { return Math.floor(Math.random() * max) * stepSize + min; }
function randomUnits(n) {
  switch(n) {
    case 1:
      units = 'Days';
      break;
    case 2:
      units = 'Weeks';
      break;
    case 3:
      units = 'Months';
      break;
    case 4:
      units = 'Years';
      break;
    default:
      units = 'Hours';
      break;
  }
  return units;
}
function randomTime() {
  switch(units) {
    case 'Days':
      time = randomNum(1, 7, 1);
      break;
    case 'Weeks':
      time = randomNum(1, 8, 1);
      break;
    case 'Months':
      time = randomNum(1, 12, 1);
      break;
    case 'Years':
      time = randomNum(1, 100, 1);
      break
    default:
      time = randomNum(1, 24, 1);
      break;
  }
  if(time === 1) {
    units = units.replace('s','');
  } else if (units.indexOf('s') == -1) {
    units += 's';
  }
  $('#units').text(units);
  $('#time').text(time);
  return time;
}
function isSolutionPartOfAnswer(){ return answer.toString().replace('.','').indexOf((solution*1000).toString()) != -1; }
function compliment(){
  return "Good Job";
}
function error(){
  return "Not Quite";
}
function showSolution() {
  if(solution && answer) {
    steps.push(step);
    attempts++;
    $('div#messages').hide();
    if(passedAnswers.length == 0) { tries++; }
    passedAnswers.push(answer);
    if(solution == answer) {
      correct++;
      $('div#messages').text(compliment()).addClass("pass").fadeIn(1000);
      $( "#gen-question" ).click();
      passedAnswers = [];
    } else if (isSolutionPartOfAnswer()) {
      setTimeout(function() {
        $('div#messages').slideUp(1000);
      }, 3000);
      $('div#messages').text("So close! Did you convert Watts to Kilowatts?").addClass("error").fadeIn(1000);
    } else {
      setTimeout(function() {
        $('div#messages').slideUp(1000);
      }, 3000);
      $('div#messages').text(error()).addClass("error").fadeIn(1000);
    }
  }
  setTimeout(function() {
    $('div#messages').removeClass("error");
    $('div#messages').removeClass("pass");
  }, 2000);
  setAttemptedCompleted();
}
