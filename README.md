# Movie List Coding Challenge
Summary
Write a web app that allows users to create lists and add movies to them. The app should also
allow users to rate movies. No restrictions on technology as long as you provide clear
instructions on how to run the app. Once you’re done with the assignment, provide a Github link.

Requirements
1. Create a form that allows users to create a new movie list.
a. The only requirement is that the list has a name.
2. Create a view that allows the user to see all of their movies lists.
a. This page should display the name, average rating, and number of movies for
each list.
b. Clicking a list will take the user to the list page.
3. Create a view that allows a user to view a movie list.
a. This page should display the name of the list and all the movies in the list.
b. This page should display relevant movie information (title, year of release, genre)
for each movie in the list, as well as the user's rating.
c. The user should be able to rate a movie. Movie ratings are global, i.e., if the
movie is in another list, the rating applies to that list as well. Feel free to
implement whatever type of ratings system you want (5 stars, thumbs up/down,
rotten tomatoes style, etc.)
d. The user should be able to sort the movies by name or rating.
e. The user should be able to filter the movies by title.
f. The user should be able to remove a movie from the list.
g. The user should be able to add a movie to the list.
h. The page should display the average rating of all of it’s movies.
4. Create a view that allows the user to search IMDb and add movies to 1 or many lists.
a. This page should display relevant IMDb information (title, year of release, genre)
for each movie in the search results, as well as the user's rating.
b. Clicking a movie should allow the user to add that movie to 1 or many existing
lists, as well as give it a rating. Feel free to implement whatever type of selection
UI you want.
5. Do not expose the API key to the client


DONE:

tech stack:
- Next.js (frontend)
- Semantic.UI-React (frontend)
- GraphQL (frontend, backend)
- Node.js (backend)
- Apollo Client/Server (frontend, backend)
- MongoDB (backend)