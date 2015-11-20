NOTES
=====

This module will provide only the parent server application, logging setup.
The application will require port mapping upfront.

* load the default configuration then apply overrides from the specified config file?
* the mapping of plugins to ports should be specified in the config file
  * requires a generic function to execute mapping
* application modules can be installed using bower?
* this module should hide all openshift specific settings from the application
* this is the only module that should be deployed to openshift
* installed plugins may potentially need to be shrinkwrapped before inclusion


## Proxy Configuration

https://docs.openshift.com/enterprise/3.0/architecture/core_concepts/routes.html
http://stackoverflow.com/questions/25594841/what-is-the-proper-setup-for-haproxy-with-openshift-custom-cartridges


## References

* http://stackoverflow.com/questions/31886099/multiple-connections-on-a-hapi-server
* https://github.com/hapijs/glue
* https://github.com/hapijs/rejoice
