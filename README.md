# frontend-lokaalbeslist

This the frontend for LokaalBeslist.be, formerly called "poc-participatie" or
"Toepassing voor Allerhande Burger Participatie (TABP)".

## Setting up the backend

Information on setting up the backend can be found at
<https://github.com/redpencilio/app-lokaalbeslist>

## Running the frontend

We advise the use of `edi` but have chosen to include the default ember commands
to limit confusion.

First make sure you have `ember-cli` installed

```shell
npm install -g ember-cli
```

Next we clone this repository, install the dependencies, and boot the
development server

```shell
git clone https://github.com/redpencilio/frontend-lokaalbeslist.git
cd frontend-lokaalbeslist

# install the dependencies
npm install

# run the development server
ember s --proxy http://localhost:81

# or
npm start
```

You can visit the live reloading site at `http://localhost:4200`.

## Dev Info

### Architecture & Logic

The app follows the typical architectural layout of an Ember app, reading an
introduction to Ember might prove very useful. That said, some statements about
the code base:

- The entry point for the search is of course the `search` route in `/routes`,
  and mainly the request made to `mu-search` in the `model()` hook. A new
  request is made each time the query state changes (e.g. a filter is added,
  page is changed), as that is reflected in the URL, triggering a new `model()`
  call.
- The root of rendering tree is the `components/search/search.hbs` Component. We
  generally need to make changes to it's 2 most relevant children: the `filters`
  and the `results`.
- A lot of logic & configuration is defined in `utils/`.
- An example is the query state mentioned above, which is generally managed
  through the `QueryStateManager`, which should be a singleton being accessed in
  both the `Route` and the `Controller`. This defines how the query state should
  be update, how it translates from and to the URL query parameters, and how it
  translates into mu-search parameters.
- Another big item is `utils/attributes.ts`, which is a configuration for each
  attribute of a search result (see, and update when changed,
  `utils/search-result.d.ts` for that). This configuration is centralized so
  that when attributes are added/edited/removed, it can be done in a single
  place and it is clear what configuration needs to be present. A disadvantage
  is that logic is decoupled from the components using this configuration. We
  believe the benefits outweigh the disadvantages.

### CSS & Styling

We use [Bulma](https://bulma.io/) for styling. We try to use it as much as
possible in the Glimmer templates. Only sporadically we need some custom CSS,
which is all defined in `styles/app.scss`, of which currently at least half the
content is making sure the scrollbar is in the component we want.

### Icons

We use [Feather](https://github.com/feathericons/feather) icons with a
[ember-modifier](https://github.com/ember-modifier/ember-modifier) modifier as
specified in [this issue](https://github.com/feathericons/feather/issues/506).
There are examples plenty in the code base (search for `render-feather-icons`).

### Language

We try to keep everything all code & everything internally in English. There are
some exceptions, such as the [models]('./app/models/'), as it is a lot easier to
work with the Ember Data & Model APIs and logic this way, combined with
mu-resource JSON API that is in Dutch.

While this is sometimes confusing, as all mu-search properties are in English,
it does provide an easy way to tell with which data source you are working with
in a component. It is not great for component re-use.

If anything else is off, clean up as you see fit.

All content (things rendered to users) is in Dutch only.

One might need to add custom Inflector rules for pluralization to make Ember
Data work nicely. See`app/initializers/custom-inflector-rules.ts`.

### Embedded rendering

This application explicitly tries to support embedded rendering in an iframe
(e.g. on the municipality website) with some filters preset (actually only the
governance area currently).

Therefore most of the search interface is in a component, as opposed to a route
template, and the route templates for both embedded and not embedded search are
minimal imports of that component. Route & Controller logic are identical, so it
is written only once and extended for the `search` and `search-embedded` routes.

To test the application as rendered in an iframe (as opposed to visiting the
embed URL directly), use `tests/embed-test.html`, or visit the info for
municipalities.

### Logo

The logo is redpencil.io logo changed to the default Bulma primary color to be
more politically neutral. **There is no logo in the Navbar yet**.
