import axios from 'axios';
import { Api } from 'src/data/aircrafts';
import {fHppl} from './f-hppl.mock';
import {ymlFhppl} from './yml-f-hppl.mock';
import {ymlIndex} from './yml-index.mock';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

it('returns a list of aircrafts', async () => {
  // Arrange
  mockedAxios.get.mockResolvedValue({
    data: ymlIndex })

  // Act
  const result = await new Api().getAirCraftList();

  // Assert
  expect(result).toEqual([ 'f-bubk', 'f-hppl' ]);
});

it('returns an empty list', async () => {
  // Arrange
  mockedAxios.get.mockResolvedValue({
    data: '' })

  // Act
  const result = await new Api().getAirCraftList();

  // Assert
  expect(result).toEqual([]);
});

it('returns an aircraft', async () => {
  // Arrange
  mockedAxios.get.mockResolvedValue({
    data: ymlFhppl} )

  // Act
  const result = await new Api().getAircraft('f-hppl');

  // Assert
  expect(result).toEqual(fHppl);
});


it('returns an empty list of aircrafts', async () => {
  // Arrange
  mockedAxios.get.mockResolvedValue({
    data: ''} )

  // Act
  const result = await new Api().getAircraft('f-hppl');

  // Assert
  expect(result).toEqual(undefined);
});

