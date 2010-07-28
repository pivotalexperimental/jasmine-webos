---
layout: main.html
title: Jasmine webOS

---

# Jasmine webOS

Jasmine webOS is a library that allows you to use Jasmine to test-drive Palm&reg; webOS&trade; applications. [Jasmine](http://pivotal.github.com/jasmine) provides the syntax for specs and the environment to execute them. Jasmine webOS adds platform-specific testing pieces for testing Scene Assistants, the Palm Depot, Ajax calls and the like.

This guide assumes you already have the Palm Mojo SDK installed and have (at least) an application generated on your file system. Jasmine webOS is known to be compatible with Palm webOS v.1.4.x.

___DOWNLOAD FILE HERE___

## How It Works

Jasmine webOS defines a convention for plugins into webOS applications, allowing collections of JavaScript code to be
included into Palm Mojo applications apart from an application's code & other resources. This is distinct & unrelated
from Palm's PDK (Plugin Development Kit).

When your application has Jasmine webOS installed, you run your specifications by launching it with a parameter telling Jasmine webOS to execute your Jasmine specs, and report the results in webOS UI on the emulator or on a device.

___IMAGE HERE OF RED/GREEN BAR___

## How To Use It

  * Download Jasmine and Jasmine webOS
  * Add the Jasmine code to your application
  * Write specs
  * Launch your app to tell it to run tests

More detailed instructions are in the [User's Guide](guide.html)

## Contact

  * Discussion List: jasmine-webos@googlegroups.com
  * Development Discussion List: jasmine-webos-dev@googlegroups.com
  * Tracker Project: http://pivotaltracker.com/projects
  * Twitter: @jasmine_webos

## Contributing

We're happy to accept pull requests that come with specs. Please look at the repo and keep your code in the same style. Please let us know what you're up to on the development mailing list.

## About & Thanks

Big thanks to Pivotal Labs, Palm, and all the Mobile Pivots who have contributed: Rajan, Xian, Adam, Carl, JB, (another) Adam, Nathan, Joseph, Erik, Tyler, Chris, Carl, Kelly, Joe, Jonathan, Justin, Ryan, Bosh, and anyone I've missed.
