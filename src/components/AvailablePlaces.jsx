import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
import useFetch from '../hooks/useFetch.js';


async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();
  console.log("places", places);
  return new Promise((resolve, reject) => {
       try {
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          resolve(sortedPlaces);
        }, error => {
          console.log(`error getting position:`, error);
          resolve(places);//todo: resolving with unsorted results, due to MacOS position error
        });
       } catch(error) {
        console.log(`error getting location or sorting values ${error}`);
        reject(error);
       }
  });
}


export default function AvailablePlaces({ onSelectPlace }) {
  const {isFetching, data: availablePlaces, error, setData: setAvailablePlaces} = useFetch(fetchSortedPlaces, []);

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
