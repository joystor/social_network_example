# Network Project

This application was developed with Django and React

The structure of the project is:
```
├───network
│   ├───static
│   │   └───network
│   │       └───protected
│   ├───templates
│   │   └───network
└───project4
```

## project4
Here are the application configurations, in this are not changes.

## network

Here is the django models, views and urls to build in the backend the application and the necesary files to render the frontent app in React

### static/network

In this path are the React application, every component are in his own file the principal files are static/network/main.jsx and whne the user is loged the app load static/network/protected/mainProtected.jsx.

### templates

In this path are the templates used by django views and load all scripts to load the react application.
