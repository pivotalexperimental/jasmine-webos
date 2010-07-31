# Jasmine webOS v1.0.0

If you want to use Jasmine webOS in a [Palm webOS](http://developer.palm.com) project, please go to the [home page]() and download the code.

This repo is for development on the plugin itself.

## Dependencies

To run Jasmine webOS's specs, you need to have Ruby and the following rubygems installed on your system:

  * rake
  * colored
  * json
  * jasmine

Additionally, you need to have installed the [Palm webOS SDK]().

## Organization

Jasmine webOS defines a convention for plugins into webOS applications, allowing collections of JavaScript code to be included into Palm Mojo applications apart from an application's code & other resources.  This is distinct & unrelated from Palm's PDK (Plugin Development Kit).

These plugins cannot be tested completely by themselves, so this repo is itself a webOS application that includes the Jasmine webOS plugin (in `<app_root>/plugins/jasmine-webos`).

## How to Run Specs

The subset of specs that test code that do not depend on Mojo (Palm's application framework) can be run in any browser when using the Jasmine gem.  All specs can be run in the Palm webOS emulator or on a device - the results will be presented in Mojo UI.

### Browser Specs

Once the Jasmine gem is installed, in a terminal window cd to the root of the repo and run: `rake jasmine`.  Point your browser to the URL you're told to (default is `http://localhost:8888`) and the specs will run.

**Note**: While any browser should run these specs, it is recommended to use a webkit-based browser such as Chrome or Safari as they are closer to what runs on webOS.

### All Specs

If all of the browser specs pass, then you should run the specs on the emulator.  With an emulator open, `rake` from the repo root will build Jasmine webOS, package the test harness application, install on the emulator and run the application such that the specs will run.

The test harness application is a normal webOS Mojo application, but it responds to a launch argument of `{"runTests": true}`. This launch argument causes the Jasmine `TestAssistant` to run, which executes the Jasmine specs and reports the results in webOS UI - a red/green progress bar & a list of failed specs.  If the app is launched without this argument (say, by clicking on the app in the launcher), you will see a page telling you to launch the app with the correct arguments from your command line.

## Contributing & Discussion

We are happy to look at any pull request that comes with specs. Discussion can be had in our development email list on Google Groups.


