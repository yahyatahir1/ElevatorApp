/**
 * This calculates the up peak interval and capacity of elevators
 * @access public
 * @example
 * // Create the calculator
 * let calc = new UpPeakCalculator();
 *
 * // Run the calculator
 * calc.run();
 *
 * // Log the results
 * calc.log();
 */
export default class UpPeakCalculator
{
  /**
   * The class constructor
   */
  constructor()
  {
    /**
     * This is the default input property
     * @type {object}
     */
    this.defaultInput = {

      // Capacity factor (%)
      'CF': 82,

      // Car (rated) capacity (persons)
      'CC': 6,

      // Number of floors above main terminal
      'N': 0,

      // Population of floors (persons)
      'U': {
        '1': 0
      },

      // Jerk (m/s/s/s)
      'j': 1.4,

      // Passenger loading time per person (s)
      'tl': 1.2,

      // Passenger unloading time per person (s)
      'tu': 1.2,

      // Average inter-floor height (m)
      'df': 2.4,

      // Contract (rated) speed (m/s) - one of 1, 1.5, 2.5, 3.5 or 5
      'v': 1,

      // Acceleration (m/s/s)
      'a': {
        '1': 0.4,
        '1.5': 0.7,
        '2.5': 0.8,
        '3.5': 1,
        '5': 1.2
      },

      // Single Floor Flight Time, 3.3m floor height (s)
      'tfl': {
        '1': 7,
        '1.5': 6,
        '2.5': 4.8,
        '3.5': 4,
        '5': 3.7
      },

      // Door closing time (s)
      'tc': 2.9,

      // Door opening time (s)
      'to': 1.8,

      // Round trip time losses (%)
      'LOSS': 5,

      // Number of elevators
      'L': 4,

      // Number of Passengers
      'pass': 5
    };

    /**
     * This is the input property
     * @type {object}
     */
    this.input = JSON.parse(JSON.stringify(this.defaultInput));

    /**
     * This is the output property
     * @type {object}
     */
    this.output = {};
  }

  /**
   * Returns the value of a property or calculated value from a {@link UpPeakCalculator} instance.
   * @return {Mixed}
   * @param {string} value The key of the property or calculated value to retrieve.
   * @example
   * calc.get('RTT');
   */
  get(value)
  {
    // It's an input value
    if (this.input[value]) {
      return isNaN(parseFloat(this.input[value])) ? this.input[value] : parseFloat(this.input[value]);
    }

    // It's a calculated value
    switch (value) {
      case 'P':
        return this.calculateP();
      break;

      case 'Ueff':
        return this.calculateUeff();
      break;

      case 'H':
        return this.calculateH();
      break;

      case 'S':
        return this.calculateS();
      break;

      case 'tp':
        return this.calculateTp();
      break;

      case 'tv':
        return this.calculateTv();
      break;

      case 'T':
        return this.calculateT();
      break;

      case 'ts':
        return this.calculateTs();
      break;

      case 'RTT':
        return this.calculateRTT();
      break;

      case 'RTTPL':
        return this.calculateRTTPL();
      break;

      case 'UPPINT':
        return this.calculateUPPINT();
      break;

      case 'UPPHC':
        return this.calculateUPPHC();
      break;

      case 'POP':
        return this.calculatePOP();
      break;
    }
  }

  /**
   * Calculates the average number of passenger assumed to load into a car during up peak traffic
   * @return {number}
   * @example
   * calc.get('P');
   */
  calculateP()
  {
    return this.get('CF') / 100 * this.get('CC');
  }

  /**
   * Calculates the effective building population of the buildings
   * @return {number}
   * @example
   * calc.get('Ueff');
   */
  calculateUeff()
  {
    // Set the start value
    let value = 0;

    // Get the keys
    let keys = Object.keys(this.get('U'));

    // Calculate the total
    keys.forEach(i => {
      value += this.get('U')[i];
    });

    // Return the value
    return value;
  }

  /**
   * Calculates the average highest reversal floor
   * @return {number}
   * @example
   * calc.get('H');
   */
  calculateH()
  {
    // Set the start value
    let value = 0;

    // Calculate the total
    for (let j = 1; j <= (this.get('N') - 1); j++) {
      let value2 = 0;

      for (let i = 1; i <= j; i++) {
        value2 += Math.pow(
          this.get('U')[i] / this.get('Ueff'), this.get('P')
        );
      }

      value += value2;
    }

    // Return the value
    return this.get('N') - value;
  }

