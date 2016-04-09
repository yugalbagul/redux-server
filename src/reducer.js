import {setEntries, next, vote, INITIAL_STATE , restart} from './core';
import {currentVotings} from '../index';


export default function reducer(state = INITIAL_STATE, action) {
 console.log(action);
  //console.log(currentVotings);
  switch (action.type) {
  case 'SET_ENTRIES':
     return setEntries(state, action.entries);
  case 'NEXT':
    return next(state);
  case 'VOTE':
    return state.update('vote',
                        voteState => vote(voteState, action.entry));
  case 'RESET':
     return restart(state);

  }
  return state;
}