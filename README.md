Hapi Application Server for OpenShift
=====================================

Run one or more application services together, in a single OpenShift gear. 
Compose the application by configuration. Provides OpenShift platform support.

* Reduce the number of OpenShift gears you need by running multiple services under one application
* Compose your server from plugins
* Test your plugins independently of the larger application

Please see the Backlog section below for a list of current tasks.


Dependencies
------------

Install all application dependencies:

  npm install


Configuration
-------------

This module uses Glue (https://github.com/hapijs/glue) to compose the
application server. The Glue manifest should be stored in the config/
folder and is loaded automatically using Config (https://www.npmjs.com/package/config).
See the Config documentation for a description of the way configuration
files are loaded.

See the example folder for a demonstration of how an application with
multiple services can be composed from plugins.


OpenShift Environment Variables
-------------------------------

The following is a partial listing of OpenShift environment variables that are
present on your NodeJS gear:

HISTFILE=.history
OPENSHIFT_APP_DNS   The application’s fully qualified domain name that your cartridge is a part of
OPENSHIFT_APP_NAME  The validated user assigned name for the application. Black list is system dependent.
OPENSHIFT_APP_UUID  OpenShift assigned UUID for the application
OPENSHIFT_DATA_DIR  The directory where your cartridge may store data
OPENSHIFT_GEAR_DNS  The gear’s fully qualified domain name that your cartridge is a part of. May or may not be equal to OPENSHIFT_APP_DNS
OPENSHIFT_GEAR_NAME OpenShift assigned name for the gear. May or may not be equal to OPENSHIFT_APP_NAME
OPENSHIFT_GEAR_UUID OpenShift assigned UUID for the gear
OPENSHIFT_HOMEDIR   OpenShift assigned directory for the gear
OPENSHIFT_REPO_DIR  The directory where the developer’s application is "archived" to and will be run from.
OPENSHIFT_TMP_DIR   The directory where your cartridge may store temporary data
TMPDIR              Alias for OPENSHIFT_TMP_DIR
TMP                 Alias for OPENSHIFT_TMP_DIR

To see the full listing of environment variables, use the rhc tool to ssh to
your gear. Enter the following command at the console to print all variables:

    printenv


License
-------

See the LICENSE file.


Backlog
-------

* Basic logging plugin, setup to demonstrate configuration for OpenShift.
* HAProxy configuration (manifest.yml) to direct traffic to listeners on different ports
* Improve documentation.