  /**
  * Calculates the average number of stops made by the lift during its round trip
  * @return {number}
  * @example
  * calc.get('S');
  */
  calculateS()
  {
    // Set the start value
    let value = 0;

    // Calculate the total
    for (let i = 1; i <= this.get('N'); i++) {
      value += Math.pow(
        1 - (this.get('U')[i] / this.get('Ueff')), this.get('P')
      );
    }

    // Return the value
    return value;
  }

  /**
  * Calculates the average time taken for a single person to load or unload the lift
  * @return {number}
  * @example
  * calc.get('tp');
  */
  calculateTp()
  {
    return (this.get('tl') + this.get('tu')) / 2;
  }

  /**
  * Calculates the time taken for the lift to travel between two adjacent floors at rated speed
  * @return {number}
  * @example
  * calc.get('tv');
  */
  calculateTv()
  {
    return this.get('df') / this.get('v');
  }

  /**
  * Calculates the cycle time is the time to travel a single floor, and open/close the doors
  * @return {number}
  * @example
  * calc.get('T');
  */
  calculateT()
  {
    return this.get('tfl')[this.get('v')] + this.get('tc') + this.get('to');
  }

  /**
  * Calculates the delay or “time consumed” by making a single stop
  * @return {number}
  * @example
  * calc.get('ts');
  */
  calculateTs()
  {
    return this.get('T') - this.get('tv');
  }

  /**
  * Calculates the Round Trip Time is the time taken for the travel to/from the highest reversal floor at contract speed, plus the delay for each stop, plus the time for the passengers to load/unload.
  * @return {number}
  * @example
  * calc.get('RTT');
  */
  calculateRTT()
  {
    return (
      (2 * this.get('H') * this.get('tv')) + (this.get('S') + 1) * this.get('ts') + (2 * this.get('P') * this.get('tp'))
    );
  }

  /**
  * Calculates the Round Trip Time in addition to any losses. Some designers add 5-10% to the Round Trip Time for “losses” associated with controller inefficiencies, passengers holding the doors, and so on.
  * @return {number}
  * @example
  * calc.get('RTTPL');
  */
  calculateRTTPL()
  {
    return this.get('RTT') + (this.get('RTT') * (this.get('LOSS') / 100));
  }

  /**
  * Calculates the up peak interval is calculated by dividing the round trip time by the number of lifts.
  * @return {number}
  * @example
  * calc.get('UPPINT');
  */
  calculateUPPINT()
  {
    return this.get('RTT') / this.get('L');
  }

  /**
  * Calculates the up peak handling capacity is the number of passengers transported in a five minute period.
  * @return {number}
  * @example
  * calc.get('UPPHC');
  */
  calculateUPPHC()
  {
    return 300 * this.get('P') * this.get('L') / this.get('RTT');
  }

  /**
  * Calculates the handling capacity, expressed as a percentage of the building population transported in five minutes
  * @return {number}
  * @example
  * calc.get('POP');
  */
  calculatePOP()
  {
    return this.get('UPPHC') * 100 / this.get('Ueff');
  }

  /**
  * Runs the full calculation and stores the values in the output property of the {@link UpPeakCalculator} instance.
  * @return {number}
  * @example
  * calc.run();
  */
  run()
  {
    // Set the values to calculate
    let valuesToCalculate = [
      'P',
      'Ueff',
      'H',
      'S',
      'tp',
      'tv',
      'T',
      'ts',
      'RTT',
      'RTTPL',
      'UPPINT',
      'UPPHC',
      'POP'
    ];

    // Calculate and store the values
    valuesToCalculate.forEach(value => {
      this.output[value] = this.get(value);
    });
  }

  /**
  * Logs the results stored in the output property of the {@link UpPeakCalculator} instance.
  * @return {number}
  * @example
  * calc.log();
  */
  log()
  {
    // Log the input and output data
    console.log('Input: ', this.input);
    console.log('\r\n');
    console.log('Output: ', this.output);
  }

  /**
  * Resets the calculator to it's default values.
  * @return {number}
  * @example
  * calc.log();
  */
  log()
  {
    // Log the input and output data
    console.log('Input: ', this.input);
    console.log('\r\n');
    console.log('Output: ', this.output);
  }
}

// // Create the calculator
// let calc = new UpPeakCalculator();
//
// // Run the calculator
// calc.run();
//
// // Log the results
// calc.log();
