//Framework to add more thorough DOM tests using Enzyme

//Need to add an enzyme adaptor with support for React +17

import React from 'react';
import { shallow } from 'enzyme';
import { Recordings  } from '../src/components/Recordings'
import renderer from 'react-test-renderer';

it('Checks export panel is correct when activated', () => {
  const recordings = shallow(  
      <Recordings></Recordings>
  );
    expect (recordings.text()).toEqual('');
});