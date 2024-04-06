/**Given a signed 32-bit integer x, return x
 *  with its digits reversed. If reversing x 
 * causes the value to go outside the signed 
 * 32-bit integer range [-231, 231 - 1], then 
 * return 0. */

class Solution {
  reverse(x) {
    let num = String(x);
    num = num.split('').reverse().join('');
    if (num[num.length - 1] === '-') {
      num = '-' + num.slice(0, num.length - 1);
    }
    let res = parseInt(num);
    return Math.abs(res) < Math.pow(2, 31) ? res : 0;
  }
}

// Example usage:
const solution = new Solution();
console.log(solution.reverse(123)); // Output: 321
console.log(solution.reverse(-123)); // Output: -321
console.log(solution.reverse(120)); // Output: 21
