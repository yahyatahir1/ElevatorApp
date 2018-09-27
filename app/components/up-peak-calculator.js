import Component from '@ember/component';
import UpPeakCalculator from 'traffic-analysis/classes/calculations/up-peak';

export default Component.extend({

  // This will contain our results
  results: {},

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

  reRunCalculator: Ember.observer('calc.input.{LOSS,to,tc,L,pass,tl,tu,CF,CC,df,v}', function()
  {
    // Run the calculator
    this.get('calc').run();

    // Update results
    this.updateResults();
  }),

  actions: {
    resetCalculator()
    {
      // Get the keys
      let keys = Object.keys(this.get('calc.defaultInput'));

      // Reset the input values
      keys.forEach(key => {
        this.set(`calc.input.${key}`, this.get('calc.defaultInput')[key]);
      });
    }
  }
});
