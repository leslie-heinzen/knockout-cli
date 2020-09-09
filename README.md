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
  -t, --template <template-name>           select a template for the new project. Options: default.
  -p, --package-manager <package-manager>  select the package manager used. Options: npm, yarn.
  -a, --add-on <add-on>                    include optional features. Options: router. (default: [])
  -h, --help                               display help for command.
```

### add-ons

Additional features can be included in app creation by providing a comma-delimited list of desired features to the `--add-on` create option. Currently available:

- `router`: Includes @profiscience/knockout-contrib-router front-end router in the new project, with a very minimal router.
