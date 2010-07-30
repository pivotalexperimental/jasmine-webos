---
layout: default
title: Jasmine webOS

---

# JavaScript BDD for Palm&reg; webOS&trade;

Jasmine webOS is a JavaScript library that allows you to use [Jasmine](http://pivotal.github.com/jasmine), a BDD testing framework for JavaScript, to test-drive Palm&reg; webOS&trade; applications. Jasmine provides the syntax for specs and the environment to execute them. Jasmine webOS adds platform-specific testing pieces for testing Scene Assistants, the Palm Depot, Ajax calls, etc. and a way to execute specs and view the results on a webOS emulator or phone.

This guide assumes you already have the Palm Mojo SDK installed and have (at least) an application generated on your file system. Jasmine webOS is known to be compatible with Palm webOS v.1.4.x.

## Download

___DOWNLOAD FILE HERE___

## How It Works

Jasmine webOS defines a convention for plugins into webOS applications, allowing collections of JavaScript code to be
included into Palm Mojo applications apart from an application's code & other resources. This is distinct & unrelated
from Palm's PDK (Plugin Development Kit).

When your application has Jasmine webOS installed, you run your specifications by launching it with a parameter telling Jasmine webOS to execute your Jasmine specs and report the results in webOS UI (emulator or phone).

<img src="img/red.png" title="Green!" alt="Passing Specs in webOS UI" style="width:240px;">
<img src="img/green_long.png" title="Green!" alt="Passing Specs in webOS UI" style="width:240px;">

## How To Use It

  * Download Jasmine and Jasmine webOS
  * Add the Jasmine code to your application
  
Then...
  
  * Write specs
  * Launch your app to run tests
  * Repeat

More detailed instructions are in the [Users' Guide](guide.html)

## Contact

  * Discussion List: jasmine-webos@googlegroups.com
  * Development Discussion List: jasmine-webos-dev@googlegroups.com
  * Tracker Project: http://pivotaltracker.com/projects
  * Twitter: @jasmine_webos

## Contributing

If you're interested in contributing please join the dev email list and [clone the repository](http://github.com/pivotal/jasmine-webos).  We're happy to accept pull requests that come with specs.

## About & Thanks

Big thanks to [Pivotal Labs](http://pivotallabs.com), [Palm](http://developer.palm.com), and all the Mobile Pivots who have contributed: Rajan, Xian, Adam, Carl, JB, (another) Adam, Nathan, Joseph, Erik, Tyler, Chris, Carl, Kelly, Joe, Jonathan, Justin, Ryan, Bosh, and anyone I've missed.
