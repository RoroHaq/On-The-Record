# Music Sales/Streams

### [Top Streamed Spotify songs](https://www.kaggle.com/datasets/irynatokarchuk/top-streamed-spotify-songs-by-year-2010-2023)

### [BilldBoard top 100 over the years](https://www.kaggle.com/datasets/dhruvildave/billboard-the-hot-100-songs)

## API EndPoints

- `/api/get_genre/:genre?year=2017` This returns the genre Object with the data of that certain year, this examplke wants a genre from 2017
- `/api/get_genre/:genre` This returns all the genre objects with the data from all years
- `/api/billboard/?year=2017` return a list of songs and their genres that were on the billboard top 100 in a given year

possibility:
- `/api/songs/detail/:name` This returns the details of a song

## Visualization
The User will learn about the correlations between song streams, their genre and their ranking on the billdboard "The Hot 100" to see if different genres are represented differently in popularity vs Billdboard top 100 placement.

ex, if pop has 30% of all listens, are pop songs 30% of the billboard top 100?
## Views

## Functionality

- When a user scrolls through the website, A graph will be in focus and soon fade in/out depending on the year they are in.
- A rotating Vinyl disc that acts like an aesthetic

## Features and Priorities

Core Feature:
- An Interactive Graph showing the music Data of a certain year

Optional Features:
- Making the Vinyl Spin

## Dependencies

- We'll be using some Graphing Libraries to display our Data so 