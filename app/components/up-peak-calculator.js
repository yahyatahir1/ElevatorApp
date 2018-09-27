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

  actions: {
    runCalculator()
    {
      // Run the calculator
      this.get('calc').run();

      // Update results
      this.updateResults();
    }
  }
});
