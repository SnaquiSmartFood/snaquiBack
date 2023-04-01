/**
 *
 * @param {String} stringLet string To Capitalize
 * @returns String
 */
const toCapitalizeFirstLetter = (stringLet) => {
  const first = stringLet[0];
  const Rest = stringLet.substring(1);
  return first.toUpperCase() + Rest;
};

/**
 *
 * @param {String} stringLet Sentence to Capitalize
 * @returns String
 */
const toCapitalize = (stringLet) => {
  const palabras = stringLet.split(" ");
  const finalString = [];
  palabras.forEach((palabra) => {
    finalString.push(toCapitalizeFirstLetter(palabra));
  });
  return finalString.join(" ");
};

/**
 * 
 * @param {String|Number} value the number that its gonna be formated
 * @returns String
 */
function formatNumbersDot(value) {
  var num = `${value}`.replace(/\./g, "");
  if (!isNaN(num)) {
    num = num
      .toString()
      .split("")
      .reverse()
      .join("")
      .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
    // eslint-disable-next-line no-useless-escape
    num = num.split("").reverse().join("").replace(/^[\.]/, "");
    return num;
  } else {
    //alert("Solo se permiten numeros");
    return `${value}`
  }
}

/**
 * 
 * @param {int} num length of the string
 * @param {String} characters the characters that will use
 * @returns 
 */
function generateRandomString(num=5, characters = "abcdefghijklñmnopqrstuvwxyz") {
  let result1 = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result1;
}

const Base64 = {
  _keyStr: "VABwFGHIJKLMNOPrstuvTU789abWXxy456QRSCDEYZ0123efghijklmnopqcdz",//"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

  encode: function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = Base64._utf8_encode(input);

      while (i < input.length) {

          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
              enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
              enc4 = 64;
          }

          output = output +
              this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
              this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

      }

      return output;
  },

  decode: function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

          enc1 = this._keyStr.indexOf(input.charAt(i++));
          enc2 = this._keyStr.indexOf(input.charAt(i++));
          enc3 = this._keyStr.indexOf(input.charAt(i++));
          enc4 = this._keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }

      }
      output = Base64._utf8_decode(output.substring(0, output.length - 1));

      return output;

  },

  _utf8_encode: function (string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

          var c = string.charCodeAt(n);

          if (c < 128) {
              utftext += String.fromCharCode(c);
          }
          else if ((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
          }

      }

      return utftext;
  },

  _utf8_decode: function (utftext) {
      var string = "";
      var i = 0, c = 0, c3 = 0, c2 = 0;

      while (i < utftext.length) {

          c = utftext.charCodeAt(i);

          if (c < 128) {
              string += String.fromCharCode(c);
              i++;
          }
          else if ((c > 191) && (c < 224)) {
              c2 = utftext.charCodeAt(i + 1);
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
              i += 2;
          }
          else {
              c2 = utftext.charCodeAt(i + 1);
              c3 = utftext.charCodeAt(i + 2);
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
              i += 3;
          }

      }

      return string.replace(/\u0000/g, "");
  }
}

module.exports = {
  toCapitalizeFirstLetter,
  toCapitalize,
  formatNumbersDot,
  generateRandomString,
  Base64

}