var Display = function() {
    var showAbbr = false;
    var difficulty;

    var easyQuestion = 'How many <span class="kw">Kilowatt Hours</span> does a <span id="watts"></span> \
          Watt Lightbulb use in <span id="time"></span> \
          <span id="units"></span>?';

    var difficultQuestion = 'How many <span class="kw">Kilowatt Hours</span> do <span id="quantity"></span> \
          <span id="watts"></span> Watt Lightbulbs use in \
          <span id="time"></span> <span id="units"></span>?';

    function getDifficulty() {
        difficulty = $('input:radio[name=difficulty]:checked').val();
        return ' ' + difficulty + ' ';
    }

    function randomQuantity() {
        var quantity = Random.number(2, 99, 1);
        $('#quantity').text(StringUtils.stringifyNumber(quantity));
        return quantity;
    }

    return {
        elements: {
            messages: function () { return $('div#messages'); }
        },

       toggleShowAbbreviation: function () {
           showAbbr = !showAbbr;
           $('span.kw').text(Display.KWHText());
       },

        changeDifficulty: function () {
            $('#type').text(getDifficulty());
        },

        generateQuestion: function() {
            var quantity, units;
            switch (difficulty) {
                case 'Easy':
                    $('.question').html(easyQuestion);
                    quantity = 1;
                    units = "Hours";
                    break;
                case 'Medium':
                    $('.question').html(difficultQuestion);
                    quantity = randomQuantity();
                    units = "Hours";
                    break;
                case 'Hard':
                    $('.question').html(difficultQuestion);
                    quantity = randomQuantity();
                    units = Random.units();
                    break;
                default:
                    break;
            }
            return [quantity, units];
        },

        setAttemptedCompleted: function(correct, attempts, problems, tries) {
            if (attempts > 0) {
                $('.correct').text('Correct: ' + (correct / attempts).toFixed(2) * 100 + '%');
            }
            if (problems > 0) {
                $('.total').text('Question #' + problems);
            }
            if (tries > 0) {
                $('#help').show();
            } else {
                $('#help').hide();
            }
        },

        setDifficulty: function () { $('#type').text(getDifficulty()); },

        KWHText: function() { return showAbbr ? "kWh" : "Kilowatt Hour"; },

        showSteps: function(steps) {
            $('#help').toggle();
            $('body').append('<div class="steps">');
            steps.forEach(function (item, i, array1) {
                var html = '';
                var note = ''
                if (item.length > 6) {
                    note = item.pop();
                }
                item.forEach(function (bit, j, array2) {
                    if (j == 1) {
                        return;
                    }
                    if (j > 0) {
                        if (j < array2.length - 2) {
                            if (item[1].indexOf('/') != -1) {
                                bit += '</div><div class="divide">&divide';
                            } else if (item[1].indexOf('*') != -1) {
                                bit += '</div><div class="multiply">x';
                            }
                        } else if (j == array2.length - 2) {
                            bit += '</div><div class="equals">=';
                        }
                    }
                    html += '<div class="bit" id="' + (j == 0 ? 'title' : j) + '"> ' + bit + '</div>';
                });
                if (note.length > 0) {
                    html = '<div class="note"">(' + note + ')</div>' + html;
                }
                $('.steps').append('<div class="step" id="' + i + '">' + html + '</div>').scrollTop(1000);
            });
            $('html, body').animate({scrollTop: $("footer").offset().top}, 2000);
        }
   }
}();

var Messages = function () {
    return {
        compliment: 'Good Job',
        error: 'Not Quite',
        conversionError: 'So close! Did you convert Watts to Kilowatts?',

        slideUpAfterTimeout: function(timeoutSeconds) {
            setTimeout(function () {
                Display.elements.messages().slideUp(1000);
            }, timeoutSeconds * 1000);
        },

        removeClassesAfterTimeout: function (timeoutSeconds) {
            setTimeout(function () {
                Display.elements.messages().removeClass("error");
                Display.elements.messages().removeClass("pass");
            }, timeoutSeconds * 1000);
        },

        showMessageWithFadeIn: function(message, className, timeoutSeconds) {
            Display.elements.messages().text(message).addClass(className).fadeIn(timeoutSeconds * 1000);
        },

        hide: function() {
            Display.elements.messages().hide()
        },
    };
}();