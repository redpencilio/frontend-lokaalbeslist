# frontend-poc-participatie

This the frontend for the POC on civil participation, also called "Toepassing voor Allerhande Burger Participatie (TABP)".

## Setting up the backend

Information on setting up the backend can be found at <https://github.com/redpencilio/app-poc-participatie>

## Running the frontend

We advise the use of edi but have chosen to include the default ember commands to limit confusion.

First make sure you have ember-cli installed

```shell
npm install -g ember-cli
```

Next we clone this repository, install the dependencies, and boot the development server

```shell
git clone https://github.com/redpencilio/frontend-poc-participatie.git
cd frontend-poc-participatie

# install the dependencies
npm install

# run the development server
ember s --proxy http://localhost:81

# or
npm start
```

You can visit the live reloading site at `http://localhost:4200`.

## Dev Info

### Icons

We use [Feather](https://github.com/feathericons/feather) icons with a [ember-modifier](https://github.com/ember-modifier/ember-modifier) modifier as specified in [this issue](https://github.com/feathericons/feather/issues/506).

### Language

We try to keep everything all code & everything internally in English. There are some exceptions, such as the [models]('./app/models/'), as it is a lot easier to work with the Ember Data & Model APIs and logic this way, combined with mu-resource JSON API that is in Dutch.
While this is sometimes confusing, as all mu-search properties are in English, it does provide an easy way to tell with which data source you are working with in a component. It is not great for component re-use.

If anything else is off, clean up as you see fit.

All content (things rendered to users) is in Dutch only.

### Embedded rendering

This application explicitly tries to support embedded rendering in an iframe (e.g. on the municipality website) with some filters preset (actually only the governance area currently).
Therefore most of the search interface is in a component, as opposed to a route template, and the route templates for both embedded and not embedded search are minimal imports of that component. Route & Controller logic are identical, so it is written only once and extended for the `search` and `search-embedded` routes.

To test the application as rendered in an iframe (as opposed to visiting the embed URL directly), use <./tests/embed-test.html>, or visit the info for municipalities.

### Name & Logo

The logo is Redpencil logo changed to the default Bulma primary color to be more politically neutral. **There is no logo in the Navbar yet**.

The name is under discussion, the repo is called `frontend-poc-participation`, which should be replaced everywhere when the repo name is changed in GH as well.
In content (e.g. rendered to users) the placeholder string `XXXParticipatie` is used, you can easily grep on it when a name is decided.
