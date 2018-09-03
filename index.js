var App = function() {
    var passedAnswers = [];
    var answer, wattage, time, solution, quantity = 1, units = "Hours",
        correct = 0, attempts = 0, problems = 0, tries = 0, steps = [];

    function getAnswer() {
        Display.setAttemptedCompleted(correct, attempts, problems, tries);
        answer = StringUtils.displayDigits(parseFloat($("input#answer").val()));
        if (answer > 0)
            showSolution();
    }

    function isSolutionPartOfAnswer() {
        return answer.toString().replace('.', '').indexOf((solution * 1000).toString()) !== -1;
    }

    function showSolution() {
        if (solution && answer) {
            attempts++;
            Messages.hide();
            if (passedAnswers.length === 0) {
                tries++;
            }
            passedAnswers.push(answer);
            if (solution === answer) {
                correct++;
                Messages.showMessageWithFadeIn(Messages.compliment, "pass", 1);
                genQuestion();
                passedAnswers = [];
            } else {
                Messages.slideUpAfterTimeout(3);
                Messages.showMessageWithFadeIn(isSolutionPartOfAnswer() ? Messages.conversionError : Messages.error, "error", 1);
            }
        }
        Messages.removeClassesAfterTimeout(2);
        Display.setAttemptedCompleted(correct, attempts, problems, tries);
    }

    function genQuestion() {
        steps = [];
        $('#submit').show();
        $('#answer').show();
        $('span.kw').show();
        Messages.slideUpAfterTimeout(3);
        $("input#answer").val('');
        $('.steps').remove();
        $('html, body').animate({scrollTop: $('#submit').offset().top}, 500);
        problems++;
        tries = 0;
        Display.setAttemptedCompleted(correct, attempts, problems, tries);
        var quantityUnits = Display.generateQuestion();
        quantity = quantityUnits[0];
        units = quantityUnits[1];
        passedAnswers = [];

        wattage = Random.number(10, 23, 5);
        $('#watts').text(wattage);

        randomTime();
        calculateSolution(wattage, time);
    }

    function convertTime(t) {
        var r = t;
        switch (units) {
            case 'Days':
                r = 24 * t;
                addConversionStep(units, t, [24], r, '24 hours in a day');
                break;
            case 'Weeks':
                r = 7 * 24 * t;
                addConversionStep(units, t, [7, 24], r, '7 Days per Week');
                break;
            case 'Months':
                r = 30 * 24 * t;
                addConversionStep(units, t, [24, 30], r, 'Use 30 days per month');
                break;
            case 'Years':
                r = 365 * 24 * t;
                addConversionStep(units, t, [24, 365], r, 'Use 365 days per year')
                break;
            default:
                break;
        }
        return r;
    }

    function addConversionStep(units, input, multipliers, result, message) {
        var step = ['Convert Hours to '+units, '*', input];
        multipliers.forEach(function(operation){
            step.push(operation)
        })
        step.push(StringUtils.displayDigits(result), message);
        steps.push(step);
    }

    function calculateSolution(w, time) {
        var kilowatts = wattsToKilowatts(w);
        var convertedTime = convertTime(time);
        solution = StringUtils.displayDigits(kilowatts * convertedTime);
        addStep('Multiply Hours by Wattage', '*', convertedTime, [kilowatts], solution);
        steps.push(['Answer', '=', solution +' '+ Display.KWHText()]);
    }

    function wattsToKilowatts(w) {
        var kw = w / 1000;
        var tKW = StringUtils.displayDigits(kw * quantity);
        addStep('Convert Watts to Kilowatts', '/', w, [1000], kw);
        if (quantity > 1)
            addStep('Multiply by the number of Lightbulbs', '*', kw, [quantity], tKW);

        return tKW;
    }

    function addStep(message, operation, input, operations, result) {
        var step = [message, operation, input]
        operations.forEach(function(operation){
            step.push(operation)
        })
        step.push(result);
        steps.push(step);
    }

    function randomTime() {
        switch (units) {
            case 'Days':
                time = Random.number(1, 7, 1);
                break;
            case 'Weeks':
                time = Random.number(1, 8, 1);
                break;
            case 'Months':
                time = Random.number(1, 12, 1);
                break;
            case 'Years':
                time = Random.number(1, 100, 1);
                break
            default:
                time = Random.number(1, 24, 1);
                break;
        }

        $('#units').text(time === 1 ? units.replace('s', '') : units);
        $('#time').text(time);
        return time;
    }

    return {
        ready: function () {
            $("#gen-question").click(genQuestion);
            $('#help').click(function(e) { Display.showSteps(steps); });

            $('#submit').hide();
            $('#answer').hide();
            $('span.kw').hide();

            $("#submit").click(getAnswer);

            $('input:radio[name=difficulty]').click(Display.changeDifficulty);
            $('#abbrCheckbox').change(Display.toggleShowAbbreviation);
            Display.setDifficulty();

            $("input#answer").keyup(function (e) {
                if (e.which === 13)
                    getAnswer();
            });

            Display.setAttemptedCompleted(correct, attempts, problems, tries);
        }
    };
}();

$(App.ready);