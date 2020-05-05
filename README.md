👷 WIP 👷

# knockout-cli

A simple CLI initializer for new knockout projects.

## Getting started

The easiest way to set up a new project is with `npx`. Use the `create` command to initialize it.

```
npx knockout-cli create my-app
```

Alternatively, install the package globally.

```
yarn global add knockout-cli
```

```
npm install -g knockout-cli
```

Now, `cd` into the new project directory and run `yarn start`/`npm start` to start the development server.

## CLI Reference
### create
```
Usage: knockout-cli create [options] <app-name>

create a new project powered by knockout-cli

Options:
  -t, --template <template-name>           select a template for the new project
  -p, --package-manager <package-manager>  select the package manager used
  -h, --help                               display help for command
```

**It's 2020. Why in the world did you make this?**

That's a very good question. A little boredom, a little insanity. Also, developers still write knockout. This is a simple tool for creating new knockout projects with semi-modern tools without having to fiddle with configuration much. The concept is borrowed from other JS frameworks, like React (create-react-app), Vue (vue-cli), and even Ember (which is heavily CLI-driven).

