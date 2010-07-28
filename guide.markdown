---
layout: main.html
title: Jasmine webOS

---

# Jasmine webOS Users' Guide

Here are more detailed instructions on how to get Jasmine webOS into your Palm&reg; webOS&trade; application.

## Download and Install

  1. Download the Jasmine webOS zipfile
  1. Unzip it into the root of your application. You should now have a `plugins/jasmine-webos` directory
  1. Download [Jasmine](http://pivotal.github.com/jasmine)
  1. Extract `jasmine.js` into `plugins/jasmine-webos/app/lib`
  1. Add these two entries into your application's `sources.json` file, preferably after all your application code. Order is important: `jasmine.js` _must_ be before `jasmine-webos.js`

    { "source": "plugins/jasmine-webos/app/lib/jasmine.js"},
    { "source": "plugins/jasmine-webos/app/lib/jasmine-webos.js"}


## Writing Specs

Now that you can run specs, you need to write some. Here's how.

### Setup

  1. Make a `spec` directory in the root of your application
  1. Build a directory tree under `spec` that mirrors your application code. For example, `spec/app/assistants`, `spec/app/models`, etc.
  1. For each file in `app` you should have a corresponding file in `spec/app`. So if you have a file that handles foo in `app/models/foo.js`, your spec file should be `spec/models/foo-spec.js`
  1. When you create a spec file, make sure to include that file in `sources.json` _after_ the Jasmine files. To extend the example from above:

    { "source": "plugins/jasmine-webos/app/lib/jasmine.js"},
    { "source": "plugins/jasmine-webos/app/lib/jasmine-webos.js"},
    { "source": "spec/models/foo-spec.js"}

### Mojo-independent Code

For any code that does not make any Palm Mojo API calls, writing your specs is straightforward. Write your specs according to the [Jasmine User's Guide](). The [sample app]() has more specific examples.

### Mojo Dependent Code

Any code that is dependent on Mojo has some limitations. You can test Scene Assistants, but with a few key limitations. Jasmine webOS includes a Fake Mojo Depot for testing interactions with storage and a Mock Ajax implementation for testing making calls to remote servers.

You can find examples of each in the [Sample Application]() (coming soon).

### Add Spec Files to `sources.json`

All of your spec files need to be added to `sources.json` _after_ the Jasmine files (see the example above). If these entries are not in `sources.json` then Jasmine will not know about your specs and thus won't be able to run them.

## Running Specs

  1. Ensure that a Palm Emulator is running (you can run your tests on a phone, but they will run more slowly)
  1. Package & install your application as normal; ensure that it is not running
  1. From your command line, you need to launch the application with the correct parameter so the tests run:
  
    palm-launch -p '{"runTests": true}'

Your app will come up and you should see Jasmine output like this:

IMAGE HERE

A progress bar, Jasmine version information, and the expectation results. If all your specs pass, the bar will be green. If any spec fails, the bar will be red and the failed specs will be listed. You can click on any failing spec to see the results of each expectation. At any time you can tap the 'All Results' button to see the results of all specs, passing and failing.

## Excluding Specs from Production

The Jasmine webOS plugin, Jasmine, and your spec files should not be included in your application when submitted to Palm for distribution. While this code will not affect your application, it does increase the time it takes to load.

Remove these files from `sources.json` and exclude your `spec` directory when packaging. See Palm's SDK documentation for how to do this.