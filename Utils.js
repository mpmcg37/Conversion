var Random = function() {
    return {
        number: function (min, max, stepSize) {
            return Math.floor(Math.random() * max) * stepSize + min;
        },

        units: function() {
            switch (Random.number(1, 4, 1)) {
                case 1: return 'Days';
                case 2: return 'Weeks';
                case 3: return 'Months';
                case 4: return 'Years';
                default: return 'Hours';
            }
        }
    }
}();

var StringUtils = function () {
    var DIGITS = 3;

    var Ones = {
        1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten'
    };
    var Tens = {
        2: 'twenty', 3: 'thirty', 4: 'forty', 5: 'fifty', 8: 'eighty',
        11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 18: 'eighteen'
    };

    function prettyPrintCharacter(n, digits) {
        if (digits === 1)
            return teens(n);
        if (digits === 2)
            return ones(n) + ' hundred';
        if (digits === 3)
            return ones(n) + ' thousand';
        return '';
    }

    function ones(n) {
        return Ones[n] || '';
    }

    function teens(n) {
        switch (n) {
            case '14':
            case '16':
            case '17':
            case '19':
                return ones(n.charAt(1)) + 'teen';
            case '6':
            case '7':
            case '9':
                return ones(n) + 'ty';
            default:
                return Tens[n] || '';
        }
    }

    function between20and10000(num) {
        var prettyNumber = '';
        var digitCharacters = num.toString(10).split('').reverse();
        for (var i = digitCharacters.length - 1; i > 0; i--) {
            prettyNumber += prettyPrintCharacter(digitCharacters[i], i) + ' ';
        }
        return prettyNumber + ones(digitCharacters[0]);
    }

    return {
        displayDigits: function (num) {
            return num.toFixed(DIGITS);
        },

        stringifyNumber: function (num) {
            if (num === 0)
                return 'zero';
            if (num <= 10)
                return Ones[num];
            if (num < 20)
                return Tens[num];

            return between20and10000(num);
        }
    };
}();