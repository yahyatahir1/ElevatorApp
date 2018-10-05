import Component from '@ember/component';
import UpPeakCalculator from 'traffic-analysis/classes/calculations/up-peak';

export default Component.extend({

  // This will contain our results
  results: {},

  // // Hides text
  // isNextOne: false,
  // isNextTwo: false,

  currentSection: '1',

  isSection1: Ember.computed.equal('currentSection', '1'),
  isSection2: Ember.computed.equal('currentSection', '2'),
  isSection3: Ember.computed.equal('currentSection', '3'),


  // Check if the user has added floors
  hasFloors: Ember.computed('inputUpdated', function()
  {
    // Get the number of floors
    let numberOfFloors = Object.keys(this.get('calc.input.U')).length;

    let height = this.get('calc.input.height');

    // Check if we have more than one floor
    return numberOfFloors > 1 ? true : false;
    return height;
  }),

  inputUpdated: null,

  didInsertElement()
  {
    // Create the calculator
    let calc = new UpPeakCalculator();

    // Store the calculator instance
    this.set('calc', calc);
  },

  updateResults()
  {
    // Set the results from the calculator
    Ember.$.each(this.get('calc.output'), (key, value) => {
      this.set(`results.${key}`, value);
    });
  },

  reRunCalculator: Ember.observer('inputUpdated', 'calc.input.{LOSS,to,tc,L,pass,tl,tu,CF,CC,df,v,s,dh}', function()
  {
    // Run the calculator
    this.get('calc').run();

    // Update results
    this.updateResults();
  }),

  actions: {
    resetCalculator()
    {
      // Reset the input values
      this.set('calc.input', JSON.parse(JSON.stringify(this.get('calc.defaultInput'))));

      // Flag the input has been updated
      this.set('inputUpdated', Date.now());
    },

    // nextOne() {
    //   this.set('isNextOne', true);
    // },
    // NextTwo() {
    //   this.set('isNextTwo', true);
    // }
  }
});
