/*Creating a pure function to add a movie to current state 
to create a new state*/

import {expect} from 'chai';
import {List, Map} from 'immutable';

describe('immutability', () => {

  // ...

  describe('a tree', () => {
  	/*Using .update function provided by immutable.js */
    function addMovie(currentState, movie) {
  		return currentState.update('movies', movies => movies.push(movie));
	}

    it('is immutable', () => {
      let state = Map({
        movies: List.of('Trainspotting', '28 Days Later')
      });
      let nextState = addMovie(state, 'Sunshine');

      expect(nextState).to.equal(Map({
        movies: List.of(
          'Trainspotting',
          '28 Days Later',
          'Sunshine'
        )
      }));
      expect(state).to.equal(Map({
        movies: List.of(
          'Trainspotting',
          '28 Days Later'
        )
      }));
    });

  });

});

