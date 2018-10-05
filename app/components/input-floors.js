import Component from '@ember/component';

export default Component.extend({

  // New floor
  newFloor: {
    population: null
  },

  actions: {
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
    }
  }
});
