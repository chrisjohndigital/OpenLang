//Framework to add more thorough class tests using Jest

import React from 'react';
import { LiveVideo  } from '../src/components/LiveVideo';
import { ControlPanel  } from '../src/components/ControlPanel'
import { Recordings  } from '../src/components/Recordings'
import { Picker  } from '../src/components/Picker'
import renderer from 'react-test-renderer';

console.log ('Building snapshots');

test('LiveVideo Class', () => {
  const component = renderer.create(
    <LiveVideo></LiveVideo>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  console.log (tree);
});
test('ControlPanel Class', () => {
  const component = renderer.create(
    <ControlPanel></ControlPanel>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  console.log (tree);
});
test('Recordings Class', () => {
  const component = renderer.create(
    <Recordings></Recordings>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  console.log (tree);
});
test('Picker Class', () => {
  const component = renderer.create(
    <Picker></Picker>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  console.log (tree);
});