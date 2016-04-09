import {List, Map} from 'immutable';


export const INITIAL_STATE = Map();

// intialize entries 
export function setEntries(state,entries) {
  
  const list = List(entries);
      return state.set('entries', list)
              .set('initialEntries', list);
  
}

// local function to decide winner. Return both when tied
function getWinners(vote) {
  if (!vote) return [];

  const [one, two,three,four] = vote.get('pair');
  const voteArray =[];
  voteArray.push(parseInt(vote.getIn(['tally', one], 0)) );
  voteArray.push(parseInt(vote.getIn(['tally', two], 0)) );
  voteArray.push(parseInt(vote.getIn(['tally', three], 0)) );
  voteArray.push(parseInt(vote.getIn(['tally', four], 0)) );
  console.log(voteArray)
  
  var getMax = 0;
  
  var indexes = [], i;
  for (i=0;i < voteArray.length;i++){
    if(voteArray[i]>getMax){
      getMax = voteArray[i];
    }
  }
  console.log(getMax);
    for(i = 0; i < voteArray.length; i++){
        if (voteArray[i] === getMax){
          if(i == 0){
            indexes.push(one);
          }
          else if(i == 1){
              indexes.push(two);
          }
          else if(i == 2){
            indexes.push(three);
          }
          else if(i == 3){
            indexes.push(four);
          }
        }
    }       
    console.log(indexes) 
    return indexes;
  
}

export function next(state, round = state.getIn(['vote', 'round'], 0)) {
  console.log("state -----------------")
  console.log(state);
  const entries = state.get('entries')
                       .concat(getWinners(state.get('vote')));
  if (entries.size === 1) {
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first());
  } else {

    if(entries.size < 4 ){
      var takeCount = entries.size
    }
    else{
      takeCount = 4;
    }
    return state.merge({
      vote: Map({
        round: round + 1,

        pair: entries.take(takeCount)
      }),
      entries: entries.skip(takeCount)
    });
  }
}

export function restart(state) {
  const round = state.getIn(['vote', 'round'], 0);
  return next(
    state.set('entries', state.get('initialEntries'))
         .remove('vote')
         .remove('winner'),
    round
  );
}

function removePreviousVote(voteState, voter) {
  const previousVote = voteState.getIn(['votes', voter]);
  if (previousVote) {
    return voteState.updateIn(['tally', previousVote], t => t - 1)
                    .removeIn(['votes', voter]);
  } else {
    return voteState;
  }
}

function addVote(voteState, entry, voter) {
  console.log("Add vote function");
  console.log(voteState);
  console.log(entry);
  console.log(voter);
  if (voteState.get('pair').includes(entry)) {
    return voteState.updateIn(['tally', entry], 0, t => t + 1)
                    .setIn(['votes', voter], entry);
  } else {
    return voteState;
  }
}

export function vote(voteState, entry, voter) {
 console.log(voteState);
  return voteState.updateIn(
    ['tally', entry],
    0,
    tally => tally + 1
  );
}