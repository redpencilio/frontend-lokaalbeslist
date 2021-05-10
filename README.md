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
There are also some things that are exceptions that should be removed, such as the use of 'zitting' in the mu-search results and here internally. Clean up as you see fit.

All content (things rendered to users) is in Dutch only.

### Name & Logo

The logo is Redpencil logo changed to the default Bulma primary color to be more politically neutral. **There is no logo in the Navbar yet**.

The name is under discussion, the repo is called `frontend-poc-participation`, which should be replaced everywhere when the repo name is changed in GH as well.
In content (e.g. rendered to users) the placeholder string `XXXParticipatie` is used, you can easily grep on it when a name is decided.
