import Component from '@ember/component';
import UpPeakCalculator from 'traffic-analysis/classes/calculations/up-peak';

export default Component.extend({

  // This will contain our results
  results: {},

  // New floor
  newFloor: {
    population: null
  },



  // Check if the user has added floors
  hasFloors: Ember.computed('inputUpdated', function()
  {
    // Get the number of floors
    let numberOfFloors = Object.keys(this.get('calc.input.U')).length;

    // Check if we have more than one floor
    return numberOfFloors > 1 ? true : false;
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

  reRunCalculator: Ember.observer('inputUpdated', 'calc.input.{LOSS,to,tc,L,pass,tl,tu,CF,CC,df,v}', function()
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

    addNewFloor()
    {
      // Get the index of the new floor
      let newFloorIndex = Object.keys(this.get('calc.input.U')).length + 1;

      // Add the new floor with it's population
      this.set(`calc.input.U.${newFloorIndex}`, parseFloat(this.get('newFloor.population')));

      // Clear the population field
      this.set('newFloor.population', null);

      // Update the number of floors above the main terminal
      this.set('calc.input.N', newFloorIndex - 1);

      // Flag the input has been updated
      this.set('inputUpdated', Date.now());
    },

    // Hides text
    isNextShowing: false,

    actions: {
      textShow() {
        this.set('isNextShowing', true);
      }
    }
  }

});
