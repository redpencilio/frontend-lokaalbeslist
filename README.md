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
cd frontend-gelinkt-notuleren

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
