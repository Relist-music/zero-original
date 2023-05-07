import { useContext } from 'react';
import { FilterContext } from '@/components/Playlist';
import Image from 'next/image';
import prettyMilliseconds from 'pretty-ms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { GenreAggregateV1, usefullArtist } from '@/types/myTypes';
import { TableCheckboxCell } from './TableCell';
import UMBRELLA_WITH_SUBGENRES from '@/data/UMBRELLA_WITH_SUBGENRES.json';

const TableRow = ({ richGenreTrack }: { richGenreTrack: GenreAggregateV1 }) => {
  const { filters, setFilters, useUmbrellaGenres } = useContext(FilterContext);

  return (
    <tr key={richGenreTrack.trackId}>
      <TableCheckboxCell />
      <td>
        <div className="flex gap-x-2 pb-2">
          <Image
            src={richGenreTrack.album.images[1].url}
            alt={richGenreTrack.album.name}
            width="72"
            height="72"
          />
          <div>
            <h6 className="font-semibold text-xl">
              {richGenreTrack.trackName}
            </h6>
            <div id="artists" className="flex gap-x-1">
              {richGenreTrack.trackArtists.map((artist: usefullArtist) => (
                <span key={artist.id} className="text-sm">
                  {artist.name}
                </span>
              ))}
            </div>
            <span className="text-xs">{richGenreTrack.album.name}</span>
          </div>
        </div>
      </td>
      <td
        className="max-w-[60rem]"
        // style={{ maxWidth: '100px' }}
      >
        <div id="genres" className="flex flex-wrap gap-x-1">
          {richGenreTrack.genres.length === 0 ? (
            <span className="text-switzer italic font-medium">
              No genres 😱
            </span>
          ) : useUmbrellaGenres ? (
            richGenreTrack.genres
              .map((genre: string) => {
                let value = genre;
                UMBRELLA_WITH_SUBGENRES.forEach((umbrella) => {
                  const foundSubGenre = umbrella.subGenres.find(
                    (subgenre) => subgenre === genre,
                  );

                  if (foundSubGenre) {
                    value = umbrella.umbrella;
                  }
                });
                return value;
              })
              .reduce((accumulator: string[], currentValue) => {
                if (!accumulator.includes(currentValue)) {
                  accumulator.push(currentValue);
                }
                return accumulator;
              }, [])
              .map((groupedGenre, index) => {
                console.log('groupedGenre', groupedGenre);
                return (
                  <span
                    className="underline font-apfel text-gray-600 cursor-pointer hover:text-gray-900"
                    key={`${richGenreTrack.trackId}-${groupedGenre}-${index}`}
                    onClick={() => {
                      if (!filters.includes(groupedGenre)) {
                        setFilters([...filters, groupedGenre]);
                      }
                    }}
                  >
                    {groupedGenre}
                  </span>
                );
              })
          ) : (
            richGenreTrack.genres.map((genre, index) => (
              <span
                className="underline font-apfel text-gray-600 cursor-pointer hover:text-gray-900"
                key={`${richGenreTrack.trackId}-${genre}-${index}`}
                onClick={() => {
                  if (!filters.includes(genre)) {
                    setFilters([...filters, genre]);
                  }
                }}
              >
                {genre}
              </span>
            ))
          )}
        </div>
      </td>
      <td>
        <span>
          {prettyMilliseconds(richGenreTrack.duration_ms, {
            secondsDecimalDigits: 0,
            keepDecimalsOnWholeSeconds: true,
          })}
        </span>
      </td>
      <td>
        <div>
          <FontAwesomeIcon className="text-green-600" icon={faSolidHeart} />
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
