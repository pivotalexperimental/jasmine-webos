# Jasmine webOS

Jasmine webOS is a library that allows you to use Jasmine to test-drive Palm&reg; webOS&trade; applications. 

This guide assumes you already have the Palm Mojo SDK installed and have (at least) an application generated on your file system. Jasmine webOS is known to be compatible with Palm webOS v.1.4.x.

## Download and Install

  1. Download the Jasmine webOS zipfile
  1. Unzip it into the root of your application. You should now have a `plugins/jasmine-webos` directory
  1. Download [Jasmine](http://pivotal.github.com/jasmine)
  1. Extract `jasmine.js` into `plugins/jasmine-webos/app/lib`
  1. Add these two entries into your application's `sources.json` file, preferably after all your application code. Order is important: `jasmine.js` _must_ be before `jasmine-webos.js`
  
    `{ "source": "plugins/jasmine-webos/app/lib/jasmine.js"},
    { "source": "plugins/jasmine-webos/app/lib/jasmine-webos.js"}`
    
## How It Works

Jasmine webOS defines a convention for plugins into webOS applications, allowing collections of JavaScript code to be
included into Palm Mojo applications apart from an application's code & other resources. This is distinct & unrelated
from Palm's PDK (Plugin Development Kit).

When your application has Jasmine webOS installed, you run your specifications by launching it with a parameter of
`{"runTests": true}`. Jasmine webOS will take over your application, execute your Jasmine specs, and report the results in
webOS UI on the emulator or on a device.

## Writing Specs

Now that you can run specs, you need to write some. Here's how.

### Setup

  1. Make a `spec` directory in the root of your application
  1. Build a directory tree under `spec` similar to your application. For example, `spec/app/assistants`, `spec/app/models`, etc.
  1. For each file in `app` you should have a corresponding file in `spec/app`. So if you have a file that handles foo in `app/models/foo.js`, your spec file should be `spec/models/foo-spec.js`
  1. When you create a spec file, make sure to include that file in `sources.json` _after_ the Jasmine files. To extend the example:
  
  `{ "source": "plugins/jasmine-webos/app/lib/jasmine.js"},
  { "source": "plugins/jasmine-webos/app/lib/jasmine-webos.js"},
  { "source": "spec/models/foo-spec.js"}`

### Mojo-independent Code

For any code that does not make any Palm Mojo API calls, writing your specs is straightforward. Write your specs according to the [Jasmine User's Guide]().

### Mojo Scene Assistants

Mojo Scene Assistants are a little more complicated. Under test, you do not have a fully created scene assistant. You do have an in-memory DOM, but Mojo does not know about it. This means you cannot fire an event and expect your handlers to be called. But you can manipulate your DOM elements and then verify that they've changed appropriately - checking classes, visibility, or contents.

### Add Spec Files to `sources.json`

All of your spec files need to be added to `sources.json` _after_ the Jasmine files (see the example above). If these entries are not in `sources.json` then Jasmine will not know about your specs and thus won't be able to run them.

## Running Specs

  1. Ensure that a Palm Emulator is running (you can run your tests on a phone, but they will run more slowly)
  1. Package & install your application as normal; ensure that it is not running
  1. From your command line, you need to launch the application with the correct parameter so the tests run:
  
  `palm-launch -p '{"runTests": true}'`
  
Your app will come up and you should see Jasmine output like this:

IMAGE HERE

A progress bar, Jasmine version information, and the expectation results. If all your specs pass, the bar will be green. If any spec fails, the bar will be red and the failed specs will be listed. You can click on any failing spec to see the results of each expectation. At any time you can tap the 'All Results' button to see the results of all specs, passing and failing.

## Excluding Specs from Production

The Jasmine webOS plugin, Jasmine, and your spec files should not be included in your application when submitted to Palm for distribution. While this code will not affect your application, it does increase the time it takes to load.

Remove these files from `sources.json` and exclude your `spec` directory when packaging. See Palm's SDK documentation for how to do this.

## About & Thanks

Jasmine webOS is the product of nearly 18 months of work at Pivotal Labs writing webOS applications for clients and ourselves. First we wrote [Jasmine](http://pivotal.github.com/jasmine) in order to test drive webOS applications. We quickly found that we needed more in a test framework to handle Scene Assistants, the Palm Depot, Ajax calls and the like. Jasmine webOS is a more usable grouping of the essential code so that agile developers can test drive robust applications on the platform.

Big thanks to Pivotal Labs, Palm, and all the Mobile Pivots who have contributed: Rajan, Xian, Adam, Carl, JB, (another) Adam, Erik, Carl, Kelly, Joe, Jonathan, Ryan, Bosh, and anyone I've missed.

## Contact



## Contributing


